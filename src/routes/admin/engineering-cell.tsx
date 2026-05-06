import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getEngineeringData } from "@/funcs/engineer.server";
import {
  updateEngineeringContent,
  updateElectricalInfo,
  createMetaPoint,
  deleteMetaPoint,
  createStaffMember,
  deleteStaffMember,
} from "@/funcs/engineer.admin.server";

export const Route = createFileRoute("/admin/engineering-cell")({
  loader: async () => await getEngineeringData(),
  component: AdminEngineeringCell,
});

const headers = { "x-admin-key": "admin123" };

function AdminEngineeringCell() {
  const data = Route.useLoaderData() as any;
  const router = useRouter();
  const [tab, setTab] = useState("Overview & Vision");

  const reload = async () => {
    await router.invalidate();
  };

  const TABS = [
    "Overview & Vision",
    "Construction Activities",
    "PE (Elec) Section Info",
    "Civil Staff",
    "Electrical Staff",
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Engineering Cell Admin
        </h1>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          Live Database Connection
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === t
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {tab === "Overview & Vision" && (
          <OverviewSection content={data.content} reload={reload} />
        )}
        {tab === "Construction Activities" && (
          <ConstructionSection
            points={data.constructionPoints}
            reload={reload}
          />
        )}
        {tab === "PE (Elec) Section Info" && (
          <ElectricalInfoSection
            electrical={data.electrical}
            reload={reload}
          />
        )}
        {tab === "Civil Staff" && (
          <StaffAdminSection
            type="civil"
            staff={data.civilStaff}
            reload={reload}
          />
        )}
        {tab === "Electrical Staff" && (
          <StaffAdminSection
            type="electrical"
            staff={data.electricalStaff}
            reload={reload}
          />
        )}
      </div>
    </div>
  );
}

/* ================= OVERVIEW & VISION SECTION ================= */
function OverviewSection({ content, reload }: any) {
  const [form, setForm] = useState({
    id: content?.id || null,
    title: content?.title || "Engineering Cell",
    description: content?.description || "",
    vision: content?.vision || "",
    mission: content?.mission || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateEngineeringContent({ data: form, headers });
      await reload();
      alert("Overview, Vision & Mission updated successfully!");
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">
        Edit Page Title, Overview, Vision & Mission
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Page Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Overview / Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 h-28 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Vision Statement
          </label>
          <textarea
            value={form.vision}
            onChange={(e) => setForm({ ...form, vision: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 h-24 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mission Statement
          </label>
          <textarea
            value={form.mission}
            onChange={(e) => setForm({ ...form, mission: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 h-24 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50"
      >
        {saving ? "Saving Changes..." : "Save Content Settings"}
      </button>
    </form>
  );
}

/* ================= CONSTRUCTION ACTIVITIES SECTION ================= */
function ConstructionSection({ points, reload }: any) {
  const [newPoint, setNewPoint] = useState("");
  const [adding, setAdding] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoint.trim()) return;
    setAdding(true);
    try {
      await createMetaPoint({
        data: { category: "construction", content: newPoint },
        headers,
      });
      setNewPoint("");
      await reload();
    } catch (err: any) {
      alert("Failed to add activity: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this construction activity?"))
      return;
    try {
      await deleteMetaPoint({ data: { id }, headers });
      await reload();
    } catch (err: any) {
      alert("Failed to delete activity: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Manage Construction Activities
      </h3>

      {/* List */}
      <div className="space-y-3">
        {!points.length ? (
          <p className="text-slate-500 italic">
            No construction activities listed.
          </p>
        ) : (
          points.map((p: any) => (
            <div
              key={p.id}
              className="flex justify-between items-start border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition"
            >
              <div className="text-sm text-slate-700 leading-relaxed max-w-[85%]">
                ✦ {p.content}
              </div>
              <button
                onClick={() => remove(p.id)}
                className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg text-xs font-semibold transition"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add form */}
      <form onSubmit={add} className="border-t pt-6 space-y-3">
        <h4 className="text-sm font-semibold text-slate-800">
          Add New Construction Activity
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Construction of Academic Block-III (G+2) at an estimated cost of Rs. 17.99 crores."
            value={newPoint}
            onChange={(e) => setNewPoint(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-slate-900 text-white px-5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= PE (ELEC) SECTION INFO ================= */
function ElectricalInfoSection({ electrical, reload }: any) {
  const [form, setForm] = useState({
    id: electrical?.id || null,
    title: electrical?.title || "PE (Elec) Section",
    name: electrical?.name || "PE (Elec) Section",
    description: electrical?.description || "",
    engineer: electrical?.engineer || "Dr.V.S.Vakula",
    img: electrical?.img || "/fallback.jpg",
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateElectricalInfo({ data: form, headers });
      await reload();
      alert("Electrical Section info updated successfully!");
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900">
        Edit Electrical Section & Project Engineer Info
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Section Title / Header
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Project Engineer Name
          </label>
          <input
            type="text"
            value={form.engineer}
            onChange={(e) => setForm({ ...form, engineer: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Project Engineer Image / Fallback Path
          </label>
          <input
            type="text"
            value={form.img}
            onChange={(e) => setForm({ ...form, img: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Section Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 h-24 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50"
      >
        {saving ? "Saving Changes..." : "Save Electrical Settings"}
      </button>
    </form>
  );
}

/* ================= CIVIL & ELECTRICAL STAFF SECTION ================= */
function StaffAdminSection({ type, staff, reload }: any) {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    img: "",
  });
  const [adding, setAdding] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.designation.trim()) return;
    setAdding(true);
    try {
      await createStaffMember({
        data: { ...form, type, img: form.img || null },
        headers,
      });
      setForm({ name: "", designation: "", img: "" });
      await reload();
    } catch (err: any) {
      alert("Failed to add staff member: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await deleteStaffMember({ data: { id }, headers });
      await reload();
    } catch (err: any) {
      alert("Failed to delete staff member: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900">
        Manage {type === "civil" ? "Civil Staff" : "Electrical Staff"}
      </h3>

      {/* Staff table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-slate-100">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-3 text-sm font-semibold text-slate-600">Name</th>
              <th className="p-3 text-sm font-semibold text-slate-600">
                Designation
              </th>
              <th className="p-3 text-sm font-semibold text-slate-600">
                Profile Image
              </th>
              <th className="p-3 text-sm font-semibold text-slate-600 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!staff.length ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500 italic">
                  No staff members added yet.
                </td>
              </tr>
            ) : (
              staff.map((s: any) => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                  <td className="p-3 text-sm font-medium text-slate-900">
                    {s.name}
                  </td>
                  <td className="p-3 text-sm text-slate-600">
                    {s.designation}
                  </td>
                  <td className="p-3 text-sm text-slate-500 font-mono">
                    {s.img || "None"}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => remove(s.id)}
                      className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff form */}
      <form onSubmit={add} className="border-t pt-6 space-y-4">
        <h4 className="text-sm font-semibold text-slate-800">
          Add New {type === "civil" ? "Civil Staff" : "Electrical Staff"} Member
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Name (e.g. Dr. A. Padmaja)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Designation (e.g. Project Engineer)"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            className="border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Image Path (optional, e.g. /images/padmaja.jpg)"
            value={form.img}
            onChange={(e) => setForm({ ...form, img: e.target.value })}
            className="border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50"
        >
          {adding ? "Adding Member..." : "Add Staff Member"}
        </button>
      </form>
    </div>
  );
}
