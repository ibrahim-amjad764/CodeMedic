import { CircleCheck, TriangleAlert, CircleHelp, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { ConfidenceLevel } from "@/types/diagnosis";

const CONFIG: Record<
  ConfidenceLevel,
  { label: string; tone: "success" | "warning" | "danger"; Icon: LucideIcon }
> = {
  high: { label: "High confidence", tone: "success", Icon: CircleCheck },
  medium: { label: "Medium confidence", tone: "warning", Icon: TriangleAlert },
  low: { label: "Low confidence", tone: "danger", Icon: CircleHelp },
};

/**
 * Confidence is always shown with an icon AND a text label AND a color —
 * never color alone (see accessibility notes in README).
 */
export function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
  const { label, tone, Icon } = CONFIG[confidence];
  return (
    <Badge tone={tone} icon={<Icon className="h-3.5 w-3.5" aria-hidden="true" />}>
      {label}
    </Badge>
  );
}
