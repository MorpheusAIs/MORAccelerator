import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "https://api.morpheus.market/v1";

interface TokenPriceData {
  price: number;
  trading_volume: number;
  market_cap: number;
  price_change_24h: number;
}

interface StakingMetrics {
  staker_analysis: {
    total_unique_stakers: {
      combined: number;
      arbitrum: number;
      base: number;
    };
    daily_unique_stakers: {
      [date: string]: {
        combined: number;
        arbitrum: number;
        base: number;
      };
    };
    combined_average_stake_time: number;
    total_value_locked: {
      combined: number;
      arbitrum: number;
      base: number;
    };
  };
}

interface CodeContributions {
  total_contributions: number;
  contributions_by_date: {
    [date: string]: number;
  };
  top_contributors: Array<{
    address: string;
    contributions: number;
  }>;
}

const fetchTokenPrice = async (): Promise<TokenPriceData> => {
  const { data } = await axios.get(`${API_BASE_URL}/token/price`);
  return data;
};

const fetchStakingMetrics = async (): Promise<StakingMetrics> => {
  const { data } = await axios.get(`${API_BASE_URL}/staking/metrics`);
  return data;
};

const fetchCodeContributions = async (): Promise<CodeContributions> => {
  const { data } = await axios.get(`${API_BASE_URL}/contributions/code`);
  return data;
};

export const useMorpheusData = () => {
  const { data: tokenPrice, isLoading: tokenPriceLoading, error: tokenPriceError } = useQuery({
    queryKey: ["tokenPrice"],
    queryFn: fetchTokenPrice,
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: stakingMetrics, isLoading: stakingMetricsLoading, error: stakingMetricsError } = useQuery({
    queryKey: ["stakingMetrics"],
    queryFn: fetchStakingMetrics,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const { data: codeContributions, isLoading: codeContributionsLoading, error: codeContributionsError } = useQuery({
    queryKey: ["codeContributions"],
    queryFn: fetchCodeContributions,
    refetchInterval: 3600000, // Refetch every hour
  });

  return {
    tokenPrice,
    stakingMetrics,
    codeContributions,
    loading: tokenPriceLoading || stakingMetricsLoading || codeContributionsLoading,
    error: tokenPriceError || stakingMetricsError || codeContributionsError,
  };
}; 