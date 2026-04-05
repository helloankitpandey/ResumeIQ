import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-start md:justify-center w-full gap-1 md:gap-0">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <button
            onClick={() => onStepClick?.(index)}
            disabled={!onStepClick}
            className={cn(
              "flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-full transition-all text-xs md:text-sm",
              currentStep === index
                ? "bg-primary text-primary-foreground"
                : currentStep > index
                ? "bg-success/20 text-success"
                : "bg-muted text-muted-foreground",
              onStepClick && "cursor-pointer hover:opacity-80"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full text-xs font-medium",
                currentStep === index
                  ? "bg-primary-foreground/20"
                  : currentStep > index
                  ? "bg-success/30"
                  : "bg-muted-foreground/20"
              )}
            >
              {currentStep > index ? (
                <Check className="h-3 w-3 md:h-4 md:w-4" />
              ) : (
                index + 1
              )}
            </span>
            <span className="hidden sm:inline font-medium">{step}</span>
          </button>
          
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-2 md:w-8 lg:w-16 h-0.5 mx-0.5 md:mx-2 hidden md:block",
                currentStep > index ? "bg-success" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
