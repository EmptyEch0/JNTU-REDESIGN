import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { eq } from "drizzle-orm";
import {
  academicFeeStructure,
  academicCalendars,
  academicRegulations,
  academicSyllabus,
  academicDownloads,
  academicTimetables,
  academicFaculty,
  academicCoursesOffered,
  academicsBrochures,
  academicsAdmissionsNew,
  academicsExamCell,
  academicsScholarshipsNew,
  academicsVcProfiles,
  academicsHodDesk,
  academicsPrincipals,
  academicsMissionVision,
  academicsDashboardStats,
  academicsCac,
  tickerNotifications
} from "../db/schema";
import { memoryCache } from "./cache";

// ----------------------------------------------------
// 1. Admissions & Fee Structure
// ----------------------------------------------------
export const getAcademicsBrochures = createServerFn({ method: "GET" }).handler(async () => {
  return memoryCache.getOrSet("academics:brochures", 10 * 60 * 1000, async () => {
    return await db.select().from(academicsBrochures);
  });
});

export const upsertAcademicsBrochure = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicsBrochures).set({
        title: data.title,
        file_url: data.file_url,
        type: data.type
      }).where(eq(academicsBrochures.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicsBrochures).values({
        title: data.title,
        file_url: data.file_url,
        type: data.type
      });
      return { success: true };
    }
  });

export const deleteAcademicsBrochure = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicsBrochures).where(eq(academicsBrochures.id, data.id));
    return { success: true };
  });

export const getAcademicsAdmissions = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicsAdmissionsNew);
});

export const upsertAcademicsAdmission = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicsAdmissionsNew).set({
        program: data.program,
        procedure: data.procedure,
        tuition_fee: data.tuition_fee,
        hostel_fee: data.hostel_fee
      }).where(eq(academicsAdmissionsNew.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicsAdmissionsNew).values({
        program: data.program,
        procedure: data.procedure,
        tuition_fee: data.tuition_fee,
        hostel_fee: data.hostel_fee
      });
      return { success: true };
    }
  });

export const deleteAcademicsAdmission = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicsAdmissionsNew).where(eq(academicsAdmissionsNew.id, data.id));
    return { success: true };
  });

// REAL ACADEMIC FEE STRUCTURE CRUD
export const getAcademicFeeStructures = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicFeeStructure);
});

export const upsertAcademicFeeStructure = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicFeeStructure).set({
        level: data.level,
        program_name: data.program_name,
        title: data.title,
        pdf_url: data.pdf_url
      }).where(eq(academicFeeStructure.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicFeeStructure).values({
        level: data.level,
        program_name: data.program_name,
        title: data.title,
        pdf_url: data.pdf_url
      });
      return { success: true };
    }
  });

export const deleteAcademicFeeStructure = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicFeeStructure).where(eq(academicFeeStructure.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 2. Academic Calendar (REAL TABLE: academic_calendars)
// ----------------------------------------------------
export const getAcademicsCalendar = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicCalendars);
});

export const upsertAcademicsCalendarEvent = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicCalendars).set({
        level: data.level,
        program_name: data.program_name,
        regulation: data.regulation,
        academic_year: data.academic_year,
        calendar_type: data.calendar_type,
        pdf_url: data.pdf_url
      }).where(eq(academicCalendars.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicCalendars).values({
        level: data.level,
        program_name: data.program_name,
        regulation: data.regulation,
        academic_year: data.academic_year,
        calendar_type: data.calendar_type,
        pdf_url: data.pdf_url
      });
      return { success: true };
    }
  });

export const deleteAcademicsCalendarEvent = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicCalendars).where(eq(academicCalendars.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 3. Regulations (REAL TABLE: academic_regulations)
// ----------------------------------------------------
export const getAcademicsRegulations = createServerFn({ method: "GET" }).handler(async () => {
  return memoryCache.getOrSet("academics:regulations", 10 * 60 * 1000, async () => {
    return await db.select().from(academicRegulations);
  });
});

export const upsertAcademicsRegulation = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    memoryCache.invalidatePrefix("academics:");
    if (data.id) {
      await db.update(academicRegulations).set({
        title: data.title,
        category: data.category,
        size: data.size || "Unknown Size",
        date: data.date || new Date().toLocaleDateString(),
        link: data.link || "#"
      }).where(eq(academicRegulations.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicRegulations).values({
        title: data.title,
        category: data.category,
        size: data.size || "Unknown Size",
        date: data.date || new Date().toLocaleDateString(),
        link: data.link || "#"
      });
      return { success: true };
    }
  });

export const deleteAcademicsRegulation = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    memoryCache.invalidatePrefix("academics:");
    await db.delete(academicRegulations).where(eq(academicRegulations.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 4. Syllabus Module (REAL TABLE: academic_syllabus)
// ----------------------------------------------------
export const getAcademicsSyllabusList = createServerFn({ method: "GET" }).handler(async () => {
  return memoryCache.getOrSet("academics:syllabus", 10 * 60 * 1000, async () => {
    return await db.select().from(academicSyllabus);
  });
});

export const upsertAcademicsSyllabus = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    memoryCache.invalidatePrefix("academics:");
    if (data.id) {
      await db.update(academicSyllabus).set({
        level: data.level,
        program_name: data.program_name,
        regulation: data.regulation,
        branch: data.branch,
        academic_year: data.academic_year,
        semester: data.semester,
        subject_name: data.subject_name,
        pdf_url: data.pdf_url
      }).where(eq(academicSyllabus.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicSyllabus).values({
        level: data.level,
        program_name: data.program_name,
        regulation: data.regulation,
        branch: data.branch,
        academic_year: data.academic_year,
        semester: data.semester,
        subject_name: data.subject_name,
        pdf_url: data.pdf_url
      });
      return { success: true };
    }
  });

export const deleteAcademicsSyllabus = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    memoryCache.invalidatePrefix("academics:");
    await db.delete(academicSyllabus).where(eq(academicSyllabus.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 5. Examination Cell
// ----------------------------------------------------
export const getAcademicsExamData = createServerFn({ method: "GET" }).handler(async () => {
  return memoryCache.getOrSet("academics:exam", 10 * 60 * 1000, async () => {
    return await db.select().from(academicsExamCell);
  });
});

export const upsertAcademicsExamData = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    memoryCache.invalidatePrefix("academics:");
    if (data.id) {
      await db.update(academicsExamCell).set({
        type: data.type,
        title: data.title,
        description: data.description,
        date: data.date,
        file_url: data.file_url
      }).where(eq(academicsExamCell.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicsExamCell).values({
        type: data.type,
        title: data.title,
        description: data.description,
        date: data.date,
        file_url: data.file_url
      });
      return { success: true };
    }
  });

export const deleteAcademicsExamData = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    memoryCache.invalidatePrefix("academics:");
    await db.delete(academicsExamCell).where(eq(academicsExamCell.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 6. Downloads Section (REAL TABLE: academic_downloads)
// ----------------------------------------------------
export const getAcademicsDownloadsList = createServerFn({ method: "GET" }).handler(async () => {
  return memoryCache.getOrSet("academics:downloads", 10 * 60 * 1000, async () => {
    return await db.select().from(academicDownloads);
  });
});

export const upsertAcademicsDownload = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    memoryCache.invalidatePrefix("academics:");
    if (data.id) {
      await db.update(academicDownloads).set({
        document_name: data.document_name,
        category: data.category,
        pdf_url: data.pdf_url
      }).where(eq(academicDownloads.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicDownloads).values({
        document_name: data.document_name,
        category: data.category,
        pdf_url: data.pdf_url
      });
      return { success: true };
    }
  });

export const deleteAcademicsDownload = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    memoryCache.invalidatePrefix("academics:");
    await db.delete(academicDownloads).where(eq(academicDownloads.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 7. Timetables (REAL TABLE: academic_timetables)
// ----------------------------------------------------
export const getAcademicsTimetablesList = createServerFn({ method: "GET" }).handler(async () => {
  return memoryCache.getOrSet("academics:timetables", 10 * 60 * 1000, async () => {
    return await db.select().from(academicTimetables);
  });
});

export const upsertAcademicsTimetable = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicTimetables).set({
        level: data.level,
        program_name: data.program_name,
        regulation: data.regulation,
        branch: data.branch,
        academic_year: data.academic_year,
        semester: data.semester,
        subject_name: data.subject_name,
        pdf_url: data.pdf_url
      }).where(eq(academicTimetables.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicTimetables).values({
        level: data.level,
        program_name: data.program_name,
        regulation: data.regulation,
        branch: data.branch,
        academic_year: data.academic_year,
        semester: data.semester,
        subject_name: data.subject_name,
        pdf_url: data.pdf_url
      });
      return { success: true };
    }
  });

export const deleteAcademicsTimetable = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicTimetables).where(eq(academicTimetables.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 8. Board Scholarship
// ----------------------------------------------------
export const getAcademicsScholarshipsList = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicsScholarshipsNew);
});

export const upsertAcademicsScholarship = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicsScholarshipsNew).set({
        title: data.title,
        amount: data.amount,
        description: data.description,
        eligibility: data.eligibility,
        last_date: data.last_date,
        status: data.status,
        apply_url: data.apply_url
      }).where(eq(academicsScholarshipsNew.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicsScholarshipsNew).values({
        title: data.title,
        amount: data.amount,
        description: data.description,
        eligibility: data.eligibility,
        last_date: data.last_date,
        status: data.status,
        apply_url: data.apply_url
      });
      return { success: true };
    }
  });

export const deleteAcademicsScholarship = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicsScholarshipsNew).where(eq(academicsScholarshipsNew.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 9. Faculty Directory (REAL TABLE: academic_faculty)
// ----------------------------------------------------
export const getAcademicsFacultyList = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicFaculty);
});

export const upsertAcademicsFaculty = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicFaculty).set({
        faculty_name: data.faculty_name,
        designation: data.designation,
        department: data.department,
        qualification: data.qualification,
        experience: data.experience,
        email: data.email,
        photo_url: data.photo_url
      }).where(eq(academicFaculty.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicFaculty).values({
        faculty_name: data.faculty_name,
        designation: data.designation,
        department: data.department,
        qualification: data.qualification,
        experience: data.experience,
        email: data.email,
        photo_url: data.photo_url
      });
      return { success: true };
    }
  });

export const deleteAcademicsFaculty = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicFaculty).where(eq(academicFaculty.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 10. Courses & Programs Offered
// ----------------------------------------------------
export const getAcademicCoursesOffered = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicCoursesOffered);
});

export const upsertAcademicCourseOffered = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicCoursesOffered).set({
        program_name: data.program_name,
        duration: data.duration,
        year_started: parseInt(data.year_started.toString()) || 2026,
        intake: parseInt(data.intake.toString()) || 60,
        program_type: data.program_type,
        program_subtype: data.program_subtype
      }).where(eq(academicCoursesOffered.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicCoursesOffered).values({
        program_name: data.program_name,
        duration: data.duration,
        year_started: parseInt(data.year_started.toString()) || 2026,
        intake: parseInt(data.intake.toString()) || 60,
        program_type: data.program_type,
        program_subtype: data.program_subtype
      });
      return { success: true };
    }
  });

export const deleteAcademicCourseOffered = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicCoursesOffered).where(eq(academicCoursesOffered.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 11. Vice Chancellor & Leadership Profiles
// ----------------------------------------------------
export const getAcademicsVcProfiles = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicsVcProfiles);
});

export const upsertAcademicsVcProfile = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicsVcProfiles).set({
        name: data.name,
        designation: data.designation,
        message: data.message,
        image_url: data.image_url
      }).where(eq(academicsVcProfiles.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicsVcProfiles).values({
        name: data.name,
        designation: data.designation,
        message: data.message,
        image_url: data.image_url
      });
      return { success: true };
    }
  });

export const deleteAcademicsVcProfile = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicsVcProfiles).where(eq(academicsVcProfiles.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 12. Heads of Departments (HOD Desk)
// ----------------------------------------------------
export const getAcademicsHodDesk = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicsHodDesk);
});

export const upsertAcademicsHodDesk = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicsHodDesk).set({
        department: data.department,
        name: data.name,
        designation: data.designation,
        message: data.message,
        achievements: data.achievements,
        image_url: data.image_url
      }).where(eq(academicsHodDesk.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicsHodDesk).values({
        department: data.department,
        name: data.name,
        designation: data.designation,
        message: data.message,
        achievements: data.achievements,
        image_url: data.image_url
      });
      return { success: true };
    }
  });

export const deleteAcademicsHodDesk = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicsHodDesk).where(eq(academicsHodDesk.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 13. Principals & Administrative Heads
// ----------------------------------------------------
export const getAcademicsPrincipals = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicsPrincipals);
});

export const upsertAcademicsPrincipal = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicsPrincipals).set({
        name: data.name,
        designation: data.designation,
        message: data.message,
        image_url: data.image_url
      }).where(eq(academicsPrincipals.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicsPrincipals).values({
        name: data.name,
        designation: data.designation,
        message: data.message,
        image_url: data.image_url
      });
      return { success: true };
    }
  });

export const deleteAcademicsPrincipal = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicsPrincipals).where(eq(academicsPrincipals.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 14. Mission & Vision
// ----------------------------------------------------
export const getAcademicsMissionVision = createServerFn({ method: "GET" }).handler(async () => {
  const result = await db.select().from(academicsMissionVision);
  return result[0] || null;
});

export const updateAcademicsMissionVision = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    const existing = await db.select().from(academicsMissionVision);
    if (existing.length > 0) {
      await db.update(academicsMissionVision).set({
        mission: data.mission,
        vision: data.vision,
        core_values: data.core_values
      }).where(eq(academicsMissionVision.id, existing[0].id));
    } else {
      await db.insert(academicsMissionVision).values({
        mission: data.mission,
        vision: data.vision,
        core_values: data.core_values
      });
    }
    return { success: true };
  });

// ----------------------------------------------------
// 15. Dashboard Quick Stats
// ----------------------------------------------------
export const getAcademicsDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicsDashboardStats);
});

export const upsertAcademicsDashboardStat = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicsDashboardStats).set({
        label: data.label,
        value: data.value,
        icon: data.icon,
        color: data.color,
        trend: data.trend
      }).where(eq(academicsDashboardStats.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicsDashboardStats).values({
        label: data.label,
        value: data.value,
        icon: data.icon,
        color: data.color,
        trend: data.trend
      });
      return { success: true };
    }
  });

export const deleteAcademicsDashboardStat = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicsDashboardStats).where(eq(academicsDashboardStats.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 16. College Academic Committee (CAC)
// ----------------------------------------------------
export const getAcademicsCac = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(academicsCac);
});

export const upsertAcademicsCac = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(academicsCac).set({
        name: data.name,
        role: data.role,
        designation: data.designation
      }).where(eq(academicsCac.id, data.id));
      return { success: true };
    } else {
      await db.insert(academicsCac).values({
        name: data.name,
        role: data.role,
        designation: data.designation
      });
      return { success: true };
    }
  });

export const deleteAcademicsCac = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(academicsCac).where(eq(academicsCac.id, data.id));
    return { success: true };
  });

// ----------------------------------------------------
// 17. Ticker Notifications
// ----------------------------------------------------
export const getTickerNotifications = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(tickerNotifications).orderBy(desc(tickerNotifications.id));
});

export const upsertTickerNotification = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    if (data.id) {
      await db.update(tickerNotifications).set({
        source: data.source,
        label: data.label,
        text: data.text,
        date: data.date,
        to: data.to,
        urgent: data.urgent
      }).where(eq(tickerNotifications.id, data.id));
      return { success: true };
    } else {
      await db.insert(tickerNotifications).values({
        source: data.source,
        label: data.label,
        text: data.text,
        date: data.date,
        to: data.to,
        urgent: data.urgent
      });
      return { success: true };
    }
  });

export const deleteTickerNotification = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(tickerNotifications).where(eq(tickerNotifications.id, data.id));
    return { success: true };
  });


