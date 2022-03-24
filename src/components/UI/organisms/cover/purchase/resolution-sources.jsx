import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { explainInterval } from "@/utils/formatter/interval";
import Link from "next/link";
import { useReportingPeriod } from "@/src/hooks/useReportingPeriod";

export const CoverPurchaseResolutionSources = ({ children, coverInfo }) => {
  const coverKey = coverInfo.key;
  const projectName = coverInfo.projectName;
  const { reportingPeriod } = useReportingPeriod({ coverKey });

  if (!coverInfo.resolutionSources) {
    return null;
  }

  const knowledgebase = coverInfo?.resolutionSources[1];
  const twitter = coverInfo?.resolutionSources[0];

  return (
    <div className="col-span-3 row-start-2 md:col-auto md:row-start-auto">
      <OutlinedCard className="flex flex-col flex-wrap justify-between p-10 bg-DEEAF6">
        <div className="flex flex-wrap justify-between md:block">
          <div>
            <h3 className="font-semibold text-h4 font-sora">
              Resolution Sources
            </h3>
            <p className="mt-1 mb-6 text-sm opacity-50">
              {explainInterval(reportingPeriod)} reporting period
            </p>
          </div>
          <div className="flex flex-col md:block sm:items-end">
            <Link href={knowledgebase}>
              <a
                target="_blank"
                className="block capitalize text-4e7dd9 hover:underline sm:mt-0 md:mt-3"
              >
                {projectName} Knowledgebase
              </a>
            </Link>
            <Link href={twitter}>
              <a
                target="_blank"
                className="block mt-3 capitalize text-4e7dd9 hover:underline sm:mt-0 md:mt-3"
              >
                {projectName} Twitter
              </a>
            </Link>
          </div>
        </div>

        {children}
      </OutlinedCard>
    </div>
  );
};
