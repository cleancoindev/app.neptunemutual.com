import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import { StakingCard } from "@/components/UI/organisms/pools/staking/StakingCard";
import { useAppConstants } from "@/src/context/AppConstants";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import { useTokenStakingPools } from "@/src/hooks/useTokenStakingPools";

export const StakingPage = () => {
  const { getTVLById, getPriceByAddress } = useAppConstants();
  const { data, loading } = useTokenStakingPools();

  const { searchValue, setSearchValue, filtered } = useSearchResults({
    list: data.pools,
    filter: (item, term) => {
      return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
    },
  });

  const searchHandler = (ev) => {
    setSearchValue(ev.target.value);
  };

  return (
    <Container className={"pt-16 pb-36"}>
      <div className="flex justify-end">
        <SearchAndSortBar
          searchValue={searchValue}
          onSearchChange={searchHandler}
          sortClass="w-full md:w-48 lg:w-64 rounded-lg z-10"
          containerClass="flex-col md:flex-row min-w-full md:min-w-sm"
          searchClass="w-full md:w-64 rounded-lg"
        />
      </div>
      {loading && <div className="py-10 text-center">Loading...</div>}
      {!loading && data.pools.length === 0 && (
        <div className="flex flex-col items-center w-full pt-20">
          <img
            src="/images/covers/empty-list-illustration.svg"
            alt="no data found"
            className="w-48 h-48"
          />
          <p className="max-w-full mt-8 text-center text-h5 text-404040 w-96">
            No <span className="whitespace-nowrap">staking pools found.</span>
          </p>
        </div>
      )}
      <Grid className="mb-24 mt-14">
        {filtered.map((poolData) => {
          return (
            <StakingCard
              key={poolData.id}
              data={poolData}
              tvl={getTVLById(poolData.id)}
              getPriceByAddress={getPriceByAddress}
            />
          );
        })}
      </Grid>
      <NeutralButton className={"rounded-lg"}>Show More</NeutralButton>
    </Container>
  );
};
