import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
import { formatNumber } from "../helpers/format.ts";

export default function (pi: ExtensionAPI) {
  pi.on("session_start", (_event, ctx) => {
    if (ctx.mode !== "tui") {
      return;
    }

    ctx.ui.setFooter((tui, theme, footerData) => ({
      dispose: footerData.onBranchChange(() => tui.requestRender()),
      invalidate: () => {},
      render: (width) => {
        let input = 0;
        let output = 0;
        let cost = 0;

        for (const entry of ctx.sessionManager.getBranch()) {
          if (entry.type === "message" && entry.message.role === "assistant") {
            const { usage } = entry.message;
            input += usage.input;
            output += usage.output;
            cost += usage.cost.total;
          }
        }

        const contextUsage = ctx.getContextUsage();
        const contextPercent = contextUsage?.percent || 0;
        const context = `${contextPercent.toFixed(2)}%/${formatNumber(contextUsage?.contextWindow ?? 0)}`;
        const usageLine = [
          theme.fg("customMessageText", `↑${formatNumber(input)} ↓${formatNumber(output)}`),
          theme.fg(contextPercent >= 90 ? "error" : "mdHeading", context),
          theme.fg("accent", `EST. $${cost.toFixed(2)}`),
        ].join(" ");

        const branch = footerData.getGitBranch();
        const cwdParts = [theme.fg("text", ctx.cwd)];
        if (branch) {
          cwdParts.push(theme.fg("success", `(${branch})`));
        }
        const cwdLine = cwdParts.join(" ");

        const { model, thinkingLevel } = ctx;
        const modelParts = [];
        if (model) {
          modelParts.push(theme.fg("accent", `${model.provider}/${model?.id || "no-model"}`));
        }
        if (thinkingLevel) {
          modelParts.push(theme.fg("thinkingHigh", `(${thinkingLevel})`));
        }
        const modelLine = modelParts.join(" ");

        const parentSession = ctx.sessionManager.getHeader()?.parentSession;
        const parentSessionLine = parentSession ? theme.fg("text", parentSession) : "";
        const rows = [
          [usageLine, modelLine],
          [cwdLine, parentSessionLine],
        ];

        return rows.map(([left, right]) => {
          const padding = " ".repeat(Math.max(1, width - visibleWidth(left) - visibleWidth(right)));
          return truncateToWidth(left + padding + right, width);
        });
      },
    }));
  });

  pi.registerCommand("builtin-footer", {
    handler: async (_args, ctx) => {
      ctx.ui.setFooter(undefined);
      ctx.ui.notify("Built-in footer restored", "info");
    },
  });
}
