import { init, fetchQuery } from "@airstack/node";
import dotenv from "dotenv";
dotenv.config();

init(process.env.AIRSTACK_API_KEY as string);


export const getTrendingTokens = async ():Promise<any> => {
    let query = `query MyQuery {
        TrendingTokens(
          input: {transferType: all, timeFrame: one_hour, audience: all, blockchain: base, criteria: unique_holders, filter: {}, limit: 5, swappable: {_eq: true}}
        ) {
          TrendingToken {
            address
            criteria
            criteriaCount
            token {
              name
            }
          }
        }
      }`; // Replace with GraphQL Query

     query = `query MyQuery {
        TrendingTokens(
          input: {transferType: self_initiated, timeFrame: two_hours, audience: all, blockchain: base, criteria: unique_holders, filter: {}, limit: 5, swappable: {_eq: true}}
        ) {
          TrendingToken {
            address
            blockchain
            chainId
            criteria
            criteriaCount
            id
            token {
              name
            }
            audience
          }
        }
      }`
    const { data, error } = await fetchQuery(query);

    console.log("data:", JSON.stringify(data));
    console.log("error:", error);
    return data;
}