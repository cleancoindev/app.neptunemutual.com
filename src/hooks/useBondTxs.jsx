import { ROWS_PER_PAGE } from "@/src/config/constants";
import { getGraphURL } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";

const getQuery = (account, limit, skip) => {
  return `
  {
    _meta {
      block {
        number
      }
    }
    bondTransactions(
      skip: ${skip}
      first: ${limit}, 
      orderBy: 
      createdAtTimestamp, 
      orderDirection: desc, 
      where: {
        account: "${account}"
      }
    ) {
      type
      account
      npmToVestAmount
      claimAmount
      lpTokenAmount
      transaction {
        id
        timestamp
      }
    }
    bondPools {
      address0
    }
  }
  `;
};

export const useBondTxs = () => {
  const [data, setData] = useState({
    blockNumber: null,
    bondTransactions: [],
  });
  const [itemsToSkip, setItemsToSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  useEffect(() => {
    setItemsToSkip(0);
    setData({
      blockNumber: null,
      bondTransactions: [],
    });
  }, [account]);

  useEffect(() => {
    if (!networkId || !account) {
      return;
    }

    const graphURL = getGraphURL(networkId);

    if (!graphURL) {
      return;
    }

    setLoading(true);
    fetch(graphURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: getQuery(account, ROWS_PER_PAGE, itemsToSkip),
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.errors || !res.data) {
          return;
        }

        const isLastPage =
          res.data.bondTransactions.length === 0 ||
          res.data.bondTransactions.length < ROWS_PER_PAGE;

        if (isLastPage) {
          setHasMore(false);
        }

        setData((prev) => ({
          blockNumber: res.data._meta.block.number,
          bondTransactions: [
            ...prev.bondTransactions,
            ...res.data.bondTransactions,
          ],
        }));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [account, networkId, itemsToSkip]);

  const handleShowMore = () => {
    setItemsToSkip((prev) => prev + ROWS_PER_PAGE);
  };

  return {
    handleShowMore,
    hasMore,
    data: {
      blockNumber: data.blockNumber,
      transactions: data.bondTransactions,
      totalCount: data.bondTransactions.length,
    },
    loading,
  };
};
