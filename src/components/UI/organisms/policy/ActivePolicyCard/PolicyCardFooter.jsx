import { getParsedKey } from "@/src/helpers/cover";

import { useValidReport } from "@/src/hooks/useValidReport";
import { convertFromUnits, isGreater } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { getToolTipDate, unixToDate } from "@/utils/date";
import dayjs from "dayjs";
import Link from "next/link";

export const PolicyCardFooter = ({ policyInfo }) => {
  const { totalAmountToCover, cover, cxToken } = policyInfo;

  const validityStartsAt = cxToken.creationDate || "0";
  const validityEndsAt = cxToken.expiryDate || "0";

  const coverKey = cover.id;
  const {
    data: { report },
  } = useValidReport({
    start: validityStartsAt,
    end: validityEndsAt,
    coverKey,
  });

  const now = dayjs().unix();

  const hasValidReport = !!report;
  let isClaimable = false;

  if (hasValidReport) {
    isClaimable = report.status;
  }

  const stats = [];

  if (isClaimable) {
    const claimBegun = isGreater(now, report.claimBeginsFrom);

    if (claimBegun) {
      stats.push({
        title: "Claim Before",
        tooltipText: getToolTipDate(report.claimExpiresAt),
        value: unixToDate(report.claimExpiresAt, "YYYY/MM/DD HH:mm") + " UTC",
        variant: "error",
      });
    } else {
      stats.push({
        title: "Resolution By",
        tooltipText: getToolTipDate(report.claimBeginsFrom),
        value: unixToDate(report.claimBeginsFrom, "YYYY/MM/DD HH:mm") + " UTC",
      });
    }
  } else {
    const isExpired = isGreater(now, validityEndsAt);

    if (isExpired) {
      stats.push({
        title: "Expired On",
        tooltipText: getToolTipDate(validityEndsAt),
        value: unixToDate(validityEndsAt, "YYYY/MM/DD HH:mm") + " UTC",
      });
    } else {
      stats.push({
        title: "Expires In",
        tooltipText: getToolTipDate(validityEndsAt),
        value: unixToDate(validityEndsAt, "YYYY/MM/DD HH:mm") + " UTC",
      });
    }
  }

  return (
    <>
      {/* Stats */}
      <div className="flex justify-between flex-wrap text-sm px-1">
        {stats.map((stat, idx) => {
          return (
            <Stat
              key={stat.title}
              title={stat.title}
              toolTipTitle={stat.tooltipText}
              value={stat.value}
              variant={stat.variant}
              right={idx % 2 == 1}
            />
          );
        })}

        <Stat
          title="Purchased Policy"
          value={`$ ${convertFromUnits(totalAmountToCover).toString()}`}
          right
        />
      </div>

      {/* Link */}
      {isClaimable && (
        <Link href={`/my-policies/${getParsedKey(coverKey)}/claim`}>
          <a className="flex justify-center py-2.5 w-full bg-4e7dd9 text-white text-sm font-semibold uppercase rounded-lg mt-2 mb-4">
            CLAIM
          </a>
        </Link>
      )}
    </>
  );
};

const Stat = ({ title, toolTipTitle, value, right, variant }) => {
  return (
    <div
      className={classNames("flex flex-col basis-1/2", right && "items-end")}
    >
      <h5 className="font-semibold text-black text-sm mb-2">{title}</h5>
      <p
        title={toolTipTitle}
        className={classNames(
          "mb-4",
          variant === "error" ? "text-FA5C2F" : "text-7398C0"
        )}
      >
        {value}
      </p>
    </div>
  );
};
