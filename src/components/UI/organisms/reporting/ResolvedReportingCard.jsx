import { Divider } from "@/components/UI/atoms/divider";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { CardStatusBadge } from "@/components/CardStatusBadge";

export const ResolvedReportingCard = ({ coverKey, status, resolvedOn }) => {
  const { coverInfo } = useCoverInfo(coverKey);
  const imgSrc = getCoverImgSrc({ key: coverKey });

  return (
    <OutlinedCard className="p-6 bg-white" type="link">
      <div className="flex justify-between">
        <div>
          <div className="rounded-full w-18 h-18 bg-DEEAF6">
            <img
              src={imgSrc}
              alt={coverInfo.projectName}
              className="inline-block max-w-full"
            />
          </div>
          <h4 className="mt-4 font-semibold uppercase text-h4 font-sora">
            {coverInfo.projectName}
          </h4>
        </div>
        <div>
          <CardStatusBadge status={status} />
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between px-1 mb-4 text-sm">
        <span className="" title={DateLib.toLongDateFormat(resolvedOn)}>
          Resolved On:{" "}
          <span title={DateLib.toLongDateFormat(resolvedOn)}>
            {fromNow(resolvedOn)}
          </span>
        </span>
      </div>
    </OutlinedCard>
  );
};
