import type { RunComparison } from "./runComparisonAgent";
import { hasAnyChange } from "./runComparisonAgent";

export interface RunDiffNotification {
  earlierRunUrl: string;
  laterRunUrl: string;
  comparison: RunComparison;
}

function buildMessage(n: RunDiffNotification): { text: string } {
  if (!hasAnyChange(n.comparison)) {
    return {
      text: `✅ No change between the last 2 runs — same result as before.\n${n.laterRunUrl}`,
    };
  }

  const lines: string[] = [`⚠️ *Run comparison* — ${n.earlierRunUrl} → ${n.laterRunUrl}`, ""];

  if (n.comparison.newlyFailing.length > 0) {
    lines.push(`🔴 *Newly failing* (regression): ${n.comparison.newlyFailing.join(", ")}`);
  }
  if (n.comparison.newlyFixed.length > 0) {
    lines.push(`🟢 *Newly fixed*: ${n.comparison.newlyFixed.join(", ")}`);
  }
  if (n.comparison.newTests.length > 0) {
    lines.push(`🆕 *New jobs*: ${n.comparison.newTests.join(", ")}`);
  }

  return { text: lines.join("\n") };
}

// Same control surface as notifyMergeReady: no webhookUrl → print only.
export async function notifyRunDiff(
  notification: RunDiffNotification,
  webhookUrl?: string,
): Promise<void> {
  const message = buildMessage(notification);

  if (!webhookUrl) {
    console.log("No webhook configured — here's what WOULD be sent to n8n/Slack:");
    console.log(message.text);
    return;
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
}
