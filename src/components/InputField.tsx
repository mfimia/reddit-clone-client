import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useField } from "formik";
import { InputHTMLAttributes } from "react";

// This input field takes the same props as any regular input field would take
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  // Declaring properties of the input and their types
  name: string;
  label: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  // Destructuring size to avoid errors. renaming it to underscore to make explicit that we wont be using it
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    // isInvalid takes a boolean so we cast error to boolean
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input
        {...props}
        {...field}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
