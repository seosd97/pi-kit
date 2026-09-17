import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
import { formatNumber } from "./helpers/format.ts";

export default function (pi: ExtensionAPI) {
  pi.on("session_start", (_event, ctx) => {
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
        const context = `${contextUsage?.percent?.toFixed(2) ?? 0}%/${formatNumber(contextUsage?.contextWindow ?? 0)}`;
        const usageLine = [
          theme.fg("thinkingHigh", `↑${formatNumber(input)} ↓${formatNumber(output)}`),
          theme.fg("mdHeading", context),
          theme.fg("success", `EST. $${cost.toFixed(2)}`),
        ].join(" ");

        const branch = footerData.getGitBranch();
        const cwdParts = [theme.fg("thinkingMedium", ctx.cwd)];
        if (branch) {
          cwdParts.push(theme.fg("success", `(${branch})`));
        }

        const { model, thinkingLevel } = ctx;
        const modelParts = [];
        if (model) {
          modelParts.push(theme.fg("success", `[${model.provider}]`));
        }
        modelParts.push(theme.fg("thinkingMedium", model?.id || "no-model"));
        if (thinkingLevel) {
          modelParts.push(theme.fg("thinkingMax", `(${thinkingLevel})`));
        }

        const parentSession = ctx.sessionManager.getHeader()?.parentSession;
        const parentSessionLine = parentSession ? theme.fg("text", parentSession) : "";
        const rows = [
          [usageLine, modelParts.join(" ")],
          [cwdParts.join(" "), parentSessionLine],
        ];

        return rows.map(([left, right]) => {
          const padding = " ".repeat(Math.max(1, width - visibleWidth(left) - visibleWidth(right)));
          return truncateToWidth(left + padding + right, width);
        });
      },
    }));
  });
}
