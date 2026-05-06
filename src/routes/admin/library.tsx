import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getLibraryData } from "@/funcs/library.server";
import {
  updateLibraryContent,
  createSection, deleteSection,
  createStat, deleteStat,
  createMeta, deleteMeta,
  createTeam, deleteTeam,
  createImage, deleteImage
} from "@/funcs/library.admin.server";

export const Route = createFileRoute("/admin/library")({
  loader: async () => await getLibraryData(),
  component: AdminLibrary,
});

const headers = { "x-admin-key": "admin123" };

function AdminLibrary() {
  const data = Route.useLoaderData() as any;
  const [tab, setTab] = useState("content");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Library Admin</h1>

      <div className="flex gap-2 mb-6">
        {["content", "sections", "stats", "meta", "team", "images"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${tab === t ? "bg-blue-700 text-white" : "bg-gray-200"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "content" && <ContentAdmin data={data} />}
      {tab === "sections" && <SectionAdmin data={data.sections} />}
      {tab === "stats" && <StatsAdmin data={data} />}
      {tab === "meta" && <MetaAdmin data={data} />}
      {tab === "team" && <TeamAdmin data={data.team} />}
      {tab === "images" && <ImagesAdmin data={data.images} />}
    </div>
  );
}

/* ================= CONTENT ================= */
function ContentAdmin({ data }: any) {
  const router = useRouter();
  const [form, setForm] = useState({
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

  const save = async () => {
    await updateLibraryContent({ data: form, headers });
    await router.invalidate();
  };

  return (
    <div className="space-y-2">
      {Object.keys(form).map(k => (
        <input key={k} placeholder={k}
          value={(form as any)[k]}
          onChange={e => setForm({ ...form, [k]: e.target.value })}
          className="border p-2 w-full" />
      ))}
      <button onClick={save} className="bg-blue-700 text-white px-4 py-2">Save</button>
    </div>
  );
}

/* ================= SECTIONS ================= */
function SectionAdmin({ data }: any) {
  const router = useRouter();
  const [section, setSection] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");

  const add = async () => {
    await createSection({ data: { section, area, location }, headers });
    await router.invalidate();
  };

  return (
    <div>
      <input placeholder="Section" onChange={e => setSection(e.target.value)} />
      <input placeholder="Area" onChange={e => setArea(e.target.value)} />
      <input placeholder="Location" onChange={e => setLocation(e.target.value)} />
      <button onClick={add}>Add</button>

      {data.map((s: any) => (
        <div key={s.id}>
          {s.section}
          <button onClick={() => deleteSection({ data: { id: s.id }, headers })}>❌</button>
        </div>
      ))}
    </div>
  );
}

/* ================= STATS ================= */
function StatsAdmin({ data }: any) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [v1, setV1] = useState(0);
  const [v2, setV2] = useState(0);
  const [type, setType] = useState("titles");

  const add = async () => {
    await createStat({
      data: { category: type, name, value1: v1, value2: v2 },
      headers
    });
    await router.invalidate();
  };

  return (
    <div>
      <select onChange={e => setType(e.target.value)}>
        <option value="titles">Titles</option>
        <option value="periodicals">Periodicals</option>
      </select>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input type="number" onChange={e => setV1(Number(e.target.value))} />
      <input type="number" onChange={e => setV2(Number(e.target.value))} />
      <button onClick={add}>Add</button>
    </div>
  );
}

/* ================= META ================= */
function MetaAdmin({ data }: any) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("digital");

  const add = async () => {
    await createMeta({ data: { category: type, name }, headers });
    await router.invalidate();
  };

  return (
    <div>
      <select onChange={e => setType(e.target.value)}>
        <option value="digital">Digital</option>
        <option value="magazine">Magazine</option>
        <option value="newspaper">Newspaper</option>
      </select>
      <input onChange={e => setName(e.target.value)} />
      <button onClick={add}>Add</button>
    </div>
  );
}

/* ================= TEAM ================= */
function TeamAdmin({ data }: any) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [qualification, setQ] = useState("");
  const [designation, setD] = useState("");

  const add = async () => {
    await createTeam({ data: { name, qualification, designation }, headers });
    await router.invalidate();
  };

  return (
    <div>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Qualification" onChange={e => setQ(e.target.value)} />
      <input placeholder="Designation" onChange={e => setD(e.target.value)} />
      <button onClick={add}>Add</button>
    </div>
  );
}

/* ================= IMAGES ================= */
function ImagesAdmin({ data }: any) {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const add = async () => {
    await createImage({ data: { url }, headers });
    await router.invalidate();
  };

  return (
    <div>
      <input placeholder="Image URL" onChange={e => setUrl(e.target.value)} />
      <button onClick={add}>Add</button>

      {data.map((i: any) => (
        <img key={i.id} src={i.url} className="h-32" />
      ))}
    </div>
  );
}