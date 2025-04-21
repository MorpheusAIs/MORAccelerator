import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { FeatureSponsorshipMarket } from '../../contractAbi/FeatureSponsorshipMarket';

interface Proposal {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: number;
  stakeAmount: string;
  milestones: number;
  status: string;
  creator: string;
}

interface ProposalCardProps {
  proposal: Proposal;
  onUpdate: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onUpdate }) => {
  const { account, library } = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [bid, setBid] = useState({
    amount: '',
    timeEstimate: '',
    proposal: '',
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'green';
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !library) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS!,
        FeatureSponsorshipMarket.abi,
        library.getSigner()
      );

      const tx = await contract.submitBid(
        proposal.id,
        ethers.utils.parseEther(bid.amount),
        parseInt(bid.timeEstimate),
        bid.proposal,
        { value: ethers.utils.parseEther(proposal.stakeAmount) }
      );

      await tx.wait();

      toast({
        title: 'Success',
        description: 'Bid submitted successfully',
        status: 'success',
        duration: 5000,
      });

      onClose();
      onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit bid',
        status: 'error',
        duration: 5000,
      });
      console.error(error);
    }
  };

  return (
    <>
      <Box
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        boxShadow="md"
        transition="transform 0.2s"
        _hover={{ transform: 'translateY(-4px)' }}
      >
        <VStack align="stretch" spacing={4}>
          <Heading size="md">{proposal.title}</Heading>
          <Badge colorScheme={getStatusColor(proposal.status)} alignSelf="flex-start">
            {proposal.status}
          </Badge>
          <Text noOfLines={3}>{proposal.description}</Text>
          
          <HStack justify="space-between">
            <Text fontWeight="bold">Budget:</Text>
            <Text>{proposal.budget} MOR</Text>
          </HStack>
          
          <HStack justify="space-between">
            <Text fontWeight="bold">Stake Required:</Text>
            <Text>{proposal.stakeAmount} MOR</Text>
          </HStack>
          
          <HStack justify="space-between">
            <Text fontWeight="bold">Deadline:</Text>
            <Text>{new Date(proposal.deadline * 1000).toLocaleDateString()}</Text>
          </HStack>
          
          <HStack justify="space-between">
            <Text fontWeight="bold">Milestones:</Text>
            <Text>{proposal.milestones}</Text>
          </HStack>

          {proposal.status.toLowerCase() === 'open' && account && (
            <Button colorScheme="blue" onClick={onOpen}>
              Submit Bid
            </Button>
          )}
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Bid</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleBidSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Bid Amount (MOR)</FormLabel>
                  <Input
                    type="number"
                    value={bid.amount}
                    onChange={(e) => setBid(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter your bid amount"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Time Estimate (days)</FormLabel>
                  <Input
                    type="number"
                    value={bid.timeEstimate}
                    onChange={(e) => setBid(prev => ({ ...prev, timeEstimate: e.target.value }))}
                    placeholder="Estimated completion time in days"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Development Proposal</FormLabel>
                  <Textarea
                    value={bid.proposal}
                    onChange={(e) => setBid(prev => ({ ...prev, proposal: e.target.value }))}
                    placeholder="Describe your development approach and experience"
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full">
                  Submit Bid
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProposalCard;