import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Reveal } from "./Reveal";

const FAQS = [
  {
    q: "Are all tiles genuine Kajaria stock?",
    a: "Yes. We are an authorized Kajaria dealer and every SKU shown here is verified against Kajaria's official catalogue before it goes on our floor.",
  },
  {
    q: "Can I see the tile in a finished room before deciding?",
    a: "Most tiles link to real demo photos from our showroom or past projects, so you can see the exact finish, grout line and lighting before you visit.",
  },
  {
    q: "How do I get pricing?",
    a: "We don't list prices online since rates depend on batch, quantity and offers running that week. Tap \"Chat on WhatsApp\" on any tile and we'll reply with current pricing in minutes.",
  },
  {
    q: "Do you offer warranty on tiles?",
    a: "Yes, select ranges come with a manufacturer warranty. Ask us on WhatsApp with the SKU and we'll confirm exact warranty terms for that tile.",
  },
  {
    q: "Can I visit the showroom to see tiles in person?",
    a: "Absolutely — our exhibition centre is open all week. Message us on WhatsApp or call ahead so we can have the ranges you're interested in laid out for you.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-canvas py-16 sm:py-24" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="text-clay text-sm font-bold tracking-widest uppercase mb-2">Good to know</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-8">Frequently asked questions</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <Accordion type="single" collapsible data-testid="faq-accordion">
            {FAQS.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`} className="border-grout" data-testid={`faq-item-${i}`}>
                <AccordionTrigger className="font-serif text-base sm:text-lg text-ink hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-ink/60 leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
