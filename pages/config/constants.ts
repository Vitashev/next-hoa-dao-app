import { ProposalState } from '@thirdweb-dev/sdk'

const ProposalStateLabel = {
  [ProposalState.Active]: 'Active',
  [ProposalState.Canceled]: 'Canceled',
  [ProposalState.Defeated]: 'Defeated',
  [ProposalState.Executed]: 'Executed',
  [ProposalState.Expired]: 'Expired',
  [ProposalState.Pending]: 'Pending',
  [ProposalState.Queued]: 'Queued',
  [ProposalState.Succeeded]: 'Succeeded',
}

export const ProposalStateColor = {
  [ProposalState.Active]: 'blue',
  [ProposalState.Canceled]: 'gray',
  [ProposalState.Defeated]: 'red',
  [ProposalState.Executed]: 'purple',
  [ProposalState.Expired]: 'pink',
  [ProposalState.Pending]: 'orange',
  [ProposalState.Queued]: 'yellow',
  [ProposalState.Succeeded]: 'green',
}

export default ProposalStateLabel
