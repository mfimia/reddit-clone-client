import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import Router from "next/router";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

// this piece of code will catch all errors. comes from urql's wonka library
const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("not authenticated")) {
          Router.replace("/login"); // replaces current route in the history rather than pushing a new entry
          // replace = good for redirecting
        }
      })
    );
  };

export type MergeMode = "before" | "after";

export interface PaginationParams {
  offsetArgument?: string;
  limitArgument?: string;
  mergeMode?: MergeMode;
}

export const cursorPagination = (): Resolver => {
  // set the pagination into a large object. pages are cached
  // when user clicks on load more, page 2 is added to page one
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // check if there is stuff in the cache. if so, set info.partial to true
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolveFieldByKey(entityKey, fieldKey);
    info.partial = !isItInTheCache;

    const results: string[] = [];
    fieldInfos.forEach((fi: { fieldKey: string }) => {
      const data = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string[];
      results.push(...data);
    });

    return results;

    // const visited = new Set();
    // let result: NullArray<string> = [];
    // let prevOffset: number | null = null;

    // for (let i = 0; i < size; i++) {
    //   const { fieldKey, arguments: args } = fieldInfos[i];
    //   if (args === null || !compareArgs(fieldArgs, args)) {
    //     continue;
    //   }

    //   const links = cache.resolve(entityKey, fieldKey) as string[];
    //   const currentOffset = args[cursorArgument];

    //   if (
    //     links === null ||
    //     links.length === 0 ||
    //     typeof currentOffset !== "number"
    //   ) {
    //     continue;
    //   }

    //   const tempResult: NullArray<string> = [];

    //   for (let j = 0; j < links.length; j++) {
    //     const link = links[j];
    //     if (visited.has(link)) continue;
    //     tempResult.push(link);
    //     visited.add(link);
    //   }

    //   if (
    //     (!prevOffset || currentOffset > prevOffset) ===
    //     (mergeMode === "after")
    //   ) {
    //     result = [...result, ...tempResult];
    //   } else {
    //     result = [...tempResult, ...result];
    //   }

    //   prevOffset = currentOffset;
    // }

    // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    // if (hasCurrentPage) {
    //   return result;
    // } else if (!(info as any).store.schema) {
    //   return undefined;
    // } else {
    //   info.partial = true;
    //   return result;
    // }
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  // We tell urql to update the user everytime we run these functions
  // Avoid cache information that keeps user from automatically directing to mainpage when logging in
  // Mutation fires -> update query -> update user
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
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
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
