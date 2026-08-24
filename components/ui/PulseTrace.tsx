interface PulseTraceProps {
  className?: string;
  animated?: boolean;
}

const WAVEFORM_D =
  "M0,32 L52,32 L66,32 L77,8 L90,56 L101,26 L114,32 L152,32 L164,32 L173,17 L182,44 L191,32 L320,32";

/**
 * The recurring "vitals" motif: an EKG-style trace. Used as a quiet
 * header accent (static) and inside LoadingDiagnosis (animated, where a
 * bright segment continuously travels the line — like a monitor that is
 * actively reading something).
 *
 * `pathLength="100"` normalizes the path to 100 units regardless of its
 * real geometry, which makes the dash math below easy to reason about.
 */
export function PulseTrace({ className, animated = false }: PulseTraceProps) {
  return (
    <svg
      viewBox="0 0 320 64"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d={WAVEFORM_D}
        stroke="currentColor"
        strokeOpacity={animated ? 0.22 : 0.35}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
      />
      {animated && (
        <path
          d={WAVEFORM_D}
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray="14 100"
          className="animate-pulse-trace"
        />
      )}
    </svg>
  );
}
