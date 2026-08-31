import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const COLORS = {
  active: "colour201",
  waiting: "colour226",
  finished: "colour78",
  compacting: "colour75",
  error: "colour203",
} as const satisfies Record<string, string>;

export default function tmuxStatus(pi: ExtensionAPI) {
  if (!process.env.TMUX || process.env.PI_TMUX_STATUS === "0") return;

  let phase = "finished";

  const run = async (args: string[]) => {
    try {
      await pi.exec("tmux", args);
    } catch {
      return;
    }
  };

  const apply = async (next: string) => {
    if (next === phase) return;
    phase = next;
    const color = COLORS[next as keyof typeof COLORS];
    await run(["set-option", "-p", "@pi-state", next]);
    await run(["set-option", "status-left-style", `fg=${color}`]);
  };

  pi.on("agent_start", async () => apply("active"));
  pi.on("agent_settled", async () => apply("finished"));
  pi.on("ui_prompt_start", async () => apply("waiting"));
  pi.on("ui_prompt_end", async () => apply("active"));
  pi.on("tool_execution_start", async (event) => {
    if (event.toolName === "bash" || event.toolName === "powershell") apply("waiting");
  });
  pi.on("tool_execution_end", async (event) => {
    if (event.toolName === "bash" || event.toolName === "powershell") {
      apply(event.isError ? "error" : "active");
    }
  });
  pi.on("session_before_compact", async () => apply("compacting"));
  pi.on("session_compact", async () => apply("active"));
  pi.on("session_compact_failed", async () => apply("error"));
}
