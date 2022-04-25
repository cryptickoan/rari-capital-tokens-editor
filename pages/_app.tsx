import '../styles/globals.css'
import type { AppProps } from 'next/app'
import "rari-components/assets/fonts/avenir-next/avenir.css"
import theme from "rari-components/theme";
import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
        <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
