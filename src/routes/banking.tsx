import { createFileRoute } from "@tanstack/react-router";
import atmpic from '@/assets/Atm-bank.jpeg';
export const Route = createFileRoute("/banking")({
  component: BankingPage,
});

function BankingPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-sm text-gray-800 animate-[fade-in_0.5s_ease-out]">
      <div className="border-b border-primary/20 pb-3">
        <h1 className="text-3xl font-bold text-primary tracking-tight">Bank</h1>
      </div>

      <p className="leading-relaxed text-justify text-base">
        Jawaharlal Nehru Technological University-Gurajada, Vizianagaram (JNTU-GV)
        provides comprehensive banking facilities directly on its campus to ensure a
        seamless experience for the university community.
      </p>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-blue-700 font-bold text-lg mb-2">Bank Branch</h3>
        <p className="leading-relaxed text-justify text-slate-600">
          A full-fledged branch of the <b>State Bank of India (SBI)</b> is located within
          the administrative zone, offering account services, deposits, withdrawals,
          cheque clearance, and support for fee payment.
        </p>
      </div>

      <div className="pt-4 flex justify-center">
        <img
          src={atmpic} // Fallback image
          alt="Bank Facility"
          className="w-full max-w-lg object-cover rounded-xl shadow-md border border-slate-100"
        />
      </div>
    </section>
  );
}


