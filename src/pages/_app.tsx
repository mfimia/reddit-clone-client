import { ChakraProvider } from "@chakra-ui/react";
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange, Cache, QueryInput } from "@urql/exchange-graphcache";
import theme from "../theme";
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";

// Function that allows us to properly cast updateQuery types
function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

// Creating a graphql client with urql
const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  // We tell urql to update the user everytime we run these functions
  // Avoid cache information that keeps user from automatically directing to mainpage when logging in
  // Mutation fires -> update query -> update user
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }: any) {
  return (
    // Providing the client to our whole app
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
