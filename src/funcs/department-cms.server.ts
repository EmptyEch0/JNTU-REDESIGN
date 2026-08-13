import { createServerFn } from "@tanstack/react-start";
import { sql } from "../lib/db";
import { serverCache } from "../lib/server-cache";

export type PageType =
  | "standard"
  | "faculty"
  | "labs"
  | "gallery"
  | "achievements"
  | "courses"
  | "documents"
  | "custom"
  | "external";

export interface DepartmentNavItem {
  id: number;
  deptSlug: string;
  title: string;
  slug: string;
  icon: string;
  position: number;
  parentId?: number | null;
  showInSidebar: boolean;
  status: "published" | "draft";
  pageType: PageType;
  externalUrl?: string | null;
  customPageId?: number | null;
  children?: DepartmentNavItem[];
}

export interface DepartmentPageBlock {
  id: string;
  type: string;
  visible?: boolean;
  content: Record<string, any>;
}

export interface DepartmentPageData {
  id?: number;
  deptSlug: string;
  title: string;
  slug: string;
  pageType: PageType;
  status: "published" | "draft";
  blocks: DepartmentPageBlock[];
  updatedAt?: string;
  createdAt?: string;
}

export interface PageVersion {
  id: number;
  pageId: number;
  versionNumber: number;
  blocks: DepartmentPageBlock[];
  createdBy: string;
  createdAt: string;
}

// ── Ensure tables exist on startup ──
let tablesInitialized = false;
async function ensureCmsTablesExist() {
  if (tablesInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS department_nav_items (
        id SERIAL PRIMARY KEY,
        dept_slug TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        icon TEXT DEFAULT 'BookOpen',
        position INT DEFAULT 0,
        parent_id INT REFERENCES department_nav_items(id) ON DELETE SET NULL,
        show_in_sidebar BOOLEAN DEFAULT true,
        status TEXT DEFAULT 'published',
        page_type TEXT DEFAULT 'standard',
        external_url TEXT,
        custom_page_id INT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS department_pages (
        id SERIAL PRIMARY KEY,
        dept_slug TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        page_type TEXT DEFAULT 'standard',
        status TEXT DEFAULT 'draft',
        draft_blocks JSONB DEFAULT '[]'::jsonb,
        published_blocks JSONB DEFAULT '[]'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT dept_page_unique UNIQUE (dept_slug, slug)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS department_page_versions (
        id SERIAL PRIMARY KEY,
        page_id INT NOT NULL REFERENCES department_pages(id) ON DELETE CASCADE,
        version_number INT NOT NULL,
        blocks JSONB NOT NULL,
        created_by TEXT DEFAULT 'HOD Administrator',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    tablesInitialized = true;
  } catch (err) {
    console.error("CMS Tables initialization error:", err);
  }
}

// Default navigation items if a department has no custom nav items configured yet
const DEFAULT_NAV_ITEMS: Array<Omit<DepartmentNavItem, "id" | "deptSlug">> = [
  { title: "About & Vision", slug: "", icon: "BookOpen", position: 1, showInSidebar: true, status: "published", pageType: "standard" },
  { title: "HOD's Desk", slug: "hod", icon: "Users", position: 2, showInSidebar: true, status: "published", pageType: "standard" },
  { title: "Programmes", slug: "courses", icon: "GraduationCap", position: 3, showInSidebar: true, status: "published", pageType: "courses" },
  { title: "Faculty", slug: "faculty", icon: "Users", position: 4, showInSidebar: true, status: "published", pageType: "faculty" },
  { title: "Laboratories", slug: "labs", icon: "FlaskConical", position: 5, showInSidebar: true, status: "published", pageType: "labs" },
  { title: "Achievements", slug: "achievements", icon: "Trophy", position: 6, showInSidebar: true, status: "published", pageType: "achievements" },
  { title: "Gallery", slug: "gallery", icon: "ImageIcon", position: 7, showInSidebar: true, status: "published", pageType: "gallery" },
];

/**
 * Get dynamic sidebar navigation items for a department
 */
export const getDepartmentNavItems = createServerFn({ method: "GET" })
  .inputValidator((d: { deptSlug: string; isEditMode?: boolean }) => d)
  .handler(async ({ data: { deptSlug, isEditMode = false } }) => {
    try {
      await ensureCmsTablesExist();
      const cacheKey = `dept_nav_${deptSlug}_${isEditMode ? "edit" : "live"}`;
      const cached = serverCache.get<DepartmentNavItem[]>(cacheKey);
      if (cached) return cached;

      let rows = isEditMode
        ? await sql`
            SELECT * FROM department_nav_items 
            WHERE dept_slug = ${deptSlug} 
            ORDER BY position ASC, id ASC
          `
        : await sql`
            SELECT * FROM department_nav_items 
            WHERE dept_slug = ${deptSlug} AND show_in_sidebar = true AND status = 'published'
            ORDER BY position ASC, id ASC
          `;

      // Seed default items if empty for this department
      if (!rows || rows.length === 0) {
        for (const item of DEFAULT_NAV_ITEMS) {
          await sql`
            INSERT INTO department_nav_items (dept_slug, title, slug, icon, position, show_in_sidebar, status, page_type)
            VALUES (${deptSlug}, ${item.title}, ${item.slug}, ${item.icon}, ${item.position}, ${item.showInSidebar}, ${item.status}, ${item.pageType})
          `;
        }

        rows = await sql`
          SELECT * FROM department_nav_items 
          WHERE dept_slug = ${deptSlug} 
          ORDER BY position ASC, id ASC
        `;
      }

      const formatted: DepartmentNavItem[] = rows.map((r: any) => ({
        id: r.id,
        deptSlug: r.dept_slug,
        title: r.title,
        slug: r.slug,
        icon: r.icon || "BookOpen",
        position: r.position || 0,
        parentId: r.parent_id,
        showInSidebar: Boolean(r.show_in_sidebar),
        status: r.status || "published",
        pageType: (r.page_type as PageType) || "standard",
        externalUrl: r.external_url,
        customPageId: r.custom_page_id,
      }));

      // Group nested items under parent items
      const map = new Map<number, DepartmentNavItem>();
      const rootItems: DepartmentNavItem[] = [];

      formatted.forEach((item) => {
        item.children = [];
        map.set(item.id, item);
      });

      formatted.forEach((item) => {
        if (item.parentId && map.has(item.parentId)) {
          map.get(item.parentId)!.children!.push(item);
        } else {
          rootItems.push(item);
        }
      });

      serverCache.set(cacheKey, rootItems, 5 * 60 * 1000);
      return rootItems;
    } catch (err) {
      console.error("getDepartmentNavItems failed:", err);
      // Graceful fallback to default items
      return DEFAULT_NAV_ITEMS.map((item, idx) => ({
        ...item,
        id: idx + 1,
        deptSlug,
      }));
    }
  });

/**
 * Save & Reorder Department Nav Items in Bulk
 */
export const saveDepartmentNavItems = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      deptSlug: string;
      items: Array<{
        id?: number;
        title: string;
        slug: string;
        icon: string;
        position: number;
        parentId?: number | null;
        showInSidebar: boolean;
        status: "published" | "draft";
        pageType: PageType;
        externalUrl?: string | null;
      }>;
    }) => d
  )
  .handler(async ({ data: { deptSlug, items } }) => {
    try {
      await ensureCmsTablesExist();
      for (const item of items) {
        if (item.id) {
          await sql`
            UPDATE department_nav_items
            SET title = ${item.title},
                slug = ${item.slug},
                icon = ${item.icon},
                position = ${item.position},
                parent_id = ${item.parentId || null},
                show_in_sidebar = ${item.showInSidebar},
                status = ${item.status},
                page_type = ${item.pageType},
                external_url = ${item.externalUrl || null}
            WHERE id = ${item.id} AND dept_slug = ${deptSlug}
          `;
        } else {
          await sql`
            INSERT INTO department_nav_items (dept_slug, title, slug, icon, position, parent_id, show_in_sidebar, status, page_type, external_url)
            VALUES (${deptSlug}, ${item.title}, ${item.slug}, ${item.icon}, ${item.position}, ${item.parentId || null}, ${item.showInSidebar}, ${item.status}, ${item.pageType}, ${item.externalUrl || null})
          `;
        }
      }

      serverCache.invalidate(`dept_nav_${deptSlug}_edit`);
      serverCache.invalidate(`dept_nav_${deptSlug}_live`);
      return { success: true };
    } catch (err: any) {
      console.error("saveDepartmentNavItems failed:", err);
      throw new Error(err.message || "Failed to update navigation items");
    }
  });

/**
 * Create a new dynamic page / sidebar link
 */
export const createDepartmentNavPage = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      deptSlug: string;
      title: string;
      slug: string;
      icon: string;
      position?: number;
      showInSidebar: boolean;
      status: "published" | "draft";
      pageType: PageType;
      externalUrl?: string;
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      await ensureCmsTablesExist();
      const cleanSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
      
      // Calculate next position if not specified
      let pos = data.position;
      if (pos === undefined) {
        const countRes = await sql`
          SELECT COALESCE(MAX(position), 0) + 1 AS next_pos 
          FROM department_nav_items 
          WHERE dept_slug = ${data.deptSlug}
        `;
        pos = countRes[0]?.next_pos || 1;
      }

      // Create Nav Item
      const finalPos = pos ?? 1;
      const navRes = await sql`
        INSERT INTO department_nav_items (dept_slug, title, slug, icon, position, show_in_sidebar, status, page_type, external_url)
        VALUES (${data.deptSlug}, ${data.title}, ${cleanSlug}, ${data.icon || "BookOpen"}, ${finalPos}, ${data.showInSidebar}, ${data.status}, ${data.pageType}, ${data.externalUrl || null})
        RETURNING id
      `;

      // Create corresponding Department Page if custom or standard block page
      let pageId: number | undefined;
      if (data.pageType === "standard" || data.pageType === "custom" || data.pageType === "documents") {
        const initialBlocks: DepartmentPageBlock[] = [
          {
            id: `heading-${Date.now()}`,
            type: "heading",
            visible: true,
            content: { title: data.title, subtitle: `Welcome to the ${data.title} section`, level: "h1" },
          },
          {
            id: `richtext-${Date.now()}`,
            type: "richtext",
            visible: true,
            content: { html: `<p>This page contains information about <strong>${data.title}</strong> in the Department of ${data.deptSlug.toUpperCase()}.</p>` },
          },
        ];

        const pageRes = await sql`
          INSERT INTO department_pages (dept_slug, title, slug, page_type, status, draft_blocks, published_blocks)
          VALUES (${data.deptSlug}, ${data.title}, ${cleanSlug}, ${data.pageType}, ${data.status}, ${JSON.stringify(initialBlocks)}, ${JSON.stringify(initialBlocks)})
          ON CONFLICT (dept_slug, slug) DO UPDATE 
          SET title = EXCLUDED.title, page_type = EXCLUDED.page_type
          RETURNING id
        `;
        pageId = pageRes[0]?.id;

        if (pageId && navRes[0]?.id) {
          await sql`UPDATE department_nav_items SET custom_page_id = ${pageId} WHERE id = ${navRes[0].id}`;
        }
      }

      serverCache.invalidate(`dept_nav_${data.deptSlug}_edit`);
      serverCache.invalidate(`dept_nav_${data.deptSlug}_live`);

      return { success: true, navId: navRes[0]?.id, pageId, slug: cleanSlug };
    } catch (err: any) {
      console.error("createDepartmentNavPage failed:", err);
      throw new Error(err.message || "Failed to create page");
    }
  });

/**
 * Delete a nav item and its associated custom page
 */
export const deleteDepartmentNavPage = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number; deptSlug: string }) => d)
  .handler(async ({ data: { id, deptSlug } }) => {
    try {
      await ensureCmsTablesExist();
      const [item] = await sql`SELECT * FROM department_nav_items WHERE id = ${id} AND dept_slug = ${deptSlug}`;
      if (item) {
        if (item.slug && item.slug !== "" && item.slug !== "hod" && item.slug !== "courses" && item.slug !== "faculty" && item.slug !== "labs" && item.slug !== "achievements" && item.slug !== "gallery") {
          await sql`DELETE FROM department_pages WHERE dept_slug = ${deptSlug} AND slug = ${item.slug}`;
        }
        await sql`DELETE FROM department_nav_items WHERE id = ${id}`;
      }

      serverCache.invalidate(`dept_nav_${deptSlug}_edit`);
      serverCache.invalidate(`dept_nav_${deptSlug}_live`);
      return { success: true };
    } catch (err: any) {
      console.error("deleteDepartmentNavPage failed:", err);
      throw new Error("Failed to delete page");
    }
  });

/**
 * Get Department Page data (for rendering or editing)
 */
export const getDepartmentPage = createServerFn({ method: "GET" })
  .inputValidator((d: { deptSlug: string; pageSlug: string; isPreview?: boolean }) => d)
  .handler(async ({ data: { deptSlug, pageSlug, isPreview = false } }) => {
    try {
      await ensureCmsTablesExist();
      const cleanSlug = pageSlug.toLowerCase().trim();
      const rows = await sql`
        SELECT * FROM department_pages 
        WHERE dept_slug = ${deptSlug} AND slug = ${cleanSlug}
      `;

      if (!rows || rows.length === 0) {
        return null;
      }

      const p = rows[0];
      const blocks: DepartmentPageBlock[] = isPreview
        ? (p.draft_blocks || [])
        : (p.published_blocks && p.published_blocks.length > 0 ? p.published_blocks : p.draft_blocks || []);

      return {
        id: p.id,
        deptSlug: p.dept_slug,
        title: p.title,
        slug: p.slug,
        pageType: p.page_type as PageType,
        status: p.status as "published" | "draft",
        blocks,
        draftBlocks: p.draft_blocks || [],
        publishedBlocks: p.published_blocks || [],
        updatedAt: p.updated_at,
        createdAt: p.created_at,
      };
    } catch (err) {
      console.error("getDepartmentPage failed:", err);
      return null;
    }
  });

/**
 * Save draft blocks for a department page
 */
export const saveDepartmentPageDraft = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      deptSlug: string;
      pageSlug: string;
      title?: string;
      blocks: DepartmentPageBlock[];
    }) => d
  )
  .handler(async ({ data: { deptSlug, pageSlug, title, blocks } }) => {
    try {
      await ensureCmsTablesExist();
      const cleanSlug = pageSlug.toLowerCase().trim();

      const existing = await sql`
        SELECT id FROM department_pages WHERE dept_slug = ${deptSlug} AND slug = ${cleanSlug}
      `;

      if (existing && existing.length > 0) {
        await sql`
          UPDATE department_pages
          SET draft_blocks = ${JSON.stringify(blocks)}::jsonb,
              title = COALESCE(${title || null}, title),
              updated_at = NOW()
          WHERE id = ${existing[0].id}
        `;
      } else {
        await sql`
          INSERT INTO department_pages (dept_slug, title, slug, status, draft_blocks, published_blocks)
          VALUES (${deptSlug}, ${title || pageSlug}, ${cleanSlug}, 'draft', ${JSON.stringify(blocks)}::jsonb, '[]'::jsonb)
        `;
      }

      serverCache.invalidate(`dept_page_${deptSlug}_${cleanSlug}`);
      return { success: true };
    } catch (err: any) {
      console.error("saveDepartmentPageDraft failed:", err);
      throw new Error(err.message || "Failed to save draft");
    }
  });

/**
 * Publish page: copy draft_blocks to published_blocks & create version snapshot
 */
export const publishDepartmentPage = createServerFn({ method: "POST" })
  .inputValidator((d: { deptSlug: string; pageSlug: string }) => d)
  .handler(async ({ data: { deptSlug, pageSlug } }) => {
    try {
      await ensureCmsTablesExist();
      const cleanSlug = pageSlug.toLowerCase().trim();
      const [page] = await sql`SELECT * FROM department_pages WHERE dept_slug = ${deptSlug} AND slug = ${cleanSlug}`;

      if (!page) {
        throw new Error("Page not found");
      }

      const draftBlocks = page.draft_blocks || [];

      // 1. Copy draft to published
      await sql`
        UPDATE department_pages
        SET published_blocks = ${JSON.stringify(draftBlocks)}::jsonb,
            status = 'published',
            updated_at = NOW()
        WHERE id = ${page.id}
      `;

      // 2. Also update status in nav item
      await sql`
        UPDATE department_nav_items
        SET status = 'published'
        WHERE dept_slug = ${deptSlug} AND slug = ${cleanSlug}
      `;

      // 3. Create version history snapshot
      const verCount = await sql`
        SELECT COALESCE(MAX(version_number), 0) + 1 AS next_ver 
        FROM department_page_versions 
        WHERE page_id = ${page.id}
      `;
      const nextVer = verCount[0]?.next_ver || 1;

      await sql`
        INSERT INTO department_page_versions (page_id, version_number, blocks, created_by)
        VALUES (${page.id}, ${nextVer}, ${JSON.stringify(draftBlocks)}::jsonb, 'HOD Administrator')
      `;

      serverCache.invalidate(`dept_page_${deptSlug}_${cleanSlug}`);
      serverCache.invalidate(`dept_nav_${deptSlug}_live`);
      return { success: true, versionNumber: nextVer };
    } catch (err: any) {
      console.error("publishDepartmentPage failed:", err);
      throw new Error(err.message || "Failed to publish page");
    }
  });

/**
 * Get Page Version History
 */
export const getPageVersions = createServerFn({ method: "GET" })
  .inputValidator((d: { pageId: number }) => d)
  .handler(async ({ data: { pageId } }) => {
    try {
      await ensureCmsTablesExist();
      const rows = await sql`
        SELECT * FROM department_page_versions 
        WHERE page_id = ${pageId} 
        ORDER BY version_number DESC
      `;
      return rows.map((r: any) => ({
        id: r.id,
        pageId: r.page_id,
        versionNumber: r.version_number,
        blocks: r.blocks || [],
        createdBy: r.created_by,
        createdAt: r.created_at,
      }));
    } catch (err) {
      console.error("getPageVersions failed:", err);
      return [];
    }
  });

/**
 * Restore a previous version to draft_blocks
 */
export const restorePageVersion = createServerFn({ method: "POST" })
  .inputValidator((d: { pageId: number; versionId: number }) => d)
  .handler(async ({ data: { pageId, versionId } }) => {
    try {
      await ensureCmsTablesExist();
      const [ver] = await sql`SELECT * FROM department_page_versions WHERE id = ${versionId} AND page_id = ${pageId}`;
      if (!ver) throw new Error("Version not found");

      await sql`
        UPDATE department_pages
        SET draft_blocks = ${JSON.stringify(ver.blocks)}::jsonb,
            updated_at = NOW()
        WHERE id = ${pageId}
      `;

      return { success: true, restoredVersion: ver.version_number };
    } catch (err: any) {
      console.error("restorePageVersion failed:", err);
      throw new Error(err.message || "Failed to restore version");
    }
  });
