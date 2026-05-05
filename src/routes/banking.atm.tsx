import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/banking/atm")({
  component: AtmPage,
});

function AtmPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-sm text-gray-800">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Always Available</h2>
          <p className="leading-relaxed text-justify">
            The campus ATM provides secure cash withdrawal and balance inquiry services round-the-clock for students, employees, and guests.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">ATM Features</h3>
          <ul className="mt-3 list-disc list-inside space-y-2 text-muted-foreground">
            <li>24/7 access</li>
            <li>Secure PIN-protected transactions</li>
            <li>Cash withdrawals and balance checks</li>
            <li>Convenient placement near the banking section</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">User Guidance</h3>
          <p className="leading-relaxed text-justify">
            Please follow standard ATM safety practices and report any issues to the campus security or bank staff immediately.
          </p>
        </div>
      </section>
    </div>
  );
}
