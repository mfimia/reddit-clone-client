import { Box, Flex, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { Link } from "@chakra-ui/react";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          // when form is submitted, we display below message
          // otherwise, display form
          complete ? (
            <Box>Please check your inbox</Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="Email"
                label="Email"
                type="email"
              />
              <Flex mt={3}>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  backgroundColor="facebook.100"
                >
                  Send email
                </Button>

                <NextLink href="/forgot-password">
                  <Link ml="auto">Forgot password?</Link>
                </NextLink>
              </Flex>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, {})(ForgotPassword);
