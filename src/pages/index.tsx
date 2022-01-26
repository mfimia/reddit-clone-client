import { Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });
  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      <br />
      {!data ? (
        <div>Loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </Layout>
  );
};

// enable server side rendering to improve SEO
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
