import type { MergeReadinessResult } from "./mergeReadinessAgent";

// Purpose — tells a human the PR's real status. NEVER merges anything itself.
// The final "merge" click always stays a manual, human decision.

export interface MergeReadyNotification {
  prUrl: string;
  prTitle: string;
  result: MergeReadinessResult;
}

function buildMessage(n: MergeReadyNotification): { text: string } {
  const icon = n.result.ready ? "✅" : "❌";
  const verdict = n.result.ready
    ? "Ready for a human to review and merge."
    : "NOT ready — see reasons below.";

  return {
    text: [
      `${icon} *${n.prTitle}*`,
      n.prUrl,
      "",
      ...n.result.reasons.map((r) => `• ${r}`),
      "",
      verdict,
    ].join("\n"),
  };
}

// webhookUrl comes from the CONTROL SURFACE — no real n8n target yet, so this
// currently just prints what would be sent. Pass a real URL once n8n exists.
export async function notifyMergeReady(
  notification: MergeReadyNotification,
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
