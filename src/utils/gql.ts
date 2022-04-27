import { request } from "graphql-request";

export const FUSE_SUBGRAPHS: {
    [chainId: number]: string;
} = {
    1:
        "https://api.studio.thegraph.com/query/853/fuse-zacel/0.5.91",
    42161:
        "https://api.thegraph.com/subgraphs/name/sharad-s/fuse-arbitrum",
};

export const makeGqlRequest = async (
    query: any,
    vars: any = {},
    chainId: number = 1
) => {
    try {
        let subgraphURL =
            FUSE_SUBGRAPHS[chainId] ?? FUSE_SUBGRAPHS[1];
        return await request(subgraphURL, query, { ...vars });
    } catch (err) {
        console.error(err);
    }
};