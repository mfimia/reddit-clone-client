import { Box, Button, Flex, Link } from "@chakra-ui/react";
// import Link from "next/link";
import React, { Fragment } from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // dont run me query when we are on the server
    pause: isServer(),
  });

  let body = null;
  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <Fragment>
        <NextLink href={"/login"}>
          <Link color={"white"} mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href={"/register"}>
          <Link variant={"span"} color={"white"}>
            Register
          </Link>
        </NextLink>
      </Fragment>
    );
    // user is logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          isLoading={logoutFetching}
          onClick={() => logout()}
          variant={"link"}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex position={"sticky"} top={0} zIndex={2} p={4} bg="tomato">
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
