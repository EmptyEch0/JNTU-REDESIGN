// /src/lib/alumni-data.ts or add to existing RAG pipeline

export const ALUMNI_CHUNKS = [
    {
      content: "Alumni Portal: https://alumni.jntugv.edu.in. The JNTU-GV Alumni Portal is the official networking platform for former and current students. Alumni can register, update profiles, connect with classmates, access career opportunities, and participate in campus events.",
      source_type: "alumni",
      metadata: {
        title: "Alumni Portal",
        url: "https://alumni.jntugv.edu.in",
        category: "student_corner"
      },
      similarity: 1.0
    },
    {
      content: "How to register on JNTU-GV Alumni Portal: Visit https://alumni.jntugv.edu.in, click Register, enter your roll number, email, and personal details. Verify with OTP sent to your registered email or phone. Complete your profile to access all features including networking, events, and mentorship opportunities.",
      source_type: "alumni",
      metadata: {
        title: "Alumni Registration",
        url: "https://alumni.jntugv.edu.in/register",
        category: "student_corner"
      },
      similarity: 0.9
    }
  ];