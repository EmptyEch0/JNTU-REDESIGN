import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { Mail, Quote, UserCircle, GraduationCap, Calendar, Award } from "lucide-react";

export const Route = createFileRoute("/departments/$id/hod")({
  component: HodPage,
});

function HodPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-600">Loading...</div>
      </div>
    );

  const hodDetails = data.faculty?.find((f) => f.designation.includes("HOD"));
  const hodName = hodDetails ? hodDetails.name : `HOD, Dept of ${data.name}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              <span>Department Leadership</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              From the HOD's Desk
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
              A message from our department head, sharing vision, achievements, and future
              directions.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent z-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column - HOD Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              {/* Main Profile Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                {/* Header gradient */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>

                {/* Profile Image */}
                <div className="relative -mt-16 px-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                      {data.hod_photo ? (
                        <img
                          src={data.hod_photo}
                          alt={hodName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${hodName}&background=2563EB&color=fff&bold=true&size=128`;
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                          <UserCircle size={64} className="text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6 text-center">
                  <h2 className="text-2xl font-bold text-slate-900 mt-4">{hodName}</h2>
                  <p className="text-blue-600 font-semibold mt-1">Head of the Department</p>
                  <p className="text-slate-500 text-sm mt-2">Department of {data.name}</p>

                  {/* Contact */}
                  {data.hod_contact && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <a
                        href={`mailto:${data.hod_contact}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <Mail size={18} />
                        <span className="font-medium">Email HOD</span>
                      </a>
                      <p className="text-xs text-slate-400 mt-3 break-all">{data.hod_contact}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Message */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Message Header */}
              <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Quote className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">A Message from the Head</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Updated on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="px-8 py-10">
                <div className="prose prose-lg prose-blue max-w-none">
                  {data.hod_message ? (
                    <div className="space-y-6">
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-12 h-12 text-blue-100 -z-10" />
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                          {data.hod_message}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Quote className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">No message has been uploaded yet.</p>
                      <p className="text-slate-400 text-sm mt-2">Please check back soon.</p>
                    </div>
                  )}
                </div>

                {/* Signature */}
                {data.hod_message && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex flex-col items-end">
                      <div className="text-right">
                        <p className="text-2xl font-serif text-slate-800 mb-2">Best Regards,</p>
                        <p className="text-xl font-bold text-slate-900">{hodName}</p>
                        <p className="text-slate-500 text-sm">Head of the Department</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
