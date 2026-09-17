import { type ExtensionAPI, VERSION } from "@earendil-works/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";

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

function padToColumn(line: string, column: number): string {
  return line + " ".repeat(Math.max(column - visibleWidth(line), 0));
}

export default function (pi: ExtensionAPI) {
  pi.on("session_start", (_event, ctx) => {
    if (ctx.mode !== "tui") return;

    ctx.ui.setHeader((_tui, theme) => ({
      render(width: number): string[] {
        const rule = theme.fg("accent", "─".repeat(width));
        const rows: [string, string][] = [
          [LOGO_LINES[0] ?? "", ""],
          [LOGO_LINES[1] ?? "", theme.fg("muted", "pi coding agent")],
          [LOGO_LINES[2] ?? "", theme.fg("dim", `v${VERSION}`)],
          [LOGO_LINES[3] ?? "", ""],
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
