import { TokenAmountSpan } from "@/components/TokenAmountSpan";

export const TokenAmountWithPrefix = ({ amountInUnits, symbol, prefix }) => {
  return (
    <p>
      {prefix} <TokenAmountSpan amountInUnits={amountInUnits} symbol={symbol} />
    </p>
  );
};
