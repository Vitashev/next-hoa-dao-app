import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { useAddress, useVote, useToken } from '@thirdweb-dev/react'
import { CgAddR } from 'react-icons/cg'
import { useState, useContext } from 'react'

import { AppContext } from '../_app'
import {
  TOKEN_RINKEBY_CONTRACT,
  VOTE_RINKEBY_CONTRACT,
} from '../config/contracts'
import { Proposal } from '@thirdweb-dev/sdk'

function CreateProposalButton() {
  const { setProposals } = useContext(AppContext)
  const [description, setDescription] = useState('')

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const address = useAddress()

  const vote = useVote(VOTE_RINKEBY_CONTRACT)
  const token = useToken(TOKEN_RINKEBY_CONTRACT)

  const createProposalClicked = () => {
    setIsLoading(true)
    vote
      ?.propose(description)
      .then(() => {
        return vote?.getAll()
      })
      .then((proposals: Proposal[]) => {
        setProposals(proposals)
      })
      .finally(() => {
        setIsLoading(false)
        onClose()
      })
  }

  return (
    <>
      {address && (
        <>
          <Icon
            onClick={onOpen}
            color="blue.500"
            w={10}
            h={10}
            as={CgAddR}
            cursor="pointer"
          ></Icon>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Proposal</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex flexDir="column" gap={4}>
                  <FormControl>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </FormControl>
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  colorScheme="pink"
                  isLoading={isLoading}
                  onClick={createProposalClicked}
                >
                  Create
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  )
}

export default CreateProposalButton
