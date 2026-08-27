import { ShieldCheck } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export function TrustStrip() {
  const settings = useSettings();
  if (!settings) return null;

  const locationTail = settings.address ? settings.address.split(",").slice(-2).join(",").trim() : "";
  const stats = [
    settings.skus_stocked ? { value: `${settings.skus_stocked}+`, label: "SKUs stocked" } : null,
    settings.projects_completed ? { value: `${settings.projects_completed}+`, label: "Projects completed" } : null,
    settings.warranty_years ? { value: `${settings.warranty_years} yrs`, label: "Warranty on select ranges" } : null,
  ].filter(Boolean);

  return (
    <section className="bg-kajaria text-white" data-testid="trust-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-8 flex flex-wrap items-center justify-between gap-6 sm:gap-8">
        <div className="flex items-center gap-3">
          <ShieldCheck size={22} className="text-[#F4C542] shrink-0" />
          <p className="text-sm sm:text-base leading-snug">
            <span className="font-serif text-lg sm:text-xl block sm:inline">Authorized Kajaria Dealer</span>
            {settings.years_in_business ? ` — ${settings.years_in_business} years` : ""}
            {locationTail ? `, ${locationTail}` : ""}
          </p>
        </div>
        {stats.length > 0 && (
          <div className="flex gap-6 sm:gap-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-xl sm:text-2xl">{s.value}</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
