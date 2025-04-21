import { useCallback, useMemo, useState } from 'react';
import { type Address, formatUnits, parseUnits } from 'viem';
import { useAccount, useChainId, useReadContract, useWriteContract } from 'wagmi';
import { MOR_TOKEN_ABI } from '../contracts/abis/MOR_TOKEN_ABI';

export function useMORToken() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  
  // Get the right MOR token address based on the chain ID
  const tokenAddress = useMemo((): Address | undefined => {
    if (chainId === 1) {
      // Ethereum
      return process.env.NEXT_PUBLIC_MOR_TOKEN_ETHEREUM as Address;
    } else if (chainId === 42161) {
      // Arbitrum
      return process.env.NEXT_PUBLIC_MOR_TOKEN_ARBITRUM as Address;
    } else if (chainId === 8453) {
      // Base
      return process.env.NEXT_PUBLIC_MOR_TOKEN_BASE as Address;
    }
    return undefined;
  }, [chainId]);
  
  // Read contract functions
  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: MOR_TOKEN_ABI,
    functionName: 'symbol',
  });
  
  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: MOR_TOKEN_ABI,
    functionName: 'decimals',
  });
  
  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: MOR_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });
  
  // Format balance for display
  const formattedBalance = useMemo(() => {
    if (balance && decimals) {
      return formatUnits(balance as bigint, Number(decimals));
    }
    return '0';
  }, [balance, decimals]);
  
  // Write contract functions
  const { writeContractAsync: writeContract } = useWriteContract();
  
  // Approve tokens for spending
  const approve = useCallback(
    async (spender: Address, amount: string) => {
      if (!tokenAddress || !decimals) return;
      setLoading(true);
      
      try {
        const parsedAmount = parseUnits(amount, Number(decimals));
        
        const tx = await writeContract({
          address: tokenAddress,
          abi: MOR_TOKEN_ABI,
          functionName: 'approve',
          args: [spender, parsedAmount],
        });
        
        setLoading(false);
        return tx;
      } catch (error) {
        console.error('Error approving tokens:', error);
        setLoading(false);
        throw error;
      }
    },
    [tokenAddress, decimals, writeContract]
  );
  
  // Check allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: MOR_TOKEN_ABI,
    functionName: 'allowance',
    args: address && tokenAddress ? [address, tokenAddress] : undefined,
  });
  
  // Format allowance for display
  const formattedAllowance = useMemo(() => {
    if (allowance && decimals) {
      return formatUnits(allowance as bigint, Number(decimals));
    }
    return '0';
  }, [allowance, decimals]);
  
  // Send tokens cross-chain (OFT functionality)
  const sendCrossChain = useCallback(
    async (dstChainId: number, toAddress: Address, amount: string) => {
      if (!tokenAddress || !decimals || !address) return;
      setLoading(true);
      
      try {
        const parsedAmount = parseUnits(amount, Number(decimals));
        
        // Encode the address as bytes
        const addressBytes = `0x000000000000000000000000${toAddress.slice(2)}` as `0x${string}`;
        
        // Estimate fee first
        const txHash = await writeContract({
          address: tokenAddress,
          abi: MOR_TOKEN_ABI,
          functionName: 'estimateSendFee',
          args: [BigInt(dstChainId), addressBytes, parsedAmount, false, '0x'],
        });
        
        // For simplicity, we'll use a fixed gas amount since we can't directly get the result
        // In a production app, you would need to listen for events or query for the result
        const estimatedFee = parseUnits('0.01', 18); // 0.01 ETH as estimated fee
        
        // The actual cross-chain transfer
        const tx = await writeContract({
          address: tokenAddress,
          abi: MOR_TOKEN_ABI,
          functionName: 'sendFrom',
          args: [
            address,
            BigInt(dstChainId),
            addressBytes,
            parsedAmount,
            address, // refund address
            '0x0000000000000000000000000000000000000000' as Address, // zero address for zroPaymentAddress
            '0x',
          ],
          value: estimatedFee, // Use our estimated fee
        });
        
        setLoading(false);
        return tx;
      } catch (error) {
        console.error('Error sending tokens cross-chain:', error);
        setLoading(false);
        throw error;
      }
    },
    [tokenAddress, decimals, address, writeContract]
  );
  
  return {
    address: tokenAddress,
    symbol,
    decimals: decimals ? Number(decimals) : undefined,
    balance,
    formattedBalance,
    allowance,
    formattedAllowance,
    approve,
    refetchAllowance,
    sendCrossChain,
    loading
  };
}
