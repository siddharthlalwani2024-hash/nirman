import { Check, X } from "lucide-react";
import { Reveal } from "./Reveal";

const ROWS = [
  { label: "Genuine Kajaria stock, verified SKUs", us: true, them: false },
  { label: "Real showroom demo photos before you buy", us: true, them: false },
  { label: "WhatsApp support with instant tile details", us: true, them: false },
  { label: "Guesswork on finish, size & batch match", us: false, them: true },
  { label: "Warranty backed by an authorized dealer", us: true, them: false },
];

export function ComparisonBlock() {
  return (
    <section className="bg-white py-16 sm:py-24" data-testid="comparison-block">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="text-gold text-sm font-bold tracking-widest uppercase mb-2">The difference</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-10">Why buy from an authorized dealer</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="bg-ivory rounded-md border border-stone overflow-hidden shadow-soft">
            <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_140px_140px] text-xs sm:text-sm font-semibold uppercase tracking-wide text-ink/60 border-b border-stone px-4 sm:px-6 py-3">
              <span></span>
              <span className="text-center">Nirman Udyog</span>
              <span className="text-center">Typical shop</span>
            </div>
            {ROWS.map((row, i) => (
              <div
                key={row.label}
                data-testid={`comparison-row-${i}`}
                className={`grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_140px_140px] items-center px-4 sm:px-6 py-4 text-sm text-ink ${
                  i !== ROWS.length - 1 ? "border-b border-stone/60" : ""
                }`}
              >
                <span className="pr-4">{row.label}</span>
                <span className="flex justify-center">
                  {row.us ? <Check size={18} className="text-gold" /> : <X size={18} className="text-ink/30" />}
                </span>
                <span className="flex justify-center">
                  {row.them ? <Check size={18} className="text-ink/40" /> : <X size={18} className="text-ink/30" />}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
