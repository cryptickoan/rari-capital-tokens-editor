import { useMemo } from "react";
import { useQueries, useQuery } from "react-query";
import { ChainID } from "../constants/networks";

export interface TokenData {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  color: string;
  overlayTextColor: string;
  logoURL: string;
}

export const ETH_TOKEN_DATA = {
  symbol: "ETH",
  address: "0x0000000000000000000000000000000000000000",
  name: "Ethereum",
  decimals: 18,
  color: "#627EEA",
  overlayTextColor: "#fff",
  logoURL:
    "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/64/Ethereum-ETH-icon.png",
};

const EMPTY_TOKEN_DATA: TokenData = {
  name: "",
  address: "",
  symbol: "",
  decimals: 18,
  color: "",
  overlayTextColor: "",
  logoURL: "",
};

export const fetchTokenData = async (
  address: string,
  chainId?: number
): Promise<TokenData> => {
  if (!chainId) return EMPTY_TOKEN_DATA;
  let data;
  let _chainId = chainId;
  if (chainId === 31337) {
    _chainId = 1;
  }

  if (address !== ETH_TOKEN_DATA.address) {
    try {
      // Since running the vercel functions requires a Vercel account and is super slow,
      // just fetch this data from the live site in development:
      let url = `/api/tokenData?address=${address.toLowerCase()}&chainId=${_chainId}`;

      data = {
        ...(await fetch(url).then((res) => res.json())),
        address: address,
      };

      console.log({ data });
    } catch (e) {
      data = EMPTY_TOKEN_DATA;
    }
  } else {
    data = ETH_TOKEN_DATA;
  }

  return data as TokenData;
};

export const useTokenData = (
  isAddressValid: boolean,
  address: string | undefined,
  chainId: string | null
): TokenData | undefined => {
  const { data: tokenData } = useQuery(
    `Chain: ${chainId} Address: ${address} tokenData`,
    async () => {
      if (!isAddressValid || !address || !chainId) return;
      return await fetchTokenData(address, parseInt(chainId));
    }
  );
  return tokenData;
};

export interface TokensDataMap {
  [address: string]: TokenData;
}

export const useTokensDataAsMap = (
  addresses: string[] = [],
  chainId: number = 1
): TokensDataMap => {
  // Query against all addresses
  const tokensData = useQueries(
    addresses.map((address: string) => {
      return {
        queryKey: address + " tokenData  " + chainId,
        queryFn: async () => await fetchTokenData(address, chainId),
      };
    })
  );

  return useMemo(() => {
    const ret: TokensDataMap = {};

    // If there is no return, return
    if (!tokensData.length) return ret;

    // For each tokenData Query
    tokensData.forEach(({ data }) => {
      const tokenData = data as TokenData;

      // If we have the tokenData, then add it to the hasmap
      if (tokenData && tokenData.address) {
        ret[tokenData.address] = tokenData;
      }
    });

    return ret;
  }, [tokensData]);
};
