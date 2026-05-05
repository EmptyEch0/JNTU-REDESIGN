import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BANKING_SUBNAV } from "@/lib/site";

export const Route = createFileRoute("/banking")({
  component: BankingPage,
});

function BankingPage() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isOverview = path === "/banking";

  return (
    <>
      <div className="border-b border-border bg-background">
        <div className="container-narrow">
          <div className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
            {BANKING_SUBNAV.map((item) => {
              const active = path === item.to || path.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-white shadow-lg"
                      : "text-foreground bg-accent hover:bg-accent/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {isOverview ? (
        <section className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-sm text-gray-800">
          <p className="leading-relaxed text-justify">
            Jawaharlal Nehru Technological University-Gurajada, Vizianagaram (JNTU-GV)
            provides comprehensive banking facilities directly on its campus to ensure a
            seamless experience for the university community.
          </p>

          <div>
            <h3 className="text-blue-700 font-semibold mb-2">Bank Branch</h3>
            <p className="leading-relaxed text-justify">
              A full-fledged branch of the <b>State Bank of India (SBI)</b> is located within
              the administrative zone, offering account services, deposits, withdrawals,
              cheque clearance, and support for fee payment.
            </p>
          </div>

          <div>
            <h3 className="text-blue-700 font-semibold mb-2">ATM Facility</h3>
            <p className="leading-relaxed text-justify">
              An on-campus ATM is available 24/7 to support students, staff, and guests with
              secure cash withdrawals and immediate access to funds.
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <img
              src={bankImg}
              alt="Bank Facility"
              className="w-full max-w-lg object-cover rounded-xl shadow"
            />
          </div>
        </section>
      ) : (
        <Outlet />
      )}
    </>
  );
}

