import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { createContext, useState } from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { ChainId, Proposal } from '@thirdweb-dev/sdk'
import MainLayout from './components/MainLayout'

export const AppContext = createContext<Record<string, any>>({})
function MyApp({ Component, pageProps }: AppProps) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  return (
    <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
      <AppContext.Provider value={{ proposals, setProposals }}>
        <ChakraProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ChakraProvider>
      </AppContext.Provider>
    </ThirdwebProvider>
  )
}

export default MyApp
