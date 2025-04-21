import React from 'react';
import {
  Box,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import CreateProposal from '../components/FeatureMarket/CreateProposal';
import ProposalList from '../components/FeatureMarket/ProposalList';

const FeatureMarket = () => {
  const { account } = useWeb3React();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="2xl" mb={4}>Feature Sponsorship Market</Heading>
          <Text fontSize="lg" color="gray.600">
            Create, fund, and develop new features for the Morpheus Network
          </Text>
        </Box>

        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab>Browse Proposals</Tab>
            {account && <Tab>Create Proposal</Tab>}
          </TabList>

          <TabPanels>
            <TabPanel>
              <ProposalList />
            </TabPanel>
            
            {account && (
              <TabPanel>
                <CreateProposal />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default FeatureMarket;