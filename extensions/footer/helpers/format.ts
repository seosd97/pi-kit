const NUMBER_SUFFIXES = ["k", "M", "B"];

export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  let value = num / 1000;
  let suffixIndex = 0;
  while (value >= 1000 && suffixIndex < NUMBER_SUFFIXES.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  return `${value.toFixed(1)}${NUMBER_SUFFIXES[suffixIndex]}`;
}
