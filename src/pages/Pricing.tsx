/**
 * Pricing Page
 *
 * Displays the Free vs Premium plan comparison with feature lists,
 * followed by a FAQ accordion. Pricing cards highlight the user's
 * current plan when they're logged in.
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, FileText, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/landing/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out ResumeIQ",
    features: [
      "3 AI resume analyses per month",
      "Basic resume builder",
      "All 10 resume templates",
      "PDF export",
      "Basic ATS score",
    ],
    limitations: [
      "Limited AI suggestions",
      "No job-specific optimization",
    ],
    cta: "Get Started Free",
    href: "/auth",
    popular: false,
    icon: Zap,
  },
  {
    name: "Premium",
    price: "$12",
    period: "per month",
    description: "For serious job seekers",
    features: [
      "Unlimited AI resume analyses",
      "Advanced resume builder",
      "All premium templates",
      "PDF & Word export",
      "Detailed ATS score breakdown",
      "Job description matching",
      "Keyword optimization",
      "AI-powered suggestions",
      "Resume version history",
      "Priority support",
    ],
    limitations: [],
    cta: "Upgrade to Premium",
    href: "/auth",
    popular: true,
    icon: Crown,
  },
];

const faqs = [
  { question: "Can I cancel anytime?", answer: "Yes! You can cancel your subscription at any time. Your premium features will remain active until the end of your billing period." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit cards, debit cards, and PayPal through our secure payment processor." },
  { question: "Do I need a credit card to start?", answer: "No! You can start with our free plan without entering any payment information." },
  { question: "What happens to my resumes if I downgrade?", answer: "Your resumes are always yours. If you downgrade, you'll still have access to view and download them, but advanced features will be limited." },
];

const Pricing = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <FileText className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-semibold">ResumeIQ</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Simple Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start for free, upgrade when you're ready. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 md:pb-24 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]" : ""}`}>
                {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Most Popular</Badge>}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <plan.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-2 text-muted-foreground">
                        <span className="h-5 w-5 flex items-center justify-center shrink-0">×</span>
                        <span className="text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {profile?.subscription_tier === "premium" && plan.name === "Premium" ? (
                    <Button className="w-full" disabled>Current Plan</Button>
                  ) : profile?.subscription_tier === "free" && plan.name === "Free" ? (
                    <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                  ) : (
                    <Link to={plan.href} className="w-full">
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section className="py-16 bg-muted/50 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
