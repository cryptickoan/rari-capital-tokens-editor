import gql from "graphql-tag";

export const GET_ALL_UNDERLYING_ASSETS = gql`
query GetAllUnderlyingAssets($count: Int = 400 ) {
  underlyingAssets(first: $count) {
    id
    symbol
  }
}
`;

export const GET_UNDERLYING_ASSETS_COUNT = gql`
  query UnderlyingAssetsCount {
    utility(id: "0") {
      underlyingCount
    }
  }
`;
