import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountUp({ target, suffix = "", duration = 1200 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="stat-number">
      {value}
      {suffix}
    </span>
  );
}

export function StatCounters({ settings }) {
  const stats = [
    settings?.skus_stocked ? { value: Number(settings.skus_stocked), suffix: "+", label: "SKUs stocked" } : null,
    settings?.projects_completed ? { value: Number(settings.projects_completed), suffix: "+", label: "Projects completed" } : null,
    settings?.years_in_business ? { value: Number(settings.years_in_business), suffix: "", label: "Years in business" } : null,
    settings?.warranty_years ? { value: Number(settings.warranty_years), suffix: "yr", label: "Warranty on select ranges" } : null,
  ].filter(Boolean);

  if (stats.length === 0) return null;

  return (
    <section className="bg-navy py-16 sm:py-20" data-testid="stat-counters-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: i * 0.06 }}
              className="text-center sm:text-left border-t border-white/10 pt-5 sm:pt-6"
              data-testid={`stat-counter-${i}`}
            >
              <p className="text-3xl sm:text-5xl text-gold leading-none">
                <CountUp target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs sm:text-sm text-ivory/60 mt-2 tracking-wide uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
