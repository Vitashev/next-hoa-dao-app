import {
  Box,
  Heading,
  Text,
  Flex,
  CircularProgress,
  Grid,
  GridItem,
  Badge,
  Button,
  IconButton,
} from '@chakra-ui/react'
import { useAddress, useVote } from '@thirdweb-dev/react'
import { Proposal, ProposalState, VoteType } from '@thirdweb-dev/sdk'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  BsEmojiNeutralFill,
  BsEmojiLaughingFill,
  BsEmojiFrownFill,
} from 'react-icons/bs'

import { AiFillCheckCircle } from 'react-icons/ai'
import { FiRefreshCw } from 'react-icons/fi'

import ProposalStateLabel, { ProposalStateColor } from '../config/constants'
import { VOTE_RINKEBY_CONTRACT } from '../config/contracts'
import { AppContext } from '../_app'
import CreateProposalButton from './CreateProposalButton'
import { BigNumber, ethers } from 'ethers'

export const ProposalListContext = createContext<Record<string, any>>({})

const ActionsButton = ({
  voteStatus,
  proposalId,
}: {
  voteStatus: ProposalState
  proposalId: BigNumber
}) => {
  const vote = useVote(VOTE_RINKEBY_CONTRACT)
  const { loadProposals } = useContext(ProposalListContext)
  const [isVoteLoading, setIsVoteLoading] = useState(false)
  const [isVoted, setIsVoted] = useState(true)
  const voteClicked = (voteType: VoteType) => {
    setIsVoteLoading(true)
    vote
      ?.vote(proposalId.toString(), voteType)
      .then((res) => {
        loadProposals()
      })
      .finally(() => setIsVoteLoading(false))
  }
  const address = useAddress()
  vote!.hasVoted(proposalId.toString(), address).then((isVoterRes) => {
    setIsVoted(isVoterRes)
  })

  const executeClicked = () => {
    setIsVoteLoading(true)
    vote
      ?.execute(proposalId.toString())
      .then((res) => {
        loadProposals()
      })
      .finally(() => setIsVoteLoading(false))
  }

  if (voteStatus === ProposalState.Active && !isVoted) {
    return (
      <Flex gap={3}>
        <Button
          isLoading={isVoteLoading}
          onClick={() => voteClicked(VoteType.For)}
          leftIcon={<BsEmojiLaughingFill />}
          colorScheme="green"
          size="sm"
        >
          Approve
        </Button>
        <Button
          isLoading={isVoteLoading}
          onClick={() => voteClicked(VoteType.Against)}
          leftIcon={<BsEmojiFrownFill />}
          colorScheme="red"
          size="sm"
        >
          Against
        </Button>
        <Button
          isLoading={isVoteLoading}
          onClick={() => voteClicked(VoteType.Abstain)}
          leftIcon={<BsEmojiNeutralFill />}
          colorScheme="yellow"
          size="sm"
        >
          Abstain
        </Button>
      </Flex>
    )
  } else if (voteStatus === ProposalState.Succeeded) {
    return (
      <Button
        isLoading={isVoteLoading}
        onClick={() => executeClicked()}
        leftIcon={<AiFillCheckCircle />}
        colorScheme="blue"
        size="sm"
      >
        Execute
      </Button>
    )
  }

  return <></>
}

const ProgressCircleTemplate = () => (
  <Flex justifyContent="center" alignItems="center">
    <CircularProgress isIndeterminate color="blue.500" boxSize={200} />
  </Flex>
)

const NoProposalsTemplate = () => (
  <Flex justifyContent="center" alignItems="center">
    <Text px={8}>
      You don't have proposals yet, start create your first proposal
    </Text>
    <CreateProposalButton />
  </Flex>
)

const ProposalsTemplate = () => {
  const { proposals, loadProposals, bigNumberToStringFilter } = useContext(
    ProposalListContext,
  )
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      {proposals.map((proposal: Proposal, index: number) => (
        <GridItem key={index}>
          <Box
            key={index}
            p={5}
            shadow="md"
            borderWidth="1px"
            mb={5}
            borderRadius={10}
          >
            <Heading fontSize="xl">
              Status:{' '}
              <Badge
                variant="solid"
                ml="1"
                fontSize="0.8em"
                colorScheme={ProposalStateColor[proposal.state]}
              >
                {ProposalStateLabel[proposal.state]}
              </Badge>
              <IconButton
                ml={3}
                aria-label="Refresh"
                colorScheme="green"
                size="sm"
                onClick={loadProposals}
                icon={<FiRefreshCw />}
              />
            </Heading>
            <Text mt={4}>Proposal: {proposal.description} </Text>
            <Text mt={4}>Proposed By: {proposal.proposer}</Text>
            <Text mt={4}>
              For: {bigNumberToStringFilter(proposal.votes[1].count)}{' '}
            </Text>
            <Text mt={4}>
              Against: {bigNumberToStringFilter(proposal.votes[0].count)}
            </Text>
            <Text mt={4}>
              Abstained: {bigNumberToStringFilter(proposal.votes[2].count)}{' '}
            </Text>

            <Box>
              <ActionsButton
                voteStatus={proposal.state}
                proposalId={proposal.proposalId}
              />
            </Box>
          </Box>
        </GridItem>
      ))}
    </Grid>
  )
}

const ProposalList = () => {
  const vote = useVote(VOTE_RINKEBY_CONTRACT)
  const { proposals, setProposals } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProposals()
  }, [])

  const bigNumberToStringFilter = (bn: BigNumber) =>
    ethers.utils.formatEther(bn)

  const loadProposals = () => {
    setIsLoading(true)
    vote?.getAll().then((proposals: Proposal[]) => {
      setProposals(proposals)
      setIsLoading(false)
      console.log(proposals)
    })
  }

  return (
    <ProposalListContext.Provider
      value={{ loadProposals, proposals, bigNumberToStringFilter }}
    >
      <Flex p={5} justifyContent="center">
        {isLoading ? (
          <ProgressCircleTemplate />
        ) : proposals.length ? (
          <ProposalsTemplate />
        ) : (
          <NoProposalsTemplate />
        )}
      </Flex>
    </ProposalListContext.Provider>
  )
}

export default ProposalList
