import { existsSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { type ExtensionAPI, VERSION } from "@earendil-works/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
import { formatNumber } from "../helpers/format";

// Official logo geometry and colors: https://pi.dev/logo-auto.svg
const CORAL = "\x1b[38;2;240;144;130m"; // #F09082
const BLUE = "\x1b[38;2;77;154;191m"; // #4D9ABF
const YELLOW = "\x1b[38;2;241;190;88m"; // #F1BE58
const RESET = "\x1b[39m";

const LOGO_LINES = [
  `   ${CORAL}██████${RESET}`,
  `   ${BLUE}██  ${CORAL}██${RESET}`,
  `   ${BLUE}████  ${YELLOW}██${RESET}`,
  `   ${BLUE}██    ${YELLOW}██${RESET}`,
];

const TEXT_COLUMN = Math.max(...LOGO_LINES.map((line) => visibleWidth(line))) + 2;
const HEAD_PREFIX = "ref: refs/heads/";

function padToColumn(line: string, column: number): string {
  return line + " ".repeat(Math.max(column - visibleWidth(line), 0));
}

/** Read the current git branch by walking up from cwd. Handles worktrees. */
function readGitBranch(cwd: string): string | null {
  try {
    let dir = cwd;
    for (;;) {
      const candidate = join(dir, ".git");
      if (existsSync(candidate)) {
        const headPath = statSync(candidate).isFile()
          ? join(
              readFileSync(candidate, "utf8")
                .trim()
                .replace(/^gitdir:\s*/, ""),
              "HEAD",
            )
          : join(candidate, "HEAD");
        const head = readFileSync(headPath, "utf8").trim();
        return head.startsWith(HEAD_PREFIX) ? head.slice(HEAD_PREFIX.length) : "detached";
      }
      const parent = dirname(dir);
      if (parent === dir) return null;
      dir = parent;
    }
  } catch {
    return null;
  }
}

function shortCwd(cwd: string): string {
  const home = homedir();
  if (cwd === home) return "~";
  if (cwd.startsWith(`${home}/`)) return `~/${cwd.slice(home.length + 1)}`;
  return cwd;
}

export default function (pi: ExtensionAPI) {
  pi.on("session_start", (_event, ctx) => {
    if (ctx.mode !== "tui") return;

    ctx.ui.setHeader((_tui, theme) => ({
      render(width: number): string[] {
        const rule = theme.fg("accent", "─".repeat(width));

        const { model, thinkingLevel } = ctx;
        const modelLine = [
          model ? theme.fg("text", `${model.provider}/${model.id}`) : theme.fg("dim", "no-model"),
          thinkingLevel ? theme.fg("thinkingHigh", `${thinkingLevel}`) : "",
        ]
          .filter((part) => part.length > 0)
          .join(" · ");

        const usage = ctx.getContextUsage();
        const infoParts: string[] = [];
        const branch = readGitBranch(ctx.cwd);
        infoParts.push(theme.fg("mdHeading", `ctx ${formatNumber(usage?.contextWindow ?? 0)}`));
        infoParts.push(theme.fg("accent", shortCwd(ctx.cwd)));
        if (branch) infoParts.push(theme.fg("success", `${branch}`));
        const infoLine = infoParts.join(theme.fg("dim", " · "));

        const titleLine = [
          theme.fg("muted", "pi coding agent"),
          theme.fg("dim", `v${VERSION}`),
        ].join(theme.fg("dim", " · "));

        const rows: [string, string][] = [
          [LOGO_LINES[0] ?? "", ""],
          [LOGO_LINES[1] ?? "", titleLine],
          [LOGO_LINES[2] ?? "", modelLine],
          [LOGO_LINES[3] ?? "", infoLine],
        ];
        const body = rows.map(([logo, text]) =>
          text ? padToColumn(logo, TEXT_COLUMN + 2) + text : logo,
        );
        return [rule, "", ...body, "", rule].map((line) => truncateToWidth(line, width, ""));
      },
      invalidate() {},
    }));
  });

  pi.registerCommand("builtin-header", {
    handler: async (_args, ctx) => {
      ctx.ui.setHeader(undefined);
      ctx.ui.notify("Built-in header restored", "info");
    },
  });
}
