import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
  // Import router from next.js
  const router = useRouter();

  // We don't care about the first option of the hook so we leave it empty
  // Take hook from generated graphql (using graphql-codegen)
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data?.register.errors) {
            // Built-in function to add error message
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // It worked
            // We go back to the homepage
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="Username"
              label="Username"
            />
            <Box my={4}>
              <InputField
                name="email"
                placeholder="Email"
                label="Email"
                type="email"
              />
            </Box>
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
