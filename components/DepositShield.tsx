"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import type { RenovationPlan, ProjectInput } from "@/lib/types";

interface Props {
  plan: RenovationPlan;
  input: ProjectInput;
  projectId: string;
}

interface PaymentRow {
  label: string;
  trigger: string;
  pct: number;
}

const DEFAULT_ROWS: PaymentRow[] = [
  { label: "Mobilisation", trigger: "Acceptance of quote and site handover", pct: 30 },
  { label: "Milestone", trigger: "Completion of structural and wet works", pct: 40 },
  { label: "Completion", trigger: "Final sign-off and snag list cleared", pct: 30 },
];

export default function DepositShield({ plan, input }: Props) {
  const [contractorName, setContractorName] = useState("");
  const [contractorTrade, setContractorTrade] = useState("");
  const [contractorContact, setContractorContact] = useState("");
  const [totalAmount, setTotalAmount] = useState(plan.cost_high);
  const [rows, setRows] = useState<PaymentRow[]>(() =>
    DEFAULT_ROWS.map((r, i) => ({
      ...r,
      trigger: plan.work_items[i]
        ? `Completion of: ${plan.work_items[i].category}`
        : r.trigger,
    }))
  );

  function updatePct(index: number, newPct: number) {
    const clamped = Math.max(0, Math.min(100, newPct));
    const others = rows.reduce((sum, r, i) => (i !== index ? sum + r.pct : sum), 0);
    if (others + clamped > 100) return;
    setRows(prev => prev.map((r, i) => i === index ? { ...r, pct: clamped } : r));
  }

  function updateTrigger(index: number, trigger: string) {
    setRows(prev => prev.map((r, i) => i === index ? { ...r, trigger } : r));
  }

  const totalPct = rows.reduce((s, r) => s + r.pct, 0);
  const pctValid = totalPct === 100;

  return (
    <div className="payment-schedule-print">
      {/* Print header (visible on print only) */}
      <div className="hidden print:block print:mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Payment Schedule</h1>
        <p className="mt-1 text-sm text-charcoal-light">
          {input.name} — {input.location}
        </p>
      </div>

      {/* Contractor details */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal-light">
            Contractor name
          </label>
          <input
            type="text"
            value={contractorName}
            onChange={e => setContractorName(e.target.value)}
            placeholder="e.g. John Smith Builders"
            className="w-full rounded-xl border border-canvas-dark bg-canvas px-3 py-2 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-petrol-dark focus:outline-none print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:bg-transparent print:rounded-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal-light">
            Trade / speciality
          </label>
          <input
            type="text"
            value={contractorTrade}
            onChange={e => setContractorTrade(e.target.value)}
            placeholder="e.g. General builder"
            className="w-full rounded-xl border border-canvas-dark bg-canvas px-3 py-2 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-petrol-dark focus:outline-none print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:bg-transparent print:rounded-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal-light">
            Contact / registration
          </label>
          <input
            type="text"
            value={contractorContact}
            onChange={e => setContractorContact(e.target.value)}
            placeholder="Phone or NHBRC number"
            className="w-full rounded-xl border border-canvas-dark bg-canvas px-3 py-2 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-petrol-dark focus:outline-none print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:bg-transparent print:rounded-none"
          />
        </div>
      </div>

      {/* Total amount */}
      <div className="mb-5 flex items-end gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal-light">
            Total agreed amount (R)
          </label>
          <input
            type="number"
            value={totalAmount}
            onChange={e => setTotalAmount(Number(e.target.value))}
            className="w-44 rounded-xl border border-canvas-dark bg-canvas px-3 py-2 text-sm font-semibold text-charcoal focus:border-petrol-dark focus:outline-none print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:bg-transparent print:rounded-none"
          />
          <p className="mt-1 text-xs text-charcoal-light/60">Pre-filled from plan estimate</p>
        </div>
        {!pctValid && (
          <p className="mb-2 text-xs font-semibold text-clay">
            Percentages must total 100% (currently {totalPct}%)
          </p>
        )}
      </div>

      {/* Payment rows */}
      <div className="overflow-x-auto rounded-2xl border border-canvas-dark">
        <table className="w-full min-w-[500px] text-sm">
          <thead>
            <tr className="border-b border-canvas-dark bg-canvas">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-charcoal-light">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-charcoal-light">Milestone trigger</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-charcoal-light">%</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-charcoal-light">Amount (R)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-canvas-dark last:border-0">
                <td className="px-4 py-3 font-semibold text-charcoal">{row.label}</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={row.trigger}
                    onChange={e => updateTrigger(i, e.target.value)}
                    className="w-full bg-transparent text-charcoal-light focus:outline-none focus:text-charcoal print:text-charcoal"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={row.pct}
                    onChange={e => updatePct(i, Number(e.target.value))}
                    className="w-14 rounded-lg border border-canvas-dark bg-canvas px-2 py-1 text-right text-sm font-semibold text-charcoal focus:border-petrol-dark focus:outline-none print:border-none print:bg-transparent"
                  />
                  <span className="ml-1 text-charcoal-light">%</span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-petrol-dark">
                  R{Math.round(totalAmount * row.pct / 100).toLocaleString("en-ZA")}
                </td>
              </tr>
            ))}
            <tr className="bg-canvas">
              <td colSpan={2} className="px-4 py-3 text-sm font-bold text-charcoal">Total</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-charcoal">{totalPct}%</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-petrol-dark">
                R{totalAmount.toLocaleString("en-ZA")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signatures (print) */}
      <div className="mt-6 hidden grid-cols-2 gap-12 print:grid">
        <div>
          <div className="mt-8 border-b border-charcoal pb-1" />
          <p className="mt-1 text-xs text-charcoal-light">Homeowner signature &amp; date</p>
        </div>
        <div>
          <div className="mt-8 border-b border-charcoal pb-1" />
          <p className="mt-1 text-xs text-charcoal-light">Contractor signature &amp; date</p>
        </div>
      </div>

      {/* Legal disclaimer */}
      <p className="mt-5 rounded-2xl border border-canvas-dark bg-canvas px-4 py-3 text-xs leading-5 text-charcoal-light">
        <strong>Disclaimer:</strong> This payment schedule is for planning purposes only and does not constitute a legally binding contract or financial advice. Amounts are estimates. Consult a legal professional before signing any building or renovation agreement.
      </p>

      {/* Print button */}
      <button
        onClick={() => window.print()}
        className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-charcoal/10 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-canvas print:hidden"
      >
        <Printer className="h-4 w-4" />
        Print payment schedule
      </button>

      {/* Print styles */}
      <style>{`
        @media print {
          header, footer, nav, .print\\:hidden { display: none !important; }
          .payment-schedule-print {
            display: block !important;
            break-inside: avoid;
            padding: 32px;
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
