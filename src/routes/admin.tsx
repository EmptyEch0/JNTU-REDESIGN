import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";

import { getHostelData } from "@/funcs/hostel.server";
import { getSportsData } from "@/funcs/sports.server";
import { getLibraryData } from "@/funcs/library.server";
import { getDispensaryData } from "@/funcs/dispensary.server";
import { getEngineeringData } from "@/funcs/engineer.server";
import { getMusicClubData } from "@/funcs/music.server";
import { getStudentActivityData } from "@/funcs/studentactivity.server";

import {
  createStructure as createHostelStructure,
  deleteStructure as deleteHostelStructure,
  createPerson as createHostelPerson,
  deletePerson as deleteHostelPerson,
  updateContent as updateHostelContent,
  createImage as createHostelImage,
  deleteImage as deleteHostelImage
} from "@/funcs/hostel.admin.server";

import {
  updateSportsContent,
  createPerson as createSportsPerson, deletePerson as deleteSportsPerson,
  createInfra as createSportsInfra, deleteInfra as deleteSportsInfra,
  createAchievement as createSportsAchievement, deleteAchievement as deleteSportsAchievement,
  createImage as createSportsImage, deleteImage as deleteSportsImage,
} from "@/funcs/sports.admin.server";

import {
  updateLibraryContent,
  createSection as createLibSection, deleteSection as deleteLibSection,
  createStat as createLibStat, deleteStat as deleteLibStat,
  createMeta as createLibMeta, deleteMeta as deleteLibMeta,
  createTeam as createLibTeam, deleteTeam as deleteLibTeam,
  createImage as createLibImage, deleteImage as deleteLibImage
} from "@/funcs/library.admin.server";

import {
  updateContent as updateDispContent,
  createPerson as createDispPerson, deletePerson as deleteDispPerson,
  createMeta as createDispMeta, deleteMeta as deleteDispMeta,
  createImage as createDispImage, deleteImage as deleteDispImage
} from "@/funcs/dispensary.admin.server";

import {
  updateEngineeringContent,
  createMetaPoint as createEngMeta, deleteMetaPoint as deleteEngMeta,
  createStaffMember as createEngStaff, deleteStaffMember as deleteEngStaff,
} from "@/funcs/engineer.admin.server";

import {
  updateMusicContent,
  createMusicPerson, deleteMusicPerson,
  createMusicEquipment, deleteMusicEquipment,
  createMusicMember, deleteMusicMember,
  createMusicImage, deleteMusicImage,
} from "@/funcs/music.admin.server";

import {
  updateStudentClub,
  deleteStudentClub,
  createClubContent,
  deleteClubContent,
  createClubImage,
  deleteClubImage,
} from "@/funcs/studentactivity.admin.server";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const [hostels, sports, library, dispensary, engineering, music, studentActivity] = await Promise.all([
      getHostelData(),
      getSportsData(),
      getLibraryData(),
      getDispensaryData(),
      getEngineeringData(),
      getMusicClubData(),
      getStudentActivityData(),
    ]);
    return { hostels, sports, library, dispensary, engineering, music, studentActivity };
  },
  component: AdminPage,
});

const defaultHeaders = { "x-admin-key": "admin123" };

function AdminPage() {
  const data = Route.useLoaderData() as any;
  const router = useRouter();
  const { isAdmin, login, logout } = useAdmin();
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("Hostels");

  const reload = async () => {
    await router.invalidate();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      reload();
    } else {
      alert("Wrong password");
    }
  };

  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-md max-w-sm w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 font-display">Admin Login</h2>
            <p className="text-slate-500 text-sm mt-1">Enter your password to access admin features.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const TABS = ["Hostels", "Sports", "Library", "Dispensary", "Engineering Cell", "Music Club", "Student Activity"];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar navigation */}
      <div className="w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white font-display border-b border-slate-800 pb-4">JNTU Admin</h2>
          <nav className="flex flex-col gap-1">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === t 
                    ? "bg-blue-600 text-white font-semibold" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
        <button 
          onClick={() => { logout(); reload(); }}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-semibold cursor-pointer shadow transition-all duration-150"
        >
          Logout Panel
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10 animate-[fade-in_0.3s_ease-out]">
          {activeTab === "Hostels" && <HostelsPanel data={data.hostels} reload={reload} />}
          {activeTab === "Sports" && <SportsPanel data={data.sports} reload={reload} />}
          {activeTab === "Library" && <LibraryPanel data={data.library} reload={reload} />}
          {activeTab === "Dispensary" && <DispensaryPanel data={data.dispensary} reload={reload} />}
          {activeTab === "Engineering Cell" && <EngineeringPanel data={data.engineering} reload={reload} />}
          {activeTab === "Music Club" && <MusicPanel data={data.music} reload={reload} />}
          {activeTab === "Student Activity" && <StudentActivityPanel data={data.studentActivity} reload={reload} />}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   🏢 HOSTELS PANEL
========================================================================= */
function HostelsPanel({ data, reload }: any) {
  const [infoForm, setInfoForm] = useState<any>({
    description: data.content?.description || "",
    officerName: data.content?.officerName || "",
    officerRole: data.content?.officerRole || "",
    officerImage: data.content?.officerImage || "",
    healthName: data.content?.healthName || "",
    healthTiming: data.content?.healthTiming || "",
  });

  const [structForm, setStructForm] = useState<any>({});
  const [personForm, setPersonForm] = useState<any>({});
  const [imgUrl, setImgUrl] = useState("");

  const saveInfo = async () => {
    await updateHostelContent({ data: infoForm, headers: defaultHeaders });
    alert("Main Hostel Information Updated Successfully!");
    reload();
  };

  const addStruct = async () => {
    if (!structForm.name || !structForm.category) return;
    await createHostelStructure({ data: structForm, headers: defaultHeaders });
    setStructForm({});
    reload();
  };

  const delStruct = async (id: number) => {
    await deleteHostelStructure({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addPerson = async () => {
    if (!personForm.name || !personForm.roleType) return;
    await createHostelPerson({ data: personForm, headers: defaultHeaders });
    setPersonForm({});
    reload();
  };

  const delPerson = async (id: number) => {
    await deleteHostelPerson({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addImg = async () => {
    if (!imgUrl) return;
    await createHostelImage({ data: { url: imgUrl }, headers: defaultHeaders });
    setImgUrl("");
    reload();
  };

  const delImg = async (id: number) => {
    await deleteHostelImage({ data: { id }, headers: defaultHeaders });
    reload();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2 text-slate-950">Hostels Administration</h2>
      
      {/* SECTION 1: MAIN DETAILS */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">1. Main Information & Officer</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hostel Description</label>
            <textarea placeholder="Hostel Overview Description" rows={3} value={infoForm.description} onChange={e => setInfoForm({...infoForm, description: e.target.value})} className="border p-2 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Officer Name</label>
              <input placeholder="e.g., Dr. P. Rajesh" value={infoForm.officerName} onChange={e => setInfoForm({...infoForm, officerName: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Officer Role</label>
              <input placeholder="e.g., Coordinating Warden" value={infoForm.officerRole} onChange={e => setInfoForm({...infoForm, officerRole: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Officer Photo URL</label>
            <input placeholder="Enter image URL..." value={infoForm.officerImage} onChange={e => setInfoForm({...infoForm, officerImage: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={saveInfo} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Save Main Details</button>
      </div>

      {/* SECTION 2: WARDENS & STAFF */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">2. Wardens & Caretakers</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Staff Name</label>
            <input placeholder="Name" value={personForm.name || ""} onChange={e => setPersonForm({...personForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Staff Role / Category</label>
            <select value={personForm.roleType || ""} onChange={e => setPersonForm({...personForm, roleType: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">-- Select Role Type --</option>
              <option value="warden">Warden</option>
              <option value="caretaker">Caretaker</option>
              <option value="dispensary">Dispensary Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Staff Designation</label>
            <input placeholder="e.g., Deputy Warden" value={personForm.designation || ""} onChange={e => setPersonForm({...personForm, designation: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Number</label>
            <input placeholder="Phone / Email" value={personForm.contact || ""} onChange={e => setPersonForm({...personForm, contact: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={addPerson} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Staff Member</button>
        <div className="divide-y border-t mt-3 pt-2">
          {data.people?.map((p: any) => (
            <div key={p.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{p.name}</strong> - {p.designation} (<span className="text-blue-600 uppercase text-[10px] font-bold">{p.roleType}</span>)</span>
              <button onClick={() => delPerson(p.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: HOSTEL STRUCTURES & BLOCKS */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">3. Blocks & Facilities</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Facility Name</label>
            <input placeholder="e.g., Satpura Block / Gym" value={structForm.name || ""} onChange={e => setStructForm({...structForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
            <select value={structForm.category || ""} onChange={e => setStructForm({...structForm, category: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">-- Select Category --</option>
              <option value="boys">Boys Hostels</option>
              <option value="girls">Girls Hostels</option>
              <option value="facility">Common Facility</option>
            </select>
          </div>
        </div>
        <button onClick={addStruct} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Structure</button>
        <div className="divide-y border-t mt-3 pt-2">
          {data.structures?.map((s: any) => (
            <div key={s.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{s.name}</strong> (<span className="text-emerald-600 font-bold capitalize text-xs">{s.category}</span>)</span>
              <button onClick={() => delStruct(s.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: GALLERY */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">4. Hostel Gallery Images</h3>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gallery Image URL</label>
          <input placeholder="Enter high-res image URL..." value={imgUrl} onChange={e => setImgUrl(e.target.value)} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500 mb-3"/>
          <button onClick={addImg} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Gallery Image</button>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4 max-h-[220px] overflow-y-auto border p-2 rounded">
          {data.images?.map((img: any) => (
            <div key={img.id} className="relative group border rounded overflow-hidden aspect-[16/10] bg-slate-50">
              <img src={img.url} className="w-full h-full object-cover" />
              <button onClick={() => delImg(img.id)} className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded text-[10px] font-bold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   🏆 SPORTS PANEL
========================================================================= */
function SportsPanel({ data, reload }: any) {
  const [infoForm, setInfoForm] = useState<any>(data.info || {});
  const [personForm, setPersonForm] = useState<any>({});
  const [infraForm, setInfraForm] = useState<any>({});
  const [achieveForm, setAchieveForm] = useState<any>({});
  const [imgUrl, setImgUrl] = useState("");

  const saveInfo = async () => {
    await updateSportsContent({ data: infoForm, headers: defaultHeaders });
    alert("Sports Coordinator Info Saved successfully!");
    reload();
  };

  const addPerson = async () => {
    if (!personForm.name || !personForm.designation) return;
    await createSportsPerson({ data: { ...personForm, roleType: "faculty" }, headers: defaultHeaders });
    setPersonForm({});
    reload();
  };

  const delPerson = async (id: number) => {
    await deleteSportsPerson({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addInfra = async () => {
    if (!infraForm.name || !infraForm.category) return;
    await createSportsInfra({ data: infraForm, headers: defaultHeaders });
    setInfraForm({});
    reload();
  };

  const delInfra = async (id: number) => {
    await deleteSportsInfra({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addAchieve = async () => {
    if (!achieveForm.title || !achieveForm.year) return;
    await createSportsAchievement({ data: achieveForm, headers: defaultHeaders });
    setAchieveForm({});
    reload();
  };

  const delAchieve = async (id: number) => {
    await deleteSportsAchievement({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addImg = async () => {
    if (!imgUrl) return;
    await createSportsImage({ data: { url: imgUrl }, headers: defaultHeaders });
    setImgUrl("");
    reload();
  };

  const delImg = async (id: number) => {
    await deleteSportsImage({ data: { id }, headers: defaultHeaders });
    reload();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2 text-slate-950">Sports Complex Administration</h2>
      
      {/* SECTION 1: COORDINATOR MESSAGE */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">1. Coordinator / HOD Message</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Coordinator Name</label>
            <input placeholder="Coordinator Name" value={infoForm.name || ""} onChange={e => setInfoForm({...infoForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Coordinator Desk Message</label>
            <textarea placeholder="Message from Sports Coordinator..." rows={3} value={infoForm.message || ""} onChange={e => setInfoForm({...infoForm, message: e.target.value})} className="border p-2 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={saveInfo} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Save Info</button>
      </div>

      {/* SECTION 2: INFRASTRUCTURE */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">2. Play Fields & Outdoor Infrastructure</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Field Name</label>
            <input placeholder="e.g., Badminton Court" value={infraForm.name || ""} onChange={e => setInfraForm({...infraForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category / Specifications</label>
            <input placeholder="e.g., 4 Fields / Synthetic" value={infraForm.category || ""} onChange={e => setInfraForm({...infraForm, category: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={addInfra} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Infrastructure Field</button>
        <div className="divide-y border-t mt-3 pt-2">
          {data.infra?.map((i: any) => (
            <div key={i.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{i.name}</strong> - {i.category}</span>
              <button onClick={() => delInfra(i.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: SPORTS ACHIEVEMENTS */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">3. Sports Roster & Achievements</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tournament Achievement Details</label>
            <input placeholder="e.g., Winners in Intercollegiate Athletics Meet" value={achieveForm.title || ""} onChange={e => setAchieveForm({...achieveForm, title: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Year</label>
            <input placeholder="e.g., 2024-25" value={achieveForm.year || ""} onChange={e => setAchieveForm({...achieveForm, year: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={addAchieve} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Achievement</button>
        <div className="divide-y border-t mt-3 pt-2">
          {data.achievements?.map((ach: any) => (
            <div key={ach.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{ach.title}</strong> ({ach.year})</span>
              <button onClick={() => delAchieve(ach.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: SPORTS IMAGES */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">4. Sports Gallery & Carousels</h3>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sports Action Image URL</label>
          <input placeholder="Enter high-res image URL..." value={imgUrl} onChange={e => setImgUrl(e.target.value)} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500 mb-3"/>
          <button onClick={addImg} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Gallery Image</button>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4 max-h-[220px] overflow-y-auto border p-2 rounded">
          {data.images?.map((img: any) => (
            <div key={img.id} className="relative group border rounded overflow-hidden aspect-[16/10] bg-slate-50">
              <img src={img.url} className="w-full h-full object-cover" />
              <button onClick={() => delImg(img.id)} className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded text-[10px] font-bold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   📚 LIBRARY PANEL
========================================================================= */
function LibraryPanel({ data, reload }: any) {
  const [form, setForm] = useState<any>({
    officerName: data.info?.officerName || "",
    designation: data.info?.designation || "",
    message: data.info?.message || "",
    img: data.info?.img || "",
    about: data.about || "",
    digitalDescription: data.digital || "",
    workingDays: data.hours?.workingDays || "",
    workingTime: data.hours?.workingTime || "",
    transactionTime: data.hours?.transactionTime || "",
  });

  const [teamForm, setTeamForm] = useState<any>({});
  const [secForm, setSecForm] = useState<any>({});
  const [statForm, setStatForm] = useState<any>({});

  const save = async () => {
    await updateLibraryContent({ data: form, headers: defaultHeaders });
    alert("Central Library Details Updated successfully!");
    reload();
  };

  const addTeam = async () => {
    if (!teamForm.name || !teamForm.designation) return;
    await createLibTeam({ data: teamForm, headers: defaultHeaders });
    setTeamForm({});
    reload();
  };

  const delTeam = async (id: number) => {
    await deleteLibTeam({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addSection = async () => {
    if (!secForm.section || !secForm.area) return;
    await createLibSection({ data: secForm, headers: defaultHeaders });
    setSecForm({});
    reload();
  };

  const delSection = async (id: number) => {
    await deleteLibSection({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addStat = async () => {
    if (!statForm.category || !statForm.name) return;
    await createLibStat({ data: statForm, headers: defaultHeaders });
    setStatForm({});
    reload();
  };

  const delStat = async (id: number) => {
    await deleteLibStat({ data: { id }, headers: defaultHeaders });
    reload();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2 text-slate-950">Central Library Administration</h2>
      
      {/* SECTION 1: GENERAL STATS & MAIN DETAILS */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">1. Main Library Specifications</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Officer Name</label>
            <input value={form.officerName} onChange={e => setForm({...form, officerName: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation</label>
            <input value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Working Days</label>
            <input value={form.workingDays} onChange={e => setForm({...form, workingDays: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={save} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Save Info</button>
      </div>

      {/* SECTION 2: SECTIONS MANAGEMENT */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">2. Physical Sections (Reference, Reading, Stack)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Section Name</label>
            <input placeholder="e.g., Reading Room" value={secForm.section || ""} onChange={e => setSecForm({...secForm, section: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Area (Sq. Ft.)</label>
            <input placeholder="e.g., 2400" value={secForm.area || ""} onChange={e => setSecForm({...secForm, area: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={addSection} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Physical Section</button>
        <div className="divide-y border-t mt-3 pt-2">
          {data.sections?.map((s: any) => (
            <div key={s.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{s.section}</strong> - {s.area} Sq. Ft.</span>
              <button onClick={() => delSection(s.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: LIBRARY TEAM */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">3. Library Staff & Assistants</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
            <input placeholder="Name" value={teamForm.name || ""} onChange={e => setTeamForm({...teamForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Qualification</label>
            <input placeholder="Qualification" value={teamForm.qualification || ""} onChange={e => setTeamForm({...teamForm, qualification: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation</label>
            <input placeholder="Designation" value={teamForm.designation || ""} onChange={e => setTeamForm({...teamForm, designation: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={addTeam} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Staff Member</button>
        <div className="divide-y border-t mt-3 pt-2">
          {data.team?.map((t: any) => (
            <div key={t.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{t.name}</strong> ({t.qualification}) - {t.designation}</span>
              <button onClick={() => delTeam(t.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   💊 DISPENSARY PANEL
========================================================================= */
function DispensaryPanel({ data, reload }: any) {
  const [hodForm, setHodForm] = useState<any>({
    hodName: data.info?.hodName || "",
    message: data.info?.message || "",
    img: data.info?.img || "",
  });

  const [personForm, setPersonForm] = useState<any>({});
  const [metaForm, setMetaForm] = useState<any>({});
  const [imgUrl, setImgUrl] = useState("");

  const saveHOD = async () => {
    await updateDispContent({ data: hodForm, headers: defaultHeaders });
    alert("Dispensary HOD Details Updated Successfully!");
    reload();
  };

  const addPerson = async (role: string) => {
    if (!personForm.name) return;
    await createDispPerson({ data: { ...personForm, roleType: role }, headers: defaultHeaders });
    setPersonForm({});
    reload();
  };

  const delPerson = async (id: number) => {
    await deleteDispPerson({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addMeta = async (category: string) => {
    if (!metaForm.name) return;
    await createDispMeta({ data: { name: metaForm.name, category }, headers: defaultHeaders });
    setMetaForm({});
    reload();
  };

  const delMeta = async (id: number) => {
    await deleteDispMeta({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addImg = async () => {
    if (!imgUrl) return;
    await createDispImage({ data: { url: imgUrl }, headers: defaultHeaders });
    setImgUrl("");
    reload();
  };

  const delImg = async (id: number) => {
    await deleteDispImage({ data: { id }, headers: defaultHeaders });
    reload();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2 text-slate-950">University Dispensary Administration</h2>
      
      {/* SECTION 1: CHIEF MEDICAL OFFICER */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">1. Chief Medical Officer Desk</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CMO Name</label>
            <input value={hodForm.hodName} onChange={e => setHodForm({...hodForm, hodName: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message from Medical Desk</label>
            <textarea rows={3} value={hodForm.message} onChange={e => setHodForm({...hodForm, message: e.target.value})} className="border p-2 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={saveHOD} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Save Details</button>
      </div>

      {/* SECTION 2: HEALTH PROFESSIONALS */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">2. Medical Officers & Supporting Staff</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Medical Personnel Name</label>
            <input placeholder="Name" value={personForm.name || ""} onChange={e => setPersonForm({...personForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Number</label>
            <input placeholder="Contact" value={personForm.contact || ""} onChange={e => setPersonForm({...personForm, contact: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => addPerson("doctor")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Doctor</button>
          <button onClick={() => addPerson("staff")} className="bg-slate-600 hover:bg-slate-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Staff Member</button>
        </div>
        <div className="divide-y border-t mt-3 pt-2">
          {data.doctors?.map((p: any) => (
            <div key={p.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>Dr. {p.name}</strong> - {p.contact}</span>
              <button onClick={() => delPerson(p.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: MEDICINES */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">3. Essential Medicines Available</h3>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Medicine / Injection Name</label>
          <input placeholder="e.g., Paracetamol 650mg / Insulin" value={metaForm.name || ""} onChange={e => setMetaForm({...metaForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500 mb-3"/>
          <button onClick={() => addMeta("medicine")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Medicine</button>
        </div>
        <div className="divide-y border-t mt-3 pt-2">
          {data.medicines?.map((m: any) => (
            <div key={m.id} className="flex justify-between py-2 text-sm items-center">
              <span>{m.name}</span>
              <button onClick={() => delMeta(m.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ⚙️ ENGINEERING CELL PANEL
========================================================================= */
function EngineeringPanel({ data, reload }: any) {
  const [form, setForm] = useState<any>({
    title: data.content?.title || "",
    subtitle: data.content?.subtitle || "",
    description: data.content?.description || "",
  });

  const [staffForm, setStaffForm] = useState<any>({});
  const [metaForm, setMetaForm] = useState<any>({});

  const save = async () => {
    await updateEngineeringContent({ data: form, headers: defaultHeaders });
    alert("Engineering Cell Main Details Saved Successfully!");
    reload();
  };

  const addStaff = async (type: string) => {
    if (!staffForm.name) return;
    await createEngStaff({ data: { ...staffForm, type }, headers: defaultHeaders });
    setStaffForm({});
    reload();
  };

  const delStaff = async (id: number) => {
    await deleteEngStaff({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addMeta = async (category: string) => {
    if (!metaForm.content) return;
    await createEngMeta({ data: { ...metaForm, category }, headers: defaultHeaders });
    setMetaForm({});
    reload();
  };

  const delMeta = async (id: number) => {
    await deleteEngMeta({ data: { id }, headers: defaultHeaders });
    reload();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2 text-slate-950">Engineering Cell Administration</h2>
      
      {/* SECTION 1: DETAILS */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">1. Main Overview</h3>
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
        <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
        <button onClick={save} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Save Cell Details</button>
      </div>

      {/* SECTION 2: STAFF MEMBERS */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">2. Staff Members (Civil & Electrical)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Staff Member Name</label>
            <input placeholder="Name" value={staffForm.name || ""} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation</label>
            <input placeholder="e.g., Assistant Engineer" value={staffForm.designation || ""} onChange={e => setStaffForm({...staffForm, designation: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => addStaff("civil")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Civil Staff</button>
          <button onClick={() => addStaff("electrical")} className="bg-slate-600 hover:bg-slate-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Electrical Staff</button>
        </div>
        <div className="divide-y border-t mt-3 pt-2">
          {data.civilStaff?.map((s: any) => (
            <div key={s.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{s.name}</strong> - {s.designation} (<span className="text-emerald-600 font-bold uppercase text-[9px]">Civil</span>)</span>
              <button onClick={() => delStaff(s.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
          {data.electricalStaff?.map((s: any) => (
            <div key={s.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{s.name}</strong> - {s.designation} (<span className="text-amber-600 font-bold uppercase text-[9px]">Electrical</span>)</span>
              <button onClick={() => delStaff(s.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   🎸 MUSIC CLUB PANEL
========================================================================= */
function MusicPanel({ data, reload }: any) {
  const [form, setForm] = useState<any>(data.content || {});
  const [memberForm, setMemberForm] = useState<any>({});
  const [equipForm, setEquipForm] = useState<any>({});

  const save = async () => {
    await updateMusicContent({ data: form, headers: defaultHeaders });
    alert("Music Club Details Saved Successfully!");
    reload();
  };

  const addMember = async () => {
    if (!memberForm.name || !memberForm.instrument) return;
    await createMusicMember({ data: memberForm, headers: defaultHeaders });
    setMemberForm({});
    reload();
  };

  const delMember = async (id: number) => {
    await deleteMusicMember({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addEquip = async () => {
    if (!equipForm.name || !equipForm.count) return;
    await createMusicEquipment({ data: equipForm, headers: defaultHeaders });
    setEquipForm({});
    reload();
  };

  const delEquip = async (id: number) => {
    await deleteMusicEquipment({ data: { id }, headers: defaultHeaders });
    reload();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2 text-slate-950">Music Club Administration</h2>
      
      {/* SECTION 1: MESSAGE */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">1. Club Guidelines & Objectives</h3>
        <input placeholder="Club Title" value={form.title || ""} onChange={e => setForm({...form, title: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
        <textarea placeholder="Objectives & Scope" rows={3} value={form.objectives || ""} onChange={e => setForm({...form, objectives: e.target.value})} className="border p-2 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
        <button onClick={save} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Save Info</button>
      </div>

      {/* SECTION 2: CLUB ROSTER */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">2. Active Club Members & Singers</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Student / Vocalist Name</label>
            <input placeholder="Name" value={memberForm.name || ""} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Instrument / Vocals</label>
            <input placeholder="e.g., Acoustic Guitar / Lead Singer" value={memberForm.instrument || ""} onChange={e => setMemberForm({...memberForm, instrument: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={addMember} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Student Member</button>
        <div className="divide-y border-t mt-3 pt-2">
          {data.members?.map((m: any) => (
            <div key={m.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{m.name}</strong> - {m.instrument}</span>
              <button onClick={() => delMember(m.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: INSTRUMENTS */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">3. Club Roster Instruments & Inventory</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Instrument Name</label>
            <input placeholder="e.g., Roland Keyboard" value={equipForm.name || ""} onChange={e => setEquipForm({...equipForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
            <input type="number" placeholder="Count Available" value={equipForm.count || ""} onChange={e => setEquipForm({...equipForm, count: Number(e.target.value)})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={addEquip} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Add Instrument</button>
        <div className="divide-y border-t mt-3 pt-2">
          {data.instruments?.map((i: any) => (
            <div key={i.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{i.name}</strong> - {i.count} units available</span>
              <button onClick={() => delEquip(i.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   🎪 STUDENT ACTIVITY CLUBS PANEL
========================================================================= */
function StudentActivityPanel({ data, reload }: any) {
  const [clubForm, setClubForm] = useState<any>({});
  const [secForm, setSecForm] = useState<any>({ sectionType: "about" });
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [imgUrl, setImgUrl] = useState("");

  const saveClub = async () => {
    if (!clubForm.name || !clubForm.slug) return;
    await updateStudentClub({ data: clubForm, headers: defaultHeaders });
    setClubForm({});
    reload();
  };

  const delClub = async (id: number) => {
    if (confirm("Delete this club along with all sections?")) {
      await deleteStudentClub({ data: { id }, headers: defaultHeaders });
      reload();
    }
  };

  const addSection = async () => {
    if (!selectedClubId || !secForm.heading || !secForm.content) return;
    await createClubContent({ data: { ...secForm, clubId: selectedClubId }, headers: defaultHeaders });
    setSecForm({ sectionType: "about" });
    reload();
  };

  const delSection = async (id: number) => {
    await deleteClubContent({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const addImg = async () => {
    if (!selectedClubId || !imgUrl) return;
    await createClubImage({ data: { clubId: selectedClubId, url: imgUrl }, headers: defaultHeaders });
    setImgUrl("");
    reload();
  };

  const delImg = async (id: number) => {
    await deleteClubImage({ data: { id }, headers: defaultHeaders });
    reload();
  };

  const clubs = Array.isArray(data?.clubs) ? data.clubs : [];
  const selectedClub = clubs.find((c: any) => c.id === selectedClubId);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2 text-slate-950">Student Activity Clubs Administration</h2>
      
      {/* SECTION 1: MANAGE CLUBS */}
      <div className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5">1. Register / Edit Active Clubs</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Club Name</label>
            <input placeholder="e.g., Vykya Club" value={clubForm.name || ""} onChange={e => setClubForm({...clubForm, name: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Slug</label>
            <input placeholder="e.g., vykya-club" value={clubForm.slug || ""} onChange={e => setClubForm({...clubForm, slug: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
            <input placeholder="e.g., ECE Club" value={clubForm.category || ""} onChange={e => setClubForm({...clubForm, category: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Badge Title</label>
            <input placeholder="e.g., Communication" value={clubForm.badge || ""} onChange={e => setClubForm({...clubForm, badge: e.target.value})} className="border p-2.5 w-full text-sm rounded outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button onClick={saveClub} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded cursor-pointer">Register Club</button>
        <div className="divide-y border-t mt-3 pt-2">
          {clubs.map((c: any) => (
            <div key={c.id} className="flex justify-between py-2 text-sm items-center">
              <span><strong>{c.name}</strong> - {c.category} ({c.slug})</span>
              <div className="flex gap-2">
                <button onClick={() => setSelectedClubId(c.id)} className="text-blue-600 font-semibold hover:underline text-xs cursor-pointer">Manage Content</button>
                <button onClick={() => delClub(c.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs cursor-pointer">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: MANAGE SELECTED CLUB DETAILS */}
      {selectedClub && (
        <div className="bg-slate-100 border p-6 rounded-xl space-y-6 shadow-sm animate-[fade-in_0.3s_ease-out]">
          <h3 className="font-bold text-lg text-slate-900 border-b pb-1.5 flex items-center justify-between">
            <span>2. Content & Gallery for {selectedClub.name}</span>
            <button onClick={() => setSelectedClubId(null)} className="text-slate-500 hover:text-slate-800 text-xs font-bold">Close Details</button>
          </h3>

          {/* ADD SUBSECTION */}
          <div className="bg-white border p-4 rounded-lg space-y-3">
            <h4 className="font-bold text-sm text-slate-800">Add Text Subsection</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Heading</label>
                <input placeholder="e.g., Annual Youth Fest" value={secForm.heading || ""} onChange={e => setSecForm({...secForm, heading: e.target.value})} className="border p-2 w-full text-xs rounded outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Section Type</label>
                <input placeholder="e.g., about, events" value={secForm.sectionType || ""} onChange={e => setSecForm({...secForm, sectionType: e.target.value})} className="border p-2 w-full text-xs rounded outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Section Paragraph Content</label>
              <textarea placeholder="Describe this subsection in detail..." rows={3} value={secForm.content || ""} onChange={e => setSecForm({...secForm, content: e.target.value})} className="border p-2 w-full text-xs rounded outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <button onClick={addSection} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-semibold rounded cursor-pointer">Add Subsection</button>
            <div className="divide-y border-t mt-2">
              {selectedClub.sections?.map((sec: any) => (
                <div key={sec.id} className="flex justify-between py-2 text-xs items-center">
                  <span><strong>{sec.heading}</strong> ({sec.sectionType})</span>
                  <button onClick={() => delSection(sec.id)} className="text-red-500 hover:underline">Remove</button>
                </div>
              ))}
            </div>
          </div>

          {/* GALLERY CAROUSEL */}
          <div className="bg-white border p-4 rounded-lg space-y-3">
            <h4 className="font-bold text-sm text-slate-800">Gallery Image Slider</h4>
            <input placeholder="Enter high-res image URL..." value={imgUrl} onChange={e => setImgUrl(e.target.value)} className="border p-2 w-full text-xs rounded outline-none focus:ring-2 focus:ring-blue-500 mb-2"/>
            <button onClick={addImg} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-semibold rounded cursor-pointer">Add Slide Image</button>
            <div className="grid grid-cols-4 gap-2 mt-3 max-h-[120px] overflow-y-auto">
              {selectedClub.images?.map((img: any) => (
                <div key={img.id} className="relative border rounded overflow-hidden aspect-[16/10]">
                  <img src={img.url} className="w-full h-full object-cover" />
                  <button onClick={() => delImg(img.id)} className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[8px] font-bold p-0.5 rounded">Del</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
