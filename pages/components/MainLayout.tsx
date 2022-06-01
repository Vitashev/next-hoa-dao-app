import { Box, Container, Flex, Stack, Icon } from '@chakra-ui/react'

import { FcOrganization } from 'react-icons/fc'

import ConnectMetamaskButton from './ConnectMetamaskButton'
import CreateProposalButton from './CreateProposalButton'
interface MainLayoutProps {
  children: JSX.Element
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Box borderBottom="2px" borderColor="gray.200" px={4} position="sticky">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <Icon color="blue.500" w={10} h={10} as={FcOrganization} />
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <CreateProposalButton />
              <ConnectMetamaskButton />
            </Stack>
          </Flex>
        </Flex>
      </Box>
      <Container as="main" mt={5}>
        {children}
      </Container>
    </>
  )
}

export default MainLayout
