import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  NumberInput,
  NumberInputField,
  useToast,
} from '@chakra-ui/react';
import { FeatureSponsorshipMarket } from '../../contractAbi/FeatureSponsorshipMarket';

const CreateProposal = () => {
  const { account, library } = useWeb3React();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    stakeAmount: '',
    milestones: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      const tx = await contract.createProposal(
        formData.title,
        formData.description,
        ethers.utils.parseEther(formData.budget),
        Math.floor(new Date(formData.deadline).getTime() / 1000),
        ethers.utils.parseEther(formData.stakeAmount),
        Number(formData.milestones)
      );

      await tx.wait();

      toast({
        title: 'Success',
        description: 'Proposal created successfully',
        status: 'success',
        duration: 5000,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        stakeAmount: '',
        milestones: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create proposal',
        status: 'error',
        duration: 5000,
      });
      console.error(error);
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="xl" boxShadow="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Feature proposal title"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed feature description"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Budget (MOR)</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                name="budget"
                value={formData.budget}
                onChange={(value) => handleInputChange({
                  target: { name: 'budget', value }
                } as any)}
                placeholder="Total budget in MOR tokens"
              />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Deadline</FormLabel>
            <Input
              name="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Stake Amount (MOR)</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                name="stakeAmount"
                value={formData.stakeAmount}
                onChange={(value) => handleInputChange({
                  target: { name: 'stakeAmount', value }
                } as any)}
                placeholder="Required stake amount in MOR"
              />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Number of Milestones</FormLabel>
            <NumberInput min={1} max={10}>
              <NumberInputField
                name="milestones"
                value={formData.milestones}
                onChange={(value) => handleInputChange({
                  target: { name: 'milestones', value }
                } as any)}
                placeholder="Number of development milestones"
              />
            </NumberInput>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isDisabled={!account}
          >
            Create Proposal
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateProposal;