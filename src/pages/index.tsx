import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  // situation -> we are done loading but there is no data
  if (!fetching && !data) {
    return <div>your query failed. you got no posts</div>;
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>Reddit (clone)</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      <br />
      {fetching && !data ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && (
        <Flex justifyContent="center">
          <Button isLoading={fetching} my={8}>
            Load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

// enable server side rendering to improve SEO
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
