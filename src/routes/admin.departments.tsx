import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDepartments,
  getFacultyByDept,
  addFaculty,
  deleteFaculty,
  getLabsByDept,
  addLaboratory,
  deleteLaboratory,
  getAchievementsByDept,
  addAchievement,
  // NEW API IMPORTS (Ensure these are exported in your lib/departments.ts)
  updateDepartment, 
  getCoursesByDept,
  addCourse,
  deleteCourse,
  getGalleryByDept,
  addToGallery,
  deleteFromGallery
} from "../lib/departments";
import { PageHero } from "@/components/PageHero";
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "@tanstack/react-router";
import { getAssetUrl } from "@/lib/assets";
import { toast } from "sonner";
import { AdminUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/admin/departments")({
  component: AdminDepartmentsPage,
});

function AdminDepartmentsPage() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAdmin) navigate({ to: "/" });
  }, [isAdmin, navigate]);

  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"about" | "faculty" | "labs" | "courses" | "gallery" | "hod">("about");

  // --- Form States ---
  const [deptGeneralForm, setDeptGeneralForm] = useState({
    about_details: "", vision: "", mission: ""
  });
  const [hodForm, setHodForm] = useState({
    hod: "", hod_photo: "", hod_message: "", hod_contact: ""
  });
  const [courseForm, setCourseForm] = useState({
    name: "", level: "", regulation: "", syllabus_url: ""
  });
  const [galleryForm, setGalleryForm] = useState({
    title: "", image_url: "", category: "General", description: ""
  });
  const [facultyForm, setFacultyForm] = useState({ name: "", designation: "", specialization: "", photo_url: "", profile_link: "" });
  const [labForm, setLabForm] = useState({ name: "", description: "", location: "", photo_url: "", specs: "{}" });

  // --- Queries ---
  const { data: depts } = useQuery({ queryKey: ["departments"], queryFn: getDepartments });
  
  const currentDept = depts?.find(d => d.id === selectedDeptId);

  // Sync Form when currentDept changes
  useEffect(() => {
    if (currentDept) {
      setDeptGeneralForm({
        about_details: currentDept.about_details || "",
        vision: currentDept.vision || "",
        mission: currentDept.mission || ""
      });
      setHodForm({
        hod: currentDept.hod || "",
        hod_photo: currentDept.hod_photo || "",
        hod_message: currentDept.hod_message || "",
        hod_contact: currentDept.hod_contact || ""
      });
    }
  }, [currentDept]);

  const { data: facultyList } = useQuery({ queryKey: ["faculty", selectedDeptId], queryFn: () => getFacultyByDept({ data: selectedDeptId } as any), enabled: !!selectedDeptId });
  const { data: labsList } = useQuery({ queryKey: ["labs", selectedDeptId], queryFn: () => getLabsByDept({ data: selectedDeptId } as any), enabled: !!selectedDeptId });
  const { data: coursesList } = useQuery({ queryKey: ["courses", selectedDeptId], queryFn: () => getCoursesByDept({ data: selectedDeptId } as any), enabled: !!selectedDeptId });
  const { data: galleryList } = useQuery({ queryKey: ["gallery", selectedDeptId], queryFn: () => getGalleryByDept({ data: selectedDeptId } as any), enabled: !!selectedDeptId });

  // --- Mutations ---
  const updateDeptMutation = useMutation({
    mutationFn: (updates: any) => updateDepartment({ data: { id: selectedDeptId, ...updates } } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department updated successfully");
    }
  });

  const addCourseMutation = useMutation({
    mutationFn: (data: any) => addCourse({ data: { ...data, dept_id: selectedDeptId } } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", selectedDeptId] });
      setCourseForm({ name: "", level: "", regulation: "", syllabus_url: "" });
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: number) => deleteCourse({ data: { id } } as any),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses", selectedDeptId] })
  });

  const addGalleryMutation = useMutation({
    mutationFn: (data: any) => addToGallery({ data: { ...data, dept_id: selectedDeptId } } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery", selectedDeptId] });
      setGalleryForm({ title: "", image_url: "", category: "General", description: "" });
    }
  });

  const addFacultyMutation = useMutation({
    mutationFn: (data: any) => addFaculty({ data: { ...data, dept_id: selectedDeptId } } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty", selectedDeptId] });
      setFacultyForm({ name: "", designation: "", specialization: "", photo_url: "", profile_link: "" });
      toast.success("Faculty member added successfully");
    }
  });

  const deleteFacultyMutation = useMutation({
    mutationFn: (id: number) => deleteFaculty({ data: { id } } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty", selectedDeptId] });
      toast.success("Faculty member removed");
    }
  });

  const addLabMutation = useMutation({
    mutationFn: (data: any) => addLaboratory({ data: { ...data, dept_id: selectedDeptId } } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labs", selectedDeptId] });
      setLabForm({ name: "", description: "", location: "", photo_url: "", specs: "{}" });
      toast.success("Laboratory added successfully");
    }
  });

  const deleteLabMutation = useMutation({
    mutationFn: (id: number) => deleteLaboratory({ data: { id } } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labs", selectedDeptId] });
      toast.success("Laboratory removed");
    }
  });

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-sand/30 pb-20">
      <PageHero eyebrow="Dashboard" title="Department Admin" subtitle="Manage courses, faculty, and gallery." />

      <div className="container-narrow mt-10 space-y-8">
        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <label className="block text-sm font-bold text-ink mb-3">Target Department</label>
          <select 
            className="w-full p-4 rounded-xl border border-border bg-white" 
            value={selectedDeptId} 
            onChange={(e) => setSelectedDeptId(e.target.value)}
          >
            <option value="">Select a branch...</option>
            {depts?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </section>

        {selectedDeptId && (
          <div className="space-y-6">
            <div className="flex bg-white p-1 rounded-xl border border-border shadow-sm overflow-x-auto">
              {(["about", "hod", "faculty", "labs", "courses", "gallery"] as const).map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-4 text-sm font-bold rounded-lg capitalize whitespace-nowrap transition-all ${activeTab === tab ? "bg-primary text-white" : "text-muted-foreground hover:text-ink"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ABOUT & VISION TAB */}
            {activeTab === "about" && (
              <section className="bg-card p-8 rounded-2xl border border-border space-y-4">
                <h3 className="text-xl font-bold text-ink">About, Vision & Mission</h3>
                <textarea className="w-full p-3 rounded-lg border border-border" rows={4} placeholder="About Details" value={deptGeneralForm.about_details} onChange={e => setDeptGeneralForm({...deptGeneralForm, about_details: e.target.value})} />
                <textarea className="w-full p-3 rounded-lg border border-border" placeholder="Vision" value={deptGeneralForm.vision} onChange={e => setDeptGeneralForm({...deptGeneralForm, vision: e.target.value})} />
                <textarea className="w-full p-3 rounded-lg border border-border" placeholder="Mission" value={deptGeneralForm.mission} onChange={e => setDeptGeneralForm({...deptGeneralForm, mission: e.target.value})} />
                <button onClick={() => updateDeptMutation.mutate(deptGeneralForm)} className="w-full bg-primary text-white p-3 rounded-xl font-bold">Update General Info</button>
              </section>
            )}

            {/* HOD TAB */}
            {activeTab === "hod" && (
              <section className="bg-card p-8 rounded-2xl border border-border space-y-4">
                <h3 className="text-xl font-bold text-ink">HOD Information</h3>
                <input className="w-full p-3 rounded-lg border border-border" placeholder="HOD Name" value={hodForm.hod} onChange={e => setHodForm({...hodForm, hod: e.target.value})} />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">HOD Photo</label>
                  <AdminUpload
                    value={hodForm.hod_photo}
                    onChange={(newUrl) => setHodForm({ ...hodForm, hod_photo: newUrl })}
                    module="departments"
                    category="hod"
                    placeholder="Upload HOD Photo"
                  />
                </div>
                <input className="w-full p-3 rounded-lg border border-border" placeholder="Contact Info" value={hodForm.hod_contact} onChange={e => setHodForm({...hodForm, hod_contact: e.target.value})} />
                <textarea className="w-full p-3 rounded-lg border border-border" placeholder="HOD Message" value={hodForm.hod_message} onChange={e => setHodForm({...hodForm, hod_message: e.target.value})} />
                <button onClick={() => updateDeptMutation.mutate(hodForm)} className="w-full bg-primary text-white p-3 rounded-xl font-bold">Update HOD Details</button>
              </section>
            )}

            {/* FACULTY TAB */}
            {activeTab === "faculty" && (
              <div className="space-y-6">
                <section className="bg-card p-8 rounded-2xl border border-border space-y-4">
                  <h3 className="text-xl font-bold text-ink">Add Faculty Member</h3>
                  <form onSubmit={(e) => { e.preventDefault(); addFacultyMutation.mutate(facultyForm); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input className="p-3 border rounded-lg" placeholder="Faculty Name" value={facultyForm.name} onChange={e => setFacultyForm({...facultyForm, name: e.target.value})} required />
                      <input className="p-3 border rounded-lg" placeholder="Designation (e.g. Professor, Assistant Professor)" value={facultyForm.designation} onChange={e => setFacultyForm({...facultyForm, designation: e.target.value})} required />
                      <input className="p-3 border rounded-lg md:col-span-2" placeholder="Specialization" value={facultyForm.specialization} onChange={e => setFacultyForm({...facultyForm, specialization: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-550">Faculty Photo (Direct VPS Upload)</label>
                      <AdminUpload
                        value={facultyForm.photo_url}
                        onChange={(newUrl) => setFacultyForm({ ...facultyForm, photo_url: newUrl })}
                        module="departments"
                        category="faculty"
                        placeholder="Drag & drop or click to upload faculty photo"
                      />
                    </div>
                    <button className="w-full bg-primary text-white p-3 rounded-xl font-bold cursor-pointer">Add Faculty Member</button>
                  </form>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facultyList?.map((f: any) => (
                    <div key={f.id} className="p-4 bg-white border rounded-xl flex items-center justify-between shadow-sm gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={getAssetUrl(f.photo_url) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                          alt={f.name} 
                          className="w-12 h-12 rounded-full object-cover shrink-0 bg-slate-100" 
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{f.name}</p>
                          <p className="text-xs text-slate-500 truncate">{f.designation}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteFacultyMutation.mutate(f.id)} className="text-red-500 font-bold text-xs p-2 hover:bg-red-50 rounded-lg">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LABS TAB */}
            {activeTab === "labs" && (
              <div className="space-y-6">
                <section className="bg-card p-8 rounded-2xl border border-border space-y-4">
                  <h3 className="text-xl font-bold text-ink">Add Laboratory</h3>
                  <form onSubmit={(e) => { e.preventDefault(); addLabMutation.mutate(labForm); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input className="p-3 border rounded-lg" placeholder="Lab Name" value={labForm.name} onChange={e => setLabForm({...labForm, name: e.target.value})} required />
                      <input className="p-3 border rounded-lg" placeholder="Location" value={labForm.location} onChange={e => setLabForm({...labForm, location: e.target.value})} />
                      <textarea className="p-3 border rounded-lg md:col-span-2" placeholder="Description" rows={3} value={labForm.description} onChange={e => setLabForm({...labForm, description: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-550">Lab Photo</label>
                      <AdminUpload
                        value={labForm.photo_url}
                        onChange={(newUrl) => setLabForm({ ...labForm, photo_url: newUrl })}
                        module="departments"
                        category="labs"
                        placeholder="Upload Lab Photo"
                      />
                    </div>
                    <button className="w-full bg-primary text-white p-3 rounded-xl font-bold cursor-pointer">Add Laboratory</button>
                  </form>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {labsList?.map((l: any) => (
                    <div key={l.id} className="p-4 bg-white border rounded-xl flex items-center justify-between shadow-sm gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={getAssetUrl(l.photo_url) || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100"} 
                          alt={l.name} 
                          className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100" 
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{l.name}</p>
                          <p className="text-xs text-slate-500 truncate">{l.location}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteLabMutation.mutate(l.id)} className="text-red-500 font-bold text-xs p-2 hover:bg-red-50 rounded-lg">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COURSES TAB */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <section className="bg-card p-8 rounded-2xl border border-border">
                  <h3 className="text-xl font-bold text-ink mb-4">Add Course</h3>
                  <form onSubmit={(e) => { e.preventDefault(); addCourseMutation.mutate(courseForm); }} className="grid grid-cols-2 gap-4">
                    <input className="p-3 border rounded-lg" placeholder="Course Name" value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} required />
                    <input className="p-3 border rounded-lg" placeholder="Level (e.g. UG/PG)" value={courseForm.level} onChange={e => setCourseForm({...courseForm, level: e.target.value})} />
                    <input className="p-3 border rounded-lg" placeholder="Regulation" value={courseForm.regulation} onChange={e => setCourseForm({...courseForm, regulation: e.target.value})} />
                    <input className="p-3 border rounded-lg" placeholder="Syllabus URL" value={courseForm.syllabus_url} onChange={e => setCourseForm({...courseForm, syllabus_url: e.target.value})} />
                    <button className="col-span-2 bg-primary text-white p-3 rounded-xl font-bold">Add Course</button>
                  </form>
                </section>
                <div className="grid gap-2">
                  {coursesList?.map((c: any) => (
                    <div key={c.id} className="p-4 bg-white border rounded-xl flex justify-between items-center shadow-sm">
                      <span>{c.name} ({c.level})</span>
                      <button onClick={() => deleteCourseMutation.mutate(c.id)} className="text-red-500 font-bold">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <section className="bg-card p-8 rounded-2xl border border-border">
                  <h3 className="text-xl font-bold text-ink mb-4">Add to Gallery</h3>
                  <form onSubmit={(e) => { e.preventDefault(); addGalleryMutation.mutate(galleryForm); }} className="space-y-4">
                    <input className="w-full p-3 border rounded-lg" placeholder="Image Title" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} required />
                    <AdminUpload
                      value={galleryForm.image_url}
                      onChange={(newUrl) => setGalleryForm({ ...galleryForm, image_url: newUrl })}
                      module="departments"
                      category="gallery"
                      placeholder="Upload gallery image"
                    />
                    <button className="w-full bg-primary text-white p-3 rounded-xl font-bold">Upload Image</button>
                  </form>
                </section>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryList?.map((g: any) => (
                    <div key={g.id} className="relative aspect-video rounded-xl overflow-hidden group">
                      <img decoding="async" loading="lazy" src={getAssetUrl(g.image_url)} className="object-cover w-full h-full" alt={g.title} />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <button onClick={() => deleteFromGallery({ data: { id: g.id } } as any)} className="bg-red-500 text-white p-2 rounded-lg text-xs">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}