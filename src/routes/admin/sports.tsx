import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getSportsData } from "@/funcs/sports.server";
import {
  updateSportsContent,
  createPerson, deletePerson,
  createInfra, deleteInfra,
  createAchievement, deleteAchievement,
  createImage, deleteImage,
} from "@/funcs/sports.admin.server";

export const Route = createFileRoute("/admin/sports")({
  loader: async () => await getSportsData(),
  component: AdminSports,
});

const headers = { "x-admin-key": "admin123" };

function AdminSports() {
  const data = Route.useLoaderData() as any;
  const router = useRouter();
  const [tab, setTab] = useState("Info");

  const reload = async () => {
    await router.invalidate();
  };

  const TABS = ["Info", "Faculty", "Non-Teaching", "Achievements", "Fields", "Gym", "Images"];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sports Admin</h1>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${tab===t?"bg-blue-600 text-white":"bg-gray-200"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Info" && <InfoSection data={data.info} reload={reload} />}
      {tab === "Faculty" && <PeopleSection role="faculty" data={data.faculty} reload={reload} />}
      {tab === "Non-Teaching" && <PeopleSection role="non_teaching" data={data.nonTeaching} reload={reload} />}
      {tab === "Achievements" && <AchievementsSection data={data.achievements} reload={reload} />}
      {tab === "Fields" && <InfraSection type="field" data={data.fields} reload={reload} />}
      {tab === "Gym" && <InfraSection type="gym" data={data.gym} reload={reload} />}
      {tab === "Images" && <ImageSection data={data.images} reload={reload} />}
    </div>
  );
}

/* ================= INFO ================= */
function InfoSection({ data, reload }: any) {
  const [form, setForm] = useState<any>(data || {});

  const save = async () => {
    await updateSportsContent({ data: form, headers });
    reload();
  };

  return (
    <div className="space-y-2">
      {["name","designation","message","img","qualification","phone","extn","email","address"].map(f => (
        <input key={f}
          placeholder={f}
          value={form[f] || ""}
          onChange={e=>setForm({...form,[f]:e.target.value})}
          className="border p-2 w-full"/>
      ))}
      <button onClick={save} className="bg-blue-600 text-white px-4 py-2">Save</button>
    </div>
  );
}

/* ================= PEOPLE ================= */
function PeopleSection({ role, data, reload }: any) {
  const [form,setForm]=useState<any>({});

  const add = async () => {
    await createPerson({
      data: { ...form, roleType: role },
      headers
    });
    reload();
  };

  const del = async (id:number) => {
    await deletePerson({ data:{id}, headers });
    reload();
  };

  return (
    <div>
      {data.map((p:any)=>(
        <div key={p.id} className="flex justify-between border p-2">
          {p.name} - {p.designation}
          <button onClick={()=>del(p.id)}>X</button>
        </div>
      ))}

      <input placeholder="name" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="designation" onChange={e=>setForm({...form,designation:e.target.value})}/>
      <button onClick={add}>Add</button>
    </div>
  );
}

/* ================= INFRA ================= */
function InfraSection({ type, data, reload }: any) {
  const [form,setForm]=useState<any>({});

  const add = async () => {
    await createInfra({
      data: { ...form, category: type },
      headers
    });
    reload();
  };

  const del = async (id:number) => {
    await deleteInfra({ data:{id}, headers });
    reload();
  };

  return (
    <div>
      {data.map((i:any)=>(
        <div key={i.id} className="flex justify-between border p-2">
          {i.name} ({i.qty})
          <button onClick={()=>del(i.id)}>X</button>
        </div>
      ))}

      <input placeholder="name" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="qty" onChange={e=>setForm({...form,qty:e.target.value})}/>
      {type==="gym" && (
        <input placeholder="cost" onChange={e=>setForm({...form,cost:e.target.value})}/>
      )}
      <button onClick={add}>Add</button>
    </div>
  );
}

/* ================= ACHIEVEMENTS ================= */
function AchievementsSection({ data, reload }: any) {
  const [form,setForm]=useState<any>({});

  const add = async () => {
    await createAchievement({ data: form, headers });
    reload();
  };

  const del = async (id:number) => {
    await deleteAchievement({ data:{id}, headers });
    reload();
  };

  return (
    <div>
      {data.map((a:any)=>(
        <div key={a.id} className="border p-2">
          {a.student} - {a.game}
          <button onClick={()=>del(a.id)}>X</button>
        </div>
      ))}

      {["student","branch","game","tournament","venue"].map(f=>(
        <input key={f} placeholder={f}
          onChange={e=>setForm({...form,[f]:e.target.value})}/>
      ))}
      <button onClick={add}>Add</button>
    </div>
  );
}

/* ================= IMAGES ================= */
function ImageSection({ data, reload }: any) {
  const [url,setUrl]=useState("");

  const add = async () => {
    await createImage({ data:{url}, headers });
    reload();
  };

  const del = async (id:number) => {
    await deleteImage({ data:{id}, headers });
    reload();
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {data.map((i:any)=>(
          <div key={i.id}>
            <img src={i.url} className="h-32"/>
            <button onClick={()=>del(i.id)}>Delete</button>
          </div>
        ))}
      </div>

      <input placeholder="url" value={url} onChange={e=>setUrl(e.target.value)}/>
      <button onClick={add}>Add</button>
    </div>
  );
}