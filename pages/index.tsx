import { Container, Flex, Text } from '@chakra-ui/react'
import { useAddress } from '@thirdweb-dev/react'
import type { NextPage } from 'next'
import ConnectMetamaskButton from './components/ConnectMetamaskButton'

import ProposalList from './components/ProposalList'

const HomePage: NextPage = () => {
  const address = useAddress()

  return (
    <Container>
      {address ? (
        <ProposalList />
      ) : (
        <Flex justifyContent="center" alignItems="center" flexDir={'column'}>
          <Text px={8}>Connect Metamask wallet to start making proposals</Text>
          <ConnectMetamaskButton />
        </Flex>
      )}
    </Container>
  )
}

export default HomePage
