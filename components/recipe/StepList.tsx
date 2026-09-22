interface Step {
  id: string;
  stepNumber: number;
  instruction: string;
  durationSec?: number;
}

interface StepListProps {
  steps: Step[];
}

export default function StepList({ steps }: StepListProps) {
  if (!steps || steps.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">Aucune étape</p>
    );
  }

  return (
    <ol className="space-y-4">
      {steps
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map((step) => (
          <li key={step.id} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {step.stepNumber}
            </span>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{step.instruction}</p>
              {step.durationSec && (
                <p className="mt-1 text-xs text-gray-400">
                  ~{Math.round(step.durationSec / 60)} min
                </p>
              )}
            </div>
          </li>
        ))}
    </ol>
  );
}