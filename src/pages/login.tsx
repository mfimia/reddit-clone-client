import { Button, Box } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

// interface RegisterProps {}

export const Login: React.FC<{}> = ({}) => {
  // Import router from next.js
  const router = useRouter();

  // We don't care about the first option of the hook so we leave it empty
  // Take hook from generated graphql (using graphql-codegen)
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            // Built-in function to add error message
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            // It worked
            // We go back to the homepage
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="Username or email"
              label="Username or email"
            />
            <Box my={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              isLoading={isSubmitting}
              type="submit"
              backgroundColor="facebook.100"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// we dont want server side rendering on this page, so we disable it
export default withUrqlClient(createUrqlClient, { ssr: false })(Login);
