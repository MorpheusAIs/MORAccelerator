import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMORToken } from '../../hooks/useMORToken';
import { useAccount, useChainId, useReadContract, useWriteContract } from 'wagmi';

// Mock the wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useChainId: vi.fn(),
  useReadContract: vi.fn(),
  useWriteContract: vi.fn(),
  useConfig: vi.fn(() => ({
    chains: [
      { id: 1, name: 'Ethereum' },
      { id: 42161, name: 'Arbitrum' },
      { id: 8453, name: 'Base' }
    ]
  }))
}));

// Mock the viem utilities
vi.mock('viem', () => ({
  formatUnits: vi.fn((value, decimals) => {
    if (typeof value === 'bigint' && typeof decimals === 'number') {
      return (Number(value) / (10 ** decimals)).toString();
    }
    return '0';
  }),
  parseUnits: vi.fn((value, decimals) => {
    if (typeof value === 'string' && typeof decimals === 'number') {
      return BigInt(Number(value) * (10 ** decimals));
    }
    return BigInt(0);
  })
}));

describe('useMORToken', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();
    
    // Mock environment variables
    vi.stubEnv('NEXT_PUBLIC_MOR_TOKEN_ETHEREUM', '0xcBB8f1BDA10b9696c57E13BC128Fe674769DCEc0');
    vi.stubEnv('NEXT_PUBLIC_MOR_TOKEN_ARBITRUM', '0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86');
    vi.stubEnv('NEXT_PUBLIC_MOR_TOKEN_BASE', '0x7431ada8a591c955a994a21710752ef9b882b8e3');
    
    // Setup default mocks
    (useAccount as any).mockReturnValue({
      address: '0x123456789abcdef',
      isConnected: true
    });
    
    (useChainId as any).mockReturnValue(42161); // Arbitrum
    
    (useReadContract as any).mockImplementation(({ functionName }: { functionName: string }) => {
      switch (functionName) {
        case 'symbol':
          return { data: 'MOR' };
        case 'decimals':
          return { data: 18 };
        case 'balanceOf':
          return { data: BigInt(5000000000000000000) }; // 5 MOR
        case 'allowance':
          return { data: BigInt(1000000000000000000) }; // 1 MOR
        default:
          return { data: undefined };
      }
    });
    
    (useWriteContract as any).mockReturnValue({
      writeContractAsync: vi.fn().mockResolvedValue('0xtransactionhash')
    });
  });
  
  it('should return the correct token address based on chain ID', () => {
    // Ethereum
    (useChainId as any).mockReturnValue(1);
    const { result: ethereumResult } = renderHook(() => useMORToken());
    expect(ethereumResult.current.address).toBe('0xcBB8f1BDA10b9696c57E13BC128Fe674769DCEc0');
    
    // Arbitrum
    (useChainId as any).mockReturnValue(42161);
    const { result: arbitrumResult } = renderHook(() => useMORToken());
    expect(arbitrumResult.current.address).toBe('0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86');
    
    // Base
    (useChainId as any).mockReturnValue(8453);
    const { result: baseResult } = renderHook(() => useMORToken());
    expect(baseResult.current.address).toBe('0x7431ada8a591c955a994a21710752ef9b882b8e3');
  });
  
  it('should return the token symbol', () => {
    const { result } = renderHook(() => useMORToken());
    expect(result.current.symbol).toBe('MOR');
  });
  
  it('should return the token decimals', () => {
    const { result } = renderHook(() => useMORToken());
    expect(result.current.decimals).toBe(18);
  });
  
  it('should return the formatted balance', () => {
    const { result } = renderHook(() => useMORToken());
    expect(result.current.formattedBalance).toBe('5');
  });
  
  it('should return the formatted allowance', () => {
    const { result } = renderHook(() => useMORToken());
    expect(result.current.formattedAllowance).toBe('1');
  });
  
  it('should call approve function correctly', async () => {
    const { result } = renderHook(() => useMORToken());
    
    const writeContractMock = useWriteContract().writeContractAsync;
    
    await act(async () => {
      await result.current.approve('0xspenderaddress', '10');
    });
    
    expect(writeContractMock).toHaveBeenCalledWith({
      address: '0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86',
      abi: expect.any(Array),
      functionName: 'approve',
      args: ['0xspenderaddress', BigInt(10000000000000000000)], // 10 MOR
    });
  });
  
  it('should handle errors when approving', async () => {
    const { result } = renderHook(() => useMORToken());
    
    const errorMsg = 'Transaction failed';
    const mockWriteContract = useWriteContract();
    // Replace the mock implementation for this test case
    (mockWriteContract.writeContractAsync as any) = vi.fn().mockRejectedValue(new Error(errorMsg));
    
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    await expect(async () => {
      await act(async () => {
        await result.current.approve('0xspenderaddress', '10');
      });
    }).rejects.toThrow(errorMsg);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error approving tokens:', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });
  
  it('should update loading state while approving', async () => {
    const { result } = renderHook(() => useMORToken());
    
    expect(result.current.loading).toBe(false);
    
    const approvePromise = result.current.approve('0xspenderaddress', '10');
    
    // Loading should be true during the approval
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await approvePromise;
    });
    
    // Loading should be false after approval
    expect(result.current.loading).toBe(false);
  });
});
