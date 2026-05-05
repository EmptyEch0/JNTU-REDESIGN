import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/other-amenities/staff-quarters")({
  component: StaffQuartersPage,
});

function StaffQuartersPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-sm text-gray-800">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Staff Housing</h2>
          <p className="leading-relaxed text-justify">
            The campus offers dedicated residential quarters for faculty and support staff, ensuring that team members can stay near academic and administrative facilities.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">Facilities Included</h3>
          <ul className="mt-3 list-disc list-inside space-y-2 text-muted-foreground">
            <li>Well-appointed living spaces</li>
            <li>Access to water, power, and Wi-Fi</li>
            <li>Close proximity to campus amenities</li>
            <li>Safe, guarded residential environment</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">Purpose</h3>
          <p className="leading-relaxed text-justify">
            These quarters are designed to support teaching staff, administrative personnel, and other long-term campus employees with convenient on-campus living.
          </p>
        </div>
      </section>
    </div>
  );
}
