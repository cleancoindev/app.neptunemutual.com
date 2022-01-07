import { Alert } from "@/components/UI/atoms/alert";
import { Checkbox } from "@/components/UI/atoms/checkbox";
import { Container } from "@/components/UI/atoms/container";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import { RecentVotesTable } from "@/components/UI/organisms/reporting/RecentVotesTable";
import { ReportSummary } from "@/components/UI/organisms/reporting/ReportSummary";
import Head from "next/head";

export default function Components() {
  return (
    <main>
      <Head>
        <title>Neptune Mutual</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="px-8 py-6">
        <div className="max-w-md">
          <InputWithTrailingButton
            buttonProps={{
              children: "Max",
              onClick: () => {},
            }}
            unit="NPM-USDC-LP"
            inputProps={{
              id: "test-input-id",
              placeholder: "Enter Amount",
            }}
          />
        </div>

        <br />

        <ReportSummary />

        <br />

        <form>
          <Checkbox id="checkid" name="checkinputname">
            I have read, understood, and agree to the terms of cover rules
          </Checkbox>
          <br />
          <button type="submit">submit</button>
        </form>

        <br />
        <br />
        <br />

        <Alert>
          <p>
            If you just came to know about a recent incident of Uniswap
            Exchange, carefully read the cover rules above. You can earn 20% of
            the minority fees if you are the first person to report this
            incident.
          </p>
        </Alert>

        <br />

        <RecentVotesTable />

        <br />
      </Container>
    </main>
  );
}
