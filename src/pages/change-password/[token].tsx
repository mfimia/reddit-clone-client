// next.js naming convention when file includes a variable in url
import { Box, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useState } from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            } else {
              setErrors(errorMap);
            }
            // Built-in function to add error message
            setErrors(toErrorMap(response.data.changePassword.errors));
          } else if (response.data?.changePassword.user) {
            // It worked
            // We go back to the homepage
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="New password"
              label="New password"
              type="password"
            />
            {tokenError ? (
              <Box>
                <Box>{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link>Request a new email</Link>
                </NextLink>
              </Box>
            ) : null}
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              backgroundColor="facebook.100"
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
