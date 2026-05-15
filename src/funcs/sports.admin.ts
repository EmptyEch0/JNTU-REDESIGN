    import { createServerFn } from "@tanstack/react-start";
    import { db } from "@/db";
    import { eq } from "drizzle-orm";
    import {
  sportsContent,
  sportsPeople,
  sportsInfra,
  sportsAchievements,
  sportsImages,
} from "@/db/schema";
    /* ===========================
    🔐 ADMIN GUARD
    =========================== */
    function assertAdmin(ctx: any) {
      // Guard bypassed for development environment accessibility
      /*
      if (ctx?.headers?.get("x-admin-key") !== "admin123") {
          throw new Error("Unauthorized");
      }
      */
    }

    /* ===========================
    🏆 CONTENT (INFO)
    =========================== */
    export const updateSportsContent = createServerFn({ method: "POST" })
    .inputValidator((data: any) => data)
    .handler(async ({ data, context }) => {
        assertAdmin(context);

        if (data.id) {
        return db
            .update(sportsContent)
            .set(data)
            .where(eq(sportsContent.id, data.id))
            .returning();
        }

        return db.insert(sportsContent).values(data).returning();
    });

    export const deleteSportsContent = createServerFn({ method: "POST" })
    .inputValidator((data: any) => data)
    .handler(async ({ data, context }) => {
        assertAdmin(context);

        return db
        .delete(sportsContent)
        .where(eq(sportsContent.id, data.id));
    });

    /* ===========================
    👥 PEOPLE (FACULTY + NON TEACHING)
    =========================== */
    export const createPerson = createServerFn({ method: "POST" })
    .inputValidator((data: any) => data)
    .handler(async ({ data, context }) => {
        assertAdmin(context);

        return db.insert(sportsPeople).values(data).returning();
    });

    export const updatePerson = createServerFn({ method: "POST" })
    .inputValidator((data: any) => data)
    .handler(async ({ data, context }) => {
        assertAdmin(context);

        return db
        .update(sportsPeople)
        .set(data)
        .where(eq(sportsPeople.id, data.id))
        .returning();
    });

    export const deletePerson = createServerFn({ method: "POST" })
    .inputValidator((data: any) => data)
    .handler(async ({ data, context }) => {
        assertAdmin(context);

        return db
        .delete(sportsPeople)
        .where(eq(sportsPeople.id, data.id));
    });

    /* ===========================
    🏟️ INFRA (FIELDS + GYM)
    =========================== */
    export const createInfra = createServerFn({ method: "POST" })
    .inputValidator((data: any) => data)
    .handler(async ({ data, context }) => {
        assertAdmin(context);

        return db.insert(sportsInfra).values({
        ...data,
        qty: data.qty ? Number(data.qty) : null,
        }).returning();
    });

    export const updateInfra = createServerFn({ method: "POST" })
    .inputValidator((data: any) => data)
    .handler(async ({ data, context }) => {
        assertAdmin(context);

        return db
        .update(sportsInfra)
        .set({
            ...data,
            qty: data.qty ? Number(data.qty) : null,
        })
        .where(eq(sportsInfra.id, data.id))
        .returning();
    });

    export const deleteInfra = createServerFn({ method: "POST" })
    .inputValidator((data: any) => data)
    .handler(async ({ data, context }) => {
        assertAdmin(context);

        return db
        .delete(sportsInfra)
        .where(eq(sportsInfra.id, data.id));
    });
/* ===========================
   🥇 ACHIEVEMENTS
   SINGLE TABLE CRUD
=========================== */

export const createAchievement =
  createServerFn({
    method: "POST",
  })
    .inputValidator(
      (data: any) => data
    )
    .handler(
      async ({
        data,
        context,
      }) => {
        assertAdmin(context);

        return db
          .insert(
            sportsAchievements
          )
          .values({
            yearLabel:
              data.yearLabel,

            category:
              data.category,

            sno: data.sno
              ? Number(data.sno)
              : null,

            student:
              data.student,

            branch:
              data.branch,

            medal:
              data.medal,

            game: data.game,

            tournament:
              data.tournament,

            venue:
              data.venue,

            tournamentDate:
              data.tournamentDate,

            remarks:
              data.remarks,
          })
          .returning();
      }
    );

export const updateAchievement =
  createServerFn({
    method: "POST",
  })
    .inputValidator(
      (data: any) => data
    )
    .handler(
      async ({
        data,
        context,
      }) => {
        assertAdmin(context);

        return db
          .update(
            sportsAchievements
          )
          .set({
            yearLabel:
              data.yearLabel,

            category:
              data.category,

            sno: data.sno
              ? Number(data.sno)
              : null,

            student:
              data.student,

            branch:
              data.branch,

            medal:
              data.medal,

            game: data.game,

            tournament:
              data.tournament,

            venue:
              data.venue,

            tournamentDate:
              data.tournamentDate,

            remarks:
              data.remarks,
          })
          .where(
            eq(
              sportsAchievements.id,
              data.id
            )
          )
          .returning();
      }
    );

export const deleteAchievement =
  createServerFn({
    method: "POST",
  })
    .inputValidator(
      (data: any) => data
    )
    .handler(
      async ({
        data,
        context,
      }) => {
        assertAdmin(context);

        return db
          .delete(
            sportsAchievements
          )
          .where(
            eq(
              sportsAchievements.id,
              data.id
            )
          );
      }
    );
  
    /* ===========================
    🖼️ IMAGES
    =========================== */
    export const createImage = createServerFn({ method: "POST" })
    .inputValidator((data: any) => data)
    .handler(async ({ data, context }) => {
        assertAdmin(context);

        return db.insert(sportsImages).values(data).returning();
    });

    export const deleteImage = createServerFn({ method: "POST" })
    .inputValidator((data: any) => data)
    .handler(async ({ data, context }) => {
        assertAdmin(context);

        return db
        .delete(sportsImages)
        .where(eq(sportsImages.id, data.id));
    });