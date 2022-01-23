import { Box, Flex, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

const CreatePost: React.FC<{}> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="Title" label="Title" />
            <Box my={4}>
              <InputField
                name="text"
                placeholder="Text..."
                label="Body"
                type=""
              />
            </Box>
            <Flex mt={3}>
              <Button
                isLoading={isSubmitting}
                type="submit"
                backgroundColor="facebook.100"
              >
                Create post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default CreatePost;
