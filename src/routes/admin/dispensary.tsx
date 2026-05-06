import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getDispensaryData } from "@/funcs/dispensary.server";
import {
  updateContent,
  createPerson,
  deletePerson,
  createMeta,
  deleteMeta,
  createImage,
  deleteImage
} from "@/funcs/dispensary.admin.server";

export const Route = createFileRoute("/admin/dispensary")({
  loader: async () => await getDispensaryData(),
  component: AdminDispensary,
});

const defaultHeaders = { "x-admin-key": "admin123" };

function AdminDispensary() {
  const data = Route.useLoaderData() as any;
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Info & HOD" },
    { id: "doctors", label: "Doctors" },
    { id: "facilities", label: "Facilities" },
    { id: "medicines", label: "Medicines" },
    { id: "staff", label: "Staff" },
    { id: "drivers", label: "Drivers" },
    { id: "images", label: "Images" }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Dispensary Admin</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded ${
              activeTab === tab.id ? "bg-blue-700 text-white" : "bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "info" && <InfoAdmin data={data.info} />}
      {activeTab === "doctors" && <PeopleAdmin role="doctor" data={data.doctors} />}
      {activeTab === "staff" && <PeopleAdmin role="staff" data={data.staff} />}
      {activeTab === "drivers" && <PeopleAdmin role="driver" data={data.drivers} />}
      {activeTab === "facilities" && <MetaAdmin type="facility" data={data.facilities} />}
      {activeTab === "medicines" && <MetaAdmin type="medicine" data={data.medicines} />}
      {activeTab === "images" && <ImagesAdmin data={data.images} />}
    </div>
  );
}

/* ================= INFO ================= */

function InfoAdmin({ data }: any) {
  const router = useRouter();
  const [hodName, setHodName] = useState(data?.hodName || "");
  const [message, setMessage] = useState(data?.message || "");
  const [img, setImg] = useState(data?.img || "");

  const handleUpdate = async () => {
    await updateContent({ data: { hodName, message, img }, headers: defaultHeaders });
    await router.invalidate();
    alert("Updated");
  };

  return (
    <div className="space-y-3">
      <input value={hodName} onChange={e => setHodName(e.target.value)} placeholder="HOD Name" className="border p-2 w-full"/>
      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" className="border p-2 w-full"/>
      <input value={img} onChange={e => setImg(e.target.value)} placeholder="Image URL" className="border p-2 w-full"/>
      <button onClick={handleUpdate} className="bg-blue-700 text-white px-4 py-2">Update</button>
    </div>
  );
}

/* ================= PEOPLE ================= */

function PeopleAdmin({ role, data }: any) {
  const router = useRouter();
  const [form, setForm] = useState<any>({});

  const handleAdd = async () => {
    await createPerson({
      data: { ...form, roleType: role },
      headers: defaultHeaders
    });
    setForm({});
    await router.invalidate();
  };

  const handleDelete = async (id: number) => {
    await deletePerson({ data: { id }, headers: defaultHeaders });
    await router.invalidate();
  };

  return (
    <div>
      <div className="mb-4 space-y-2">
        <input placeholder="Name" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 w-full"/>
        {role !== "driver" && (
          <input placeholder="Qualification" value={form.qualification || ""} onChange={e => setForm({...form, qualification: e.target.value})} className="border p-2 w-full"/>
        )}
        {role === "doctor" && (
          <input placeholder="Working Hours" value={form.workingHours || ""} onChange={e => setForm({...form, workingHours: e.target.value})} className="border p-2 w-full"/>
        )}
        <input placeholder="Contact" value={form.contact || ""} onChange={e => setForm({...form, contact: e.target.value})} className="border p-2 w-full"/>
        {role !== "driver" && (
          <input placeholder="Image URL" value={form.img || ""} onChange={e => setForm({...form, img: e.target.value})} className="border p-2 w-full"/>
        )}
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2">Add</button>
      </div>

      <table className="w-full border">
        <tbody>
          {data.map((p: any) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.contact}</td>
              <td>
                <button onClick={() => handleDelete(p.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= META ================= */

function MetaAdmin({ type, data }: any) {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleAdd = async () => {
    await createMeta({
      data: { category: type, name },
      headers: defaultHeaders
    });
    setName("");
    await router.invalidate();
  };

  const handleDelete = async (id: number) => {
    await deleteMeta({ data: { id }, headers: defaultHeaders });
    await router.invalidate();
  };

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border p-2"/>
      <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 ml-2">Add</button>

      <ul className="mt-4">
        {data.map((m: any) => (
          <li key={m.id} className="flex justify-between">
            {m.name}
            <button onClick={() => handleDelete(m.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================= IMAGES ================= */

function ImagesAdmin({ data }: any) {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const handleAdd = async () => {
    await createImage({ data: { url }, headers: defaultHeaders });
    setUrl("");
    await router.invalidate();
  };

  const handleDelete = async (id: number) => {
    await deleteImage({ data: { id }, headers: defaultHeaders });
    await router.invalidate();
  };

  return (
    <div>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Image URL" className="border p-2"/>
      <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 ml-2">Add</button>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {data.map((img: any) => (
          <div key={img.id}>
            <img src={img.url} className="h-32 w-full object-cover"/>
            <button onClick={() => handleDelete(img.id)} className="text-red-500">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}