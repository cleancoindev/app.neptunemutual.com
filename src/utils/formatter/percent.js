import { getLocale } from "@/utils/locale";

export const formatPercent = (x) => {
  if (!x) {
    return "";
  }

  const percent = parseFloat(x) * 100;

  return new Intl.NumberFormat(getLocale(), {
    style: "percent",
    maximumFractionDigits: percent < 1 ? 6 : 2,
  }).format(x);
};
