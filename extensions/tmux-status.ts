import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * tmux-status — surface pi's lifecycle phase in the tmux status bar.
 *
 * Phases: active (magenta) / waiting (yellow) / finished (green) /
 *         compacting (blue) / error (red).
 *
 * Always sets the pane user option `@pi-state` so a custom status script can
 * read it (`#(tmux show-option -pv @pi-state)`). Also recolors the session's
 * status-left as an immediate visual, unless PI_TMUX_STATUS=0.
 */
const COLORS: Record<string, string> = {
  active: "colour201",
  waiting: "colour226",
  finished: "colour78",
  compacting: "colour75",
  error: "colour203",
};

export default function tmuxStatus(pi: ExtensionAPI) {
  if (!process.env.TMUX) return; // not inside tmux — no-op
  if (process.env.PI_TMUX_STATUS === "0") return;

  let phase = "finished";

  const apply = async (next: string) => {
    if (next === phase) return;
    phase = next;
    await pi.exec("tmux", ["set-option", "-p", "@pi-state", next]).catch(() => {});
    await pi
      .exec("tmux", ["set-option", "status-left-style", `fg=${COLORS[next]}`])
      .catch(() => {});
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
