import { withUrqlClient } from "next-urql";
import { Fragment } from "react";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Fragment>
      <NavBar />
      {!data ? (
        <div>Loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </Fragment>
  );
};

// enable server side rendering to improve SEO
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
