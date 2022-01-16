import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Provider, createClient } from "urql";
import theme from "../theme";

// Creating a graphql client
const client = createClient({
  url: "http://localhost:4000/graphql",
});

function MyApp({ Component, pageProps }) {
  return (
    // Providing the client to our whole app
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
