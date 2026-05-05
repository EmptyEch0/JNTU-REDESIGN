import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/banking/bank")({
  component: BankBranchPage,
});

function BankBranchPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-sm text-gray-800">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Branch Services</h2>
          <p className="leading-relaxed text-justify">
            The on-campus SBI branch handles savings and current account operations, fee collections, fund transfers, cheque deposits, and other banking transactions for students, faculty, and staff.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">Services Available</h3>
          <ul className="mt-3 list-disc list-inside space-y-2 text-muted-foreground">
            <li>Account opening and maintenance</li>
            <li>Deposit and withdrawal services</li>
            <li>College fee and hostel fee payments</li>
            <li>Cheque clearance and demand draft assistance</li>
            <li>Personal banking support for employees and students</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">Location</h3>
          <p className="leading-relaxed text-justify">
            The bank branch is located near the administrative block, providing convenient access for the campus community during working hours.
          </p>
        </div>
      </section>
    </div>
  );
}
