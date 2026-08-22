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

/* =========================================================
   DATABASE INITIALIZATION
   ========================================================= */

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

/* =========================================================
   DEFAULT NAVIGATION
   ========================================================= */

const DEFAULT_NAV_ITEMS: Array<
  Omit<DepartmentNavItem, "id" | "deptSlug">
> = [
  {
    title: "About & Vision",
    slug: "",
    icon: "BookOpen",
    position: 1,
    showInSidebar: true,
    status: "published",
    pageType: "standard",
  },
  {
    title: "HOD's Desk",
    slug: "hod",
    icon: "Users",
    position: 2,
    showInSidebar: true,
    status: "published",
    pageType: "standard",
  },
  {
    title: "Programmes",
    slug: "courses",
    icon: "GraduationCap",
    position: 3,
    showInSidebar: true,
    status: "published",
    pageType: "courses",
  },
  {
    title: "Faculty",
    slug: "faculty",
    icon: "Users",
    position: 4,
    showInSidebar: true,
    status: "published",
    pageType: "faculty",
  },
  {
    title: "Laboratories",
    slug: "labs",
    icon: "FlaskConical",
    position: 5,
    showInSidebar: true,
    status: "published",
    pageType: "labs",
  },
  {
    title: "Achievements",
    slug: "achievements",
    icon: "Trophy",
    position: 6,
    showInSidebar: true,
    status: "published",
    pageType: "achievements",
  },
  {
    title: "Gallery",
    slug: "gallery",
    icon: "ImageIcon",
    position: 7,
    showInSidebar: true,
    status: "published",
    pageType: "gallery",
  },
];

/* =========================================================
   BUILT-IN PAGES
   These are handled by the existing department system.
   Dynamically-added sections are treated as CMS pages.
   ========================================================= */

const BUILT_IN_SLUGS = new Set([
  "",
  "hod",
  "courses",
  "faculty",
  "labs",
  "achievements",
  "gallery",
]);

function isDynamicCmsPage(slug: string) {
  return !BUILT_IN_SLUGS.has(slug.toLowerCase().trim());
}

/* =========================================================
   BLOCK NORMALIZATION
   Handles:
   - normal JSON arrays
   - { blocks: [...] }
   - { items: [...] }
   - JSON strings such as "\"[]\"" / "[...]"
   - malformed values
   ========================================================= */

function normalizeBlocks(value: unknown): DepartmentPageBlock[] {
  if (Array.isArray(value)) {
    return value as DepartmentPageBlock[];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      // Handle strings that contain another JSON string.
      if (typeof parsed === "string") {
        try {
          const parsedAgain = JSON.parse(parsed);

          if (Array.isArray(parsedAgain)) {
            return parsedAgain as DepartmentPageBlock[];
          }

          if (
            parsedAgain &&
            typeof parsedAgain === "object" &&
            Array.isArray(parsedAgain.blocks)
          ) {
            return parsedAgain.blocks as DepartmentPageBlock[];
          }

          if (
            parsedAgain &&
            typeof parsedAgain === "object" &&
            Array.isArray(parsedAgain.items)
          ) {
            return parsedAgain.items as DepartmentPageBlock[];
          }
        } catch {
          return [];
        }
      }

      if (Array.isArray(parsed)) {
        return parsed as DepartmentPageBlock[];
      }

      if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray(parsed.blocks)
      ) {
        return parsed.blocks as DepartmentPageBlock[];
      }

      if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray(parsed.items)
      ) {
        return parsed.items as DepartmentPageBlock[];
      }
    } catch {
      return [];
    }
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;

    if (Array.isArray(obj.blocks)) {
      return obj.blocks as DepartmentPageBlock[];
    }

    if (Array.isArray(obj.items)) {
      return obj.items as DepartmentPageBlock[];
    }
  }

  return [];
}

/* =========================================================
   CREATE / ENSURE CMS PAGE FOR A NAV ITEM
   This is the important part.

   Whenever a dynamically-created section exists in the
   navbar, this function makes sure its CMS page exists too.

   Therefore the admin NEVER needs SQL.
   ========================================================= */

async function ensureCmsPageForNavItem(
  deptSlug: string,
  title: string,
  slug: string,
  pageType: PageType = "custom",
  status: "published" | "draft" = "published",
  navId?: number
) {
  const cleanSlug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-");

  // Built-in pages don't need dynamic CMS pages.
  if (!isDynamicCmsPage(cleanSlug)) {
    return null;
  }

  const existing = await sql`
    SELECT *
    FROM department_pages
    WHERE dept_slug = ${deptSlug}
      AND slug = ${cleanSlug}
    LIMIT 1
  `;

  let pageId: number;

  if (existing && existing.length > 0) {
    pageId = existing[0].id;

    // Repair existing page if its blocks are malformed.
    const draftBlocks = normalizeBlocks(existing[0].draft_blocks);
    const publishedBlocks = normalizeBlocks(existing[0].published_blocks);

    await sql`
      UPDATE department_pages
      SET
        title = ${title},
        page_type = ${pageType},
        draft_blocks = ${JSON.stringify(draftBlocks)}::jsonb,
        published_blocks = ${JSON.stringify(publishedBlocks)}::jsonb,
        updated_at = NOW()
      WHERE id = ${pageId}
    `;
  } else {
    const timestamp = Date.now();

    const initialBlocks: DepartmentPageBlock[] = [
      {
        id: `heading-${timestamp}`,
        type: "heading",
        visible: true,
        content: {
          title,
          subtitle: `Welcome to the ${title} section`,
          level: "h1",
        },
      },
      {
        id: `richtext-${timestamp}`,
        type: "richtext",
        visible: true,
        content: {
          html: `<p>This page contains information about <strong>${title}</strong> in the Department of ${deptSlug.toUpperCase()}.</p>`,
        },
      },
    ];

    const pageRes = await sql`
      INSERT INTO department_pages (
        dept_slug,
        title,
        slug,
        page_type,
        status,
        draft_blocks,
        published_blocks
      )
      VALUES (
        ${deptSlug},
        ${title},
        ${cleanSlug},
        ${pageType},
        ${status},
        ${JSON.stringify(initialBlocks)}::jsonb,
        ${JSON.stringify(initialBlocks)}::jsonb
      )
      ON CONFLICT (dept_slug, slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        page_type = EXCLUDED.page_type
      RETURNING id
    `;

    pageId = pageRes[0]?.id;
  }

  // Connect navigation item to CMS page.
  if (pageId && navId) {
    await sql`
      UPDATE department_nav_items
      SET custom_page_id = ${pageId}
      WHERE id = ${navId}
        AND dept_slug = ${deptSlug}
    `;
  }

  return pageId;
}

/* =========================================================
   GET DEPARTMENT NAVIGATION
   ========================================================= */

export const getDepartmentNavItems = createServerFn({ method: "GET" })
  .validator(
    (d: { deptSlug: string; isEditMode?: boolean }) => d
  )
  .handler(async ({ data: { deptSlug, isEditMode = false } }) => {
    try {
      await ensureCmsTablesExist();

      const cacheKey = `dept_nav_${deptSlug}_${isEditMode ? "edit" : "live"}`;

      const cached = serverCache.get<DepartmentNavItem[]>(cacheKey);

      if (cached) {
        return cached;
      }

      let rows = isEditMode
        ? await sql`
            SELECT *
            FROM department_nav_items
            WHERE dept_slug = ${deptSlug}
            ORDER BY position ASC, id ASC
          `
        : await sql`
            SELECT *
            FROM department_nav_items
            WHERE dept_slug = ${deptSlug}
              AND show_in_sidebar = true
              AND status = 'published'
            ORDER BY position ASC, id ASC
          `;

      // Seed defaults if department has no navigation yet.
      if (!rows || rows.length === 0) {
        for (const item of DEFAULT_NAV_ITEMS) {
          await sql`
            INSERT INTO department_nav_items (
              dept_slug,
              title,
              slug,
              icon,
              position,
              show_in_sidebar,
              status,
              page_type
            )
            VALUES (
              ${deptSlug},
              ${item.title},
              ${item.slug},
              ${item.icon},
              ${item.position},
              ${item.showInSidebar},
              ${item.status},
              ${item.pageType}
            )
          `;
        }

        rows = await sql`
          SELECT *
          FROM department_nav_items
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

      // Group children.
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

      return DEFAULT_NAV_ITEMS.map((item, idx) => ({
        ...item,
        id: idx + 1,
        deptSlug,
      }));
    }
  });

/* =========================================================
   SAVE / REORDER NAVIGATION ITEMS
   ========================================================= */

export const saveDepartmentNavItems = createServerFn({
  method: "POST",
})
  .validator(
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
        const cleanSlug = item.slug
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9-]/g, "-");

        let navId: number | undefined;

        if (item.id) {
          await sql`
            UPDATE department_nav_items
            SET
              title = ${item.title},
              slug = ${cleanSlug},
              icon = ${item.icon},
              position = ${item.position},
              parent_id = ${item.parentId || null},
              show_in_sidebar = ${item.showInSidebar},
              status = ${item.status},
              page_type = ${item.pageType},
              external_url = ${item.externalUrl || null}
            WHERE id = ${item.id}
              AND dept_slug = ${deptSlug}
          `;

          navId = item.id;
        } else {
          const result = await sql`
            INSERT INTO department_nav_items (
              dept_slug,
              title,
              slug,
              icon,
              position,
              parent_id,
              show_in_sidebar,
              status,
              page_type,
              external_url
            )
            VALUES (
              ${deptSlug},
              ${item.title},
              ${cleanSlug},
              ${item.icon},
              ${item.position},
              ${item.parentId || null},
              ${item.showInSidebar},
              ${item.status},
              ${item.pageType},
              ${item.externalUrl || null}
            )
            RETURNING id
          `;

          navId = result[0]?.id;
        }

        /*
         * IMPORTANT:
         *
         * If this is a dynamically-added section, make sure
         * it has a department_pages record.
         *
         * This also repairs an existing section such as
         * IT -> Research without requiring SQL.
         */
        if (navId && isDynamicCmsPage(cleanSlug)) {
          await ensureCmsPageForNavItem(
            deptSlug,
            item.title,
            cleanSlug,
            "custom",
            item.status,
            navId
          );
        }
      }

      serverCache.invalidate(`dept_nav_${deptSlug}_edit`);
      serverCache.invalidate(`dept_nav_${deptSlug}_live`);

      return {
        success: true,
      };
    } catch (err: any) {
      console.error("saveDepartmentNavItems failed:", err);

      throw new Error(
        err.message || "Failed to update navigation items"
      );
    }
  });

/* =========================================================
   CREATE NEW NAVIGATION PAGE
   ========================================================= */

export const createDepartmentNavPage = createServerFn({
  method: "POST",
})
  .validator(
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

      const cleanSlug = data.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-");

      // Calculate next position.
      let pos = data.position;

      if (pos === undefined) {
        const countRes = await sql`
          SELECT COALESCE(MAX(position), 0) + 1 AS next_pos
          FROM department_nav_items
          WHERE dept_slug = ${data.deptSlug}
        `;

        pos = countRes[0]?.next_pos || 1;
      }

      const finalPos = pos ?? 1;

      /*
       * New sections created by the admin are CMS pages.
       *
       * We keep the navigation item as "custom".
       */
      const effectivePageType: PageType = isDynamicCmsPage(cleanSlug)
        ? "custom"
        : data.pageType;

      // Create navigation item.
      const navRes = await sql`
        INSERT INTO department_nav_items (
          dept_slug,
          title,
          slug,
          icon,
          position,
          show_in_sidebar,
          status,
          page_type,
          external_url
        )
        VALUES (
          ${data.deptSlug},
          ${data.title},
          ${cleanSlug},
          ${data.icon || "BookOpen"},
          ${finalPos},
          ${data.showInSidebar},
          ${data.status},
          ${effectivePageType},
          ${data.externalUrl || null}
        )
        RETURNING id
      `;

      const navId = navRes[0]?.id;

      /*
       * ALWAYS create the CMS page for a dynamically-created
       * navigation section.
       */
      const pageId = await ensureCmsPageForNavItem(
        data.deptSlug,
        data.title,
        cleanSlug,
        effectivePageType,
        data.status,
        navId
      );

      serverCache.invalidate(
        `dept_nav_${data.deptSlug}_edit`
      );

      serverCache.invalidate(
        `dept_nav_${data.deptSlug}_live`
      );

      return {
        success: true,
        navId,
        pageId,
        slug: cleanSlug,
      };
    } catch (err: any) {
      console.error(
        "createDepartmentNavPage failed:",
        err
      );

      throw new Error(
        err.message || "Failed to create page"
      );
    }
  });

/* =========================================================
   DELETE NAVIGATION PAGE
   ========================================================= */

export const deleteDepartmentNavPage = createServerFn({
  method: "POST",
})
  .validator(
    (d: { id: number; deptSlug: string }) => d
  )
  .handler(async ({ data: { id, deptSlug } }) => {
    try {
      await ensureCmsTablesExist();

      const [item] = await sql`
        SELECT *
        FROM department_nav_items
        WHERE id = ${id}
          AND dept_slug = ${deptSlug}
      `;

      if (item) {
        const cleanSlug = (item.slug || "")
          .toLowerCase()
          .trim();

        /*
         * Delete CMS page only for dynamically-created pages.
         * Built-in pages remain untouched.
         */
        if (isDynamicCmsPage(cleanSlug)) {
          await sql`
            DELETE FROM department_pages
            WHERE dept_slug = ${deptSlug}
              AND slug = ${cleanSlug}
          `;
        }

        await sql`
          DELETE FROM department_nav_items
          WHERE id = ${id}
            AND dept_slug = ${deptSlug}
        `;
      }

      serverCache.invalidate(
        `dept_nav_${deptSlug}_edit`
      );

      serverCache.invalidate(
        `dept_nav_${deptSlug}_live`
      );

      return {
        success: true,
      };
    } catch (err: any) {
      console.error(
        "deleteDepartmentNavPage failed:",
        err
      );

      throw new Error(
        err.message || "Failed to delete page"
      );
    }
  });

/* =========================================================
   GET DEPARTMENT PAGE
   ========================================================= */

export const getDepartmentPage = createServerFn({
  method: "GET",
})
  .validator(
    (d: {
      deptSlug: string;
      pageSlug: string;
      isPreview?: boolean;
    }) => d
  )
  .handler(
    async ({
      data: {
        deptSlug,
        pageSlug,
        isPreview = false,
      },
    }) => {
      try {
        await ensureCmsTablesExist();

        const cleanSlug = pageSlug
          .toLowerCase()
          .trim();

        const rows = await sql`
          SELECT *
          FROM department_pages
          WHERE dept_slug = ${deptSlug}
            AND slug = ${cleanSlug}
          LIMIT 1
        `;

        if (!rows || rows.length === 0) {
          return null;
        }

        const p = rows[0];

        const draftBlocks = normalizeBlocks(
          p.draft_blocks
        );

        const publishedBlocks = normalizeBlocks(
          p.published_blocks
        );

        /*
         * ADMIN / PREVIEW:
         *     draft_blocks
         *
         * PUBLIC:
         *     published_blocks ONLY
         */
        const blocks: DepartmentPageBlock[] =
          isPreview
            ? draftBlocks
            : publishedBlocks;

        return {
          id: p.id,
          deptSlug: p.dept_slug,
          title: p.title,
          slug: p.slug,
          pageType: p.page_type as PageType,
          status:
            p.status as "published" | "draft",

          blocks,

          // Also return both versions for the editor.
          draftBlocks,
          publishedBlocks,

          updatedAt: p.updated_at,
          createdAt: p.created_at,
        };
      } catch (err) {
        console.error(
          "getDepartmentPage failed:",
          err
        );

        return null;
      }
    }
  );

/* =========================================================
   SAVE DRAFT
   ========================================================= */

export const saveDepartmentPageDraft = createServerFn({
  method: "POST",
})
  .validator(
    (d: {
      deptSlug: string;
      pageSlug: string;
      title?: string;
      blocks: DepartmentPageBlock[];
    }) => d
  )
  .handler(
    async ({
      data: {
        deptSlug,
        pageSlug,
        title,
        blocks,
      },
    }) => {
      try {
        await ensureCmsTablesExist();

        const cleanSlug = pageSlug
          .toLowerCase()
          .trim();

        /*
         * Normalize the incoming blocks before storing them.
         * This prevents a string such as "[]" from being
         * accidentally saved instead of an actual array.
         */
        const normalizedBlocks =
          normalizeBlocks(blocks);

        const existing = await sql`
          SELECT id
          FROM department_pages
          WHERE dept_slug = ${deptSlug}
            AND slug = ${cleanSlug}
          LIMIT 1
        `;

        if (existing && existing.length > 0) {
          await sql`
            UPDATE department_pages
            SET
              draft_blocks =
                ${JSON.stringify(normalizedBlocks)}::jsonb,
              title =
                COALESCE(${title || null}, title),
              updated_at = NOW()
            WHERE id = ${existing[0].id}
          `;
        } else {
          /*
           * This is a safety net.
           *
           * If a dynamically-added navbar item somehow
           * reaches the editor without a page record,
           * create it automatically.
           */
          await sql`
            INSERT INTO department_pages (
              dept_slug,
              title,
              slug,
              page_type,
              status,
              draft_blocks,
              published_blocks
            )
            VALUES (
              ${deptSlug},
              ${title || pageSlug},
              ${cleanSlug},
              'custom',
              'draft',
              ${JSON.stringify(normalizedBlocks)}::jsonb,
              '[]'::jsonb
            )
            ON CONFLICT (dept_slug, slug)
            DO UPDATE SET
              draft_blocks =
                EXCLUDED.draft_blocks,
              title =
                EXCLUDED.title,
              updated_at = NOW()
          `;
        }

        /*
         * Make sure the navbar item points to the CMS page.
         */
        await sql`
          UPDATE department_nav_items
          SET custom_page_id = (
            SELECT id
            FROM department_pages
            WHERE dept_slug = ${deptSlug}
              AND slug = ${cleanSlug}
            LIMIT 1
          )
          WHERE dept_slug = ${deptSlug}
            AND slug = ${cleanSlug}
        `;

        serverCache.invalidate(
          `dept_page_${deptSlug}_${cleanSlug}`
        );

        return {
          success: true,
        };
      } catch (err: any) {
        console.error(
          "saveDepartmentPageDraft failed:",
          err
        );

        throw new Error(
          err.message || "Failed to save draft"
        );
      }
    }
  );

/* =========================================================
   PUBLISH PAGE
   ========================================================= */

export const publishDepartmentPage = createServerFn({
  method: "POST",
})
  .validator(
    (d: {
      deptSlug: string;
      pageSlug: string;
    }) => d
  )
  .handler(
    async ({
      data: {
        deptSlug,
        pageSlug,
      },
    }) => {
      try {
        await ensureCmsTablesExist();

        const cleanSlug = pageSlug
          .toLowerCase()
          .trim();

        const [page] = await sql`
          SELECT *
          FROM department_pages
          WHERE dept_slug = ${deptSlug}
            AND slug = ${cleanSlug}
          LIMIT 1
        `;

        if (!page) {
          throw new Error(
            "Page not found. Please save the page first."
          );
        }

        /*
         * IMPORTANT:
         * Normalize the draft before publishing.
         */
        const draftBlocks = normalizeBlocks(
          page.draft_blocks
        );

        /*
         * Publish exactly what is in the current draft.
         */
        await sql`
          UPDATE department_pages
          SET
            published_blocks =
              ${JSON.stringify(draftBlocks)}::jsonb,
            status = 'published',
            updated_at = NOW()
          WHERE id = ${page.id}
        `;

        /*
         * Make navbar item visible.
         */
        await sql`
          UPDATE department_nav_items
          SET
            status = 'published',
            show_in_sidebar = true,
            custom_page_id = ${page.id}
          WHERE dept_slug = ${deptSlug}
            AND slug = ${cleanSlug}
        `;

        /*
         * Version history.
         */
        const verCount = await sql`
          SELECT
            COALESCE(
              MAX(version_number),
              0
            ) + 1 AS next_ver
          FROM department_page_versions
          WHERE page_id = ${page.id}
        `;

        const nextVer =
          verCount[0]?.next_ver || 1;

        await sql`
          INSERT INTO department_page_versions (
            page_id,
            version_number,
            blocks,
            created_by
          )
          VALUES (
            ${page.id},
            ${nextVer},
            ${JSON.stringify(draftBlocks)}::jsonb,
            'HOD Administrator'
          )
        `;

        /*
         * Clear caches.
         */
        serverCache.invalidate(
          `dept_page_${deptSlug}_${cleanSlug}`
        );

        serverCache.invalidate(
          `dept_nav_${deptSlug}_live`
        );

        serverCache.invalidate(
          `dept_nav_${deptSlug}_edit`
        );

        return {
          success: true,
          versionNumber: nextVer,
          publishedBlocks: draftBlocks,
        };
      } catch (err: any) {
        console.error(
          "publishDepartmentPage failed:",
          err
        );

        throw new Error(
          err.message ||
            "Failed to publish page"
        );
      }
    }
  );

/* =========================================================
   GET PAGE VERSION HISTORY
   ========================================================= */

export const getPageVersions = createServerFn({
  method: "GET",
})
  .validator(
    (d: { pageId: number }) => d
  )
  .handler(async ({ data: { pageId } }) => {
    try {
      await ensureCmsTablesExist();

      const rows = await sql`
        SELECT *
        FROM department_page_versions
        WHERE page_id = ${pageId}
        ORDER BY version_number DESC
      `;

      return rows.map((r: any) => ({
        id: r.id,
        pageId: r.page_id,
        versionNumber: r.version_number,
        blocks: normalizeBlocks(r.blocks),
        createdBy: r.created_by,
        createdAt: r.created_at,
      }));
    } catch (err) {
      console.error(
        "getPageVersions failed:",
        err
      );

      return [];
    }
  });

/* =========================================================
   RESTORE VERSION
   ========================================================= */

export const restorePageVersion = createServerFn({
  method: "POST",
})
  .validator(
    (d: {
      pageId: number;
      versionId: number;
    }) => d
  )
  .handler(
    async ({
      data: {
        pageId,
        versionId,
      },
    }) => {
      try {
        await ensureCmsTablesExist();

        const [ver] = await sql`
          SELECT *
          FROM department_page_versions
          WHERE id = ${versionId}
            AND page_id = ${pageId}
          LIMIT 1
        `;

        if (!ver) {
          throw new Error(
            "Version not found"
          );
        }

        const restoredBlocks =
          normalizeBlocks(ver.blocks);

        await sql`
          UPDATE department_pages
          SET
            draft_blocks =
              ${JSON.stringify(restoredBlocks)}::jsonb,
            updated_at = NOW()
          WHERE id = ${pageId}
        `;

        serverCache.invalidate(
          `dept_page_${pageId}`
        );

        return {
          success: true,
          restoredVersion:
            ver.version_number,
        };
      } catch (err: any) {
        console.error(
          "restorePageVersion failed:",
          err
        );

        throw new Error(
          err.message ||
            "Failed to restore version"
        );
      }
    }
  );