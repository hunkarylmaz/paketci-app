import React from 'react';

interface Step {
  id: string;
  title: string;
  icon: string;
}

interface StepperHeaderProps {
  steps: Step[];
  currentStep: number;
}

export function StepperHeader({ steps, currentStep }: StepperHeaderProps) {
  return (
    <div className="flex items-center justify-center px-6 py-6 bg-gray-50">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isActive ? 'bg-purple-600 text-white shadow-lg scale-110' : ''}
                  ${isPending ? 'bg-gray-200 text-gray-400' : ''}
                `}
              >
                {isCompleted ? '✓' : step.icon}
              </div>

              {/* Title */}
              <span
                className={`
                  text-xs mt-2 text-center whitespace-nowrap
                  ${isActive ? 'text-purple-600 font-medium' : 'text-gray-500'}
                `}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  w-12 h-0.5 mx-2 transition-all duration-300
                  ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
