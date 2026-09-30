import { useLoaderData, useParams } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { getAssetUrl, updateDepartment, STATIC_DEPARTMENTS } from "@/lib/departments";
import { SafeImage } from "@/components/SafeImage";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminUpload } from "@/components/AdminEditPanel";
import { 
  Mail, 
  Quote, 
  UserCircle, 
  GraduationCap, 
  Save, 
  Image as ImageIcon, 
  Mail as MailIcon,
  MessageSquare
} from "lucide-react";
import { ProfileRenderer } from "@/components/ProfileRenderer";

export function HodSection({ embedded = false }: { embedded?: boolean }) {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const queryClient = useQueryClient();
  // 1. Fetch the active dynamic route parameters matching this branch slug context
  const { id: routeSlug } = useParams({ strict: false }) as { id?: string };

  // 2. Consume specialized department tracking state maps from Admin Context
  const { isDeptEditing } = useAdmin();

  // 3. Evaluate edit permissions using the active branch slug (e.g., "cse", "it")
  const isEditMode = isDeptEditing(routeSlug || "");

  // 4. Resolve HOD faculty member and fallback data
  const hodDetails = data?.faculty?.find((f) => /hod|head of (the )?department/i.test(f.designation || ""));
  const staticDept = STATIC_DEPARTMENTS.find((d) => d.slug === data?.slug || d.id === data?.id);
  const rawHodName = (hodDetails?.name || data?.hod || staticDept?.hod || "").trim();
  const hodName = rawHodName || `Head of Department`;

  const defaultEmail = data?.slug
    ? `hod.${data.slug === "mech" ? "me" : data.slug === "bshss" ? "bs" : data.slug}@jntugvcev.edu.in`
    : "";

  // Local state for editing HOD details
  const [editData, setEditData] = useState({
    hod_photo: data?.hod_photo || hodDetails?.photo_url || "",
    hod_contact: data?.hod_contact || hodDetails?.email || defaultEmail || "",
    hod_message: data?.hod_message || "",
  });

  // Sync state if data changes
  useEffect(() => {
    if (data) {
      setEditData({
        hod_photo: data.hod_photo || hodDetails?.photo_url || "",
        hod_contact: data.hod_contact || hodDetails?.email || defaultEmail || "",
        hod_message: data.hod_message || "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (updatedFields: any) =>
      updateDepartment({ data: { id: data.id, ...updatedFields } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department", data.slug] });
      toast.success("HOD details updated successfully!");
    },
  });

  if (!data) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-slate-600">Loading...</div>
    </div>
  );

  const activePhoto = editData.hod_photo || data.hod_photo || hodDetails?.photo_url || "";
  const displayContact = editData.hod_contact || data.hod_contact || hodDetails?.email || defaultEmail;

  if (embedded) {
    return (
      <EmbeddedHod
        deptName={data.name}
        hodName={hodName}
        photo={activePhoto}
        contact={displayContact}
        message={editData.hod_message}
        isEditMode={isEditMode}
        editData={editData}
        setEditData={setEditData}
        onSave={() => mutation.mutate(editData)}
      />
    );
  }

  return (
    <div id="hod" className={embedded ? "bg-white scroll-mt-40" : "min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50"}>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="relative z-20 max-w-[1380px] mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4 text-blue-300" />
              <span>Department Leadership</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              From the HOD's Desk
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
              A message from our department head, sharing vision, achievements, and future directions.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent z-20"></div>
      </div>

      <div className="max-w-[1380px] mx-auto px-6 py-16">
        {isEditMode && (
          <div className="mb-8 p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between">
            <p className="text-amber-800 text-sm font-medium">
              <strong>Admin Mode:</strong> You are currently editing the HOD's profile and message.
            </p>
            <button
              onClick={() => mutation.mutate(editData)}
              className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-amber-700 transition-all"
            >
              <Save size={18} /> Save All Changes
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column - HOD Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border transition-all ${isEditMode ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'}`}>
                <div className={`h-32 bg-gradient-to-r ${isEditMode ? 'from-amber-500 to-amber-600' : 'from-blue-600 to-blue-800'}`}></div>

                {/* Profile Image & Photo URL Edit */}
                <div className="relative -mt-16 px-6 text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-50 mx-auto">
                      <SafeImage
                        src={activePhoto}
                        alt={hodName}
                        fallbackName={hodName}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </div>

                    {isEditMode && (
                      <div className="mt-4 text-left">
                        <label className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1 mb-1">
                          <ImageIcon size={12} /> HOD Photo
                        </label>
                        <AdminUpload
                          value={editData.hod_photo}
                          onChange={(newUrl) => setEditData({ ...editData, hod_photo: newUrl })}
                          module="departments"
                          category="hod"
                          placeholder="Upload Photo"
                        />
                      </div>
                    )}

                  <h2 className="text-2xl font-bold text-slate-900 mt-4">{hodName}</h2>
                  <p className="text-blue-600 font-semibold mt-1">Head of the Department</p>
                  <p className="text-slate-500 text-sm mt-1">Dept. of {data.name}</p>

                  {/* Contact Edit */}
                  <div className="mt-5 pt-4 border-t border-slate-100 pb-4">
                    {isEditMode ? (
                      <div className="text-left">
                        <label className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1 mb-1">
                          <MailIcon size={12} /> Contact Email
                        </label>
                        <input
                          className="w-full text-xs p-2 border border-amber-200 rounded bg-amber-50/50"
                          value={editData.hod_contact}
                          onChange={(e) => setEditData({ ...editData, hod_contact: e.target.value })}
                          placeholder="hod@jntugvcev.edu.in"
                        />
                      </div>
                    ) : displayContact && (
                      <div className="flex flex-col items-center">
                        <a
                          href={`mailto:${displayContact}`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl transition-all shadow-sm text-xs font-semibold"
                        >
                          <Mail size={14} />
                          <span>Email HOD</span>
                        </a>
                        <p className="text-[11px] text-slate-400 mt-2 break-all select-all font-mono">{displayContact}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Message */}
          <div className="lg:col-span-8">
            <div className={`bg-white rounded-2xl shadow-xl border overflow-hidden transition-all ${isEditMode ? 'border-amber-300' : 'border-slate-200'}`}>
              <div className={`px-8 py-6 border-b flex items-center justify-between ${isEditMode ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${isEditMode ? 'bg-amber-100' : 'bg-blue-50'}`}>
                    <MessageSquare className={`w-6 h-6 ${isEditMode ? 'text-amber-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">A Message from the Head</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-10">
                {isEditMode ? (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-amber-600 uppercase">Message Content</label>
                    <textarea
                      className="w-full min-h-[400px] p-6 border-2 border-amber-100 rounded-2xl bg-amber-50/30 text-slate-700 leading-relaxed outline-none focus:border-amber-300 transition-all"
                      value={editData.hod_message}
                      onChange={(e) => setEditData({ ...editData, hod_message: e.target.value })}
                      placeholder="Write the HOD message here..."
                    />
                  </div>
                ) : (
                  <div className="prose prose-lg prose-blue max-w-none">
                    {editData.hod_message ? (
                      <div className="relative">
                        <Quote className="absolute -top-4 -left-4 w-12 h-12 text-blue-50 -z-10" />
                        <div className="text-slate-700">
                          <ProfileRenderer content={editData.hod_message} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Quote className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">No message has been uploaded yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {editData.hod_message && !isEditMode && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex flex-col items-end">
                      <div className="text-right">
                        <p className="text-2xl font-serif text-slate-400 mb-2 italic">Best Regards,</p>
                        <p className="text-xl font-bold text-slate-900">{hodName}</p>
                        <p className="text-slate-500 text-sm font-medium">Head of the Department</p>
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

function EmbeddedHod({
  deptName, hodName, photo, contact, message, isEditMode, editData, setEditData, onSave,
}: {
  deptName: string;
  hodName: string;
  photo: string;
  contact: string;
  message: string;
  isEditMode: boolean;
  editData: any;
  setEditData: (v: any) => void;
  onSave: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (message || "").length > 800;
  const clamped = isLong && !expanded && !isEditMode;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#hod") {
      const t = setTimeout(
        () => document.getElementById("hod")?.scrollIntoView({ behavior: "smooth", block: "start" }),
        350,
      );
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <section id="hod" className="scroll-mt-40 mx-auto w-full max-w-4xl mt-0 pt-8 pb-12 border-t border-slate-200">
      <div className="flex items-center gap-3 mb-2">
        <GraduationCap className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">From the HOD's Desk</h2>
      </div>
      <p className="text-sm text-slate-500 mb-6 ml-9">
        A message from the Head of the Department of {deptName}
      </p>

      {isEditMode && (
        <div className="mb-5 p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between gap-3">
          <p className="text-amber-800 text-sm font-medium">
            <strong>Admin Mode:</strong> editing the HOD's profile and message.
          </p>
          <button
            onClick={onSave}
            className="flex items-center gap-2 bg-amber-600 text-white px-5 py-2 rounded-xl font-bold shadow-sm hover:bg-amber-700 transition-all"
          >
            <Save size={16} /> Save
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden md:grid md:grid-cols-[250px_1fr]">
        {/* HOD profile */}
        <div className="p-6 bg-white/70 md:border-r border-slate-200 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-slate-200 bg-slate-100">
            <SafeImage
              src={photo}
              alt={hodName}
              fallbackName={hodName}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 leading-snug">{hodName}</h3>
          <p className="text-blue-600 text-sm font-semibold mt-0.5">Head of the Department</p>
          <p className="text-slate-500 text-xs mt-0.5">Dept. of {deptName}</p>

          {isEditMode ? (
            <div className="mt-4 w-full text-left space-y-3">
              <div>
                <label className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1 mb-1">
                  <ImageIcon size={12} /> HOD Photo
                </label>
                <AdminUpload
                  value={editData.hod_photo}
                  onChange={(u: string) => setEditData({ ...editData, hod_photo: u })}
                  module="departments"
                  category="hod"
                  placeholder="Upload Photo"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1 mb-1">
                  <MailIcon size={12} /> Contact Email
                </label>
                <input
                  className="w-full text-xs p-2 border border-amber-200 rounded bg-amber-50/50"
                  value={editData.hod_contact}
                  onChange={(e) => setEditData({ ...editData, hod_contact: e.target.value })}
                  placeholder="hod@jntugvcev.edu.in"
                />
              </div>
            </div>
          ) : (
            contact && (
              <a
                href={`mailto:${contact}`}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl transition-all shadow-sm text-xs font-semibold"
              >
                <Mail size={14} /> Email HOD
              </a>
            )
          )}
        </div>

        {/* Message */}
        <div className="relative p-6 md:p-8">
          <Quote className="absolute top-5 right-6 w-14 h-14 text-blue-100" />
          {isEditMode ? (
            <div className="relative space-y-2">
              <label className="text-xs font-bold text-amber-600 uppercase">Message Content</label>
              <textarea
                className="w-full min-h-[320px] p-4 border-2 border-amber-100 rounded-2xl bg-amber-50/30 text-slate-700 leading-relaxed outline-none focus:border-amber-300"
                value={editData.hod_message}
                onChange={(e) => setEditData({ ...editData, hod_message: e.target.value })}
                placeholder="Write the HOD message here..."
              />
            </div>
          ) : message ? (
            <div className="relative">
              <div className={`relative text-slate-700 leading-relaxed ${clamped ? "max-h-72 overflow-hidden" : ""}`}>
                <ProfileRenderer content={message} />
                {clamped && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
                )}
              </div>
              {isLong && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-3 text-sm font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                >
                  {expanded ? "Show less" : "Read full message"}
                </button>
              )}
              <div className="mt-6 pt-4 border-t border-slate-200 text-right">
                <p className="font-bold text-slate-900">{hodName}</p>
                <p className="text-slate-500 text-sm">Head of the Department</p>
              </div>
            </div>
          ) : (
            <div className="relative text-center py-10">
              <p className="text-slate-400">No message has been uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
