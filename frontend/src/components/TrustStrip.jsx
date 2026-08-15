import { ShieldCheck } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export function TrustStrip() {
  const settings = useSettings();
  if (!settings) return null;
  return (
    <section className="bg-white/50 border-y border-greige" data-testid="trust-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="font-serif text-3xl text-charcoal">{settings.years_in_business}+</span>
          <span className="text-sm text-taupe max-w-[14rem]">Years supplying tiles to homes across Cooch Behar</span>
        </div>
        {settings.kajaria_dealer_badge && (
          <div data-testid="trust-strip-kajaria-badge" className="inline-flex items-center gap-2 bg-[#15508B] text-white rounded-md px-4 py-2.5">
            <ShieldCheck size={16} />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">AUTHORIZED KAJARIA DEALER</span>
          </div>
        )}
      </div>
    </section>
  );
}
