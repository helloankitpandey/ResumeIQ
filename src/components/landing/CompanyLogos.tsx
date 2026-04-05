const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Adobe",
  "Salesforce"
];

const CompanyLogos = () => {
  return (
    <section className="py-12 px-4 border-b border-border/30">
      <div className="container mx-auto max-w-5xl">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Our users have been hired at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          {companies.map((company) => (
            <div
              key={company}
              className="text-lg md:text-xl font-display font-semibold text-muted-foreground/40 hover:text-primary/60 transition-colors"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;
