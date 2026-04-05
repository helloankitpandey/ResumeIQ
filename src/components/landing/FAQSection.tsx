import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Is ResumeIQ really free to use?",
    answer: "Yes! You can create and download professional resumes completely free. We offer premium features for power users who want access to all templates and unlimited AI generations."
  },
  {
    question: "Are these templates ATS-friendly?",
    answer: "Absolutely! All our templates are designed to pass Applicant Tracking Systems (ATS) used by Google, Microsoft, Amazon, and other top companies. We use clean formatting, standard fonts, and proper section headers."
  },
  {
    question: "Which template works best for tech companies?",
    answer: "Our Google and Microsoft-style templates are specifically designed to match what recruiters at these companies expect. They focus on clean formatting, quantifiable achievements, and technical skills."
  },
  {
    question: "Can I use these as a fresher or student?",
    answer: "Yes! Our templates are perfect for students and freshers. They help you present your projects, internships, and education effectively even without extensive work experience."
  },
  {
    question: "How does the AI content generation work?",
    answer: "Our AI analyzes your role and responsibilities to generate professional bullet points with quantified achievements. It suggests impactful action verbs that resonate with recruiters."
  },
  {
    question: "Can I export my resume to PDF?",
    answer: "Yes! You can export your resume as a high-quality PDF that's ready to submit. The PDF maintains all formatting and is optimized for both digital applications and printing."
  }
];

const FAQSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: accordionRef, isVisible: accordionVisible } = useScrollReveal({ rootMargin: "0px 0px -40px 0px" });

  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-primary/[0.02]" />
      <div className="container mx-auto max-w-3xl relative z-10">
        <div
          ref={headerRef}
          className={cn(
            "text-center mb-12 transition-all duration-700 ease-out",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know
          </p>
        </div>

        <div
          ref={accordionRef}
          className={cn(
            "transition-all duration-700 ease-out",
            accordionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30 transition-all"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5 text-sm md:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
