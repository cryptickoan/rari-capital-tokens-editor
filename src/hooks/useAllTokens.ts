import { useQuery } from "react-query"
import { GET_ALL_UNDERLYING_ASSETS, GET_UNDERLYING_ASSETS_COUNT } from "../gql/getAllUnderlyingAssets"
import { makeGqlRequest } from "../utils/gql"

const useAllTokens = () => {
    const { data } = useQuery(
        'allTokens',
        async () => {
            const { utility: { underlyingCount } } = await makeGqlRequest(GET_UNDERLYING_ASSETS_COUNT, undefined, 1)
            const { underlyingAssets } = await makeGqlRequest(GET_ALL_UNDERLYING_ASSETS, { count: parseInt(underlyingCount) }, 1)
            return underlyingAssets
        }


    )

    return data
}

export default useAllTokens