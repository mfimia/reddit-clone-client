import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

// custom hook will check if user is authorized
export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      // router.pathname will tell the router where to go once logged in
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router]);
};
