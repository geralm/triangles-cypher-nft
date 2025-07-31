'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AlphabetFactory from '@/abi/Alphabet.json';

const ContractContext = createContext(null);

export const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [contractData, setContractData] = useState({
    address: 'loading... ',
    totalDonated: 'loading...',
    totalDonatedUSD: 'loading...',
    deployedAt: 'loading...',
    githubRepositoryUrl: '',
    baseAlphabetUrl: '',
    mintPrice: 'loading...'
  });

  const contractAddress = "0xeC52F9435b1e1B7F846178426f502a17B2A0375A";
  const jsonRpcProvider = "https://mainnet.infura.io/v3/2420f4f7657b4eb5ac749356b1f2ec46"; // Sepolia testnet RPC URL
  const contractAbi = AlphabetFactory.abi;

  useEffect(() => {
    const init = async () => {
      try {
        const isBrowser = typeof window !== "undefined" && typeof window.ethereum !== "undefined";
        let provider;
        let signer = null;

        if (isBrowser) {
          provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            signer = await provider.getSigner();
            setAccount(accounts[0]);
            window.ethereum.on('accountsChanged', (accounts) => {
              setAccount(accounts[0] || null);
            });
          }
        } else {
          provider = new ethers.JsonRpcProvider(jsonRpcProvider);
        }

        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer || provider);
        const [totalDonated, githubRepo, baseUrl, mintPrice, blockNumber] = await Promise.all([
          contractInstance.totalDonated(),
          contractInstance.githubRepositoryUrl(),
          contractInstance.baseAlphabetUrl(),
          contractInstance.mintPrice(),
          provider.getBlockNumber()
        ]);

        const block = await provider.getBlock(blockNumber);
        const deployedAt = new Date(block.timestamp * 1000).toLocaleString();

        setContract(contractInstance);
        setContractData(prev => ({
          ...prev,
          address: contractInstance.target,
          totalDonated: ethers.formatEther(totalDonated),
          githubRepositoryUrl: githubRepo,
          baseAlphabetUrl: baseUrl,
          mintPrice: mintPrice.toString(),
          deployedAt
        }));

        //fetchETHPrice(ethers.formatEther(totalDonated));
      } catch (err) {
        console.error("🔴 Error initializing contract:", err);
        setContract(null);
        setAccount(null);
        setContractData({
          address: 'Contract not loaded',
          totalDonated: 'Contract not loaded',
          totalDonatedUSD: 'Contract not loaded',
          deployedAt: 'Contract not loaded',
          githubRepositoryUrl: '',
          baseAlphabetUrl: '',
          mintPrice: 'Contract not loaded'
        });
      }
    };

    const fetchETHPrice = async (ethAmount) => {
     
    };

    const interval = setInterval(() => {
      if (contractData.totalDonated && contractData.totalDonated !== 'Contract not loaded') {
        fetchETHPrice(contractData.totalDonated);
      }
    }, 5000);

    init();

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined" && window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => { });
      }
    };
  }, []);

  return (
    <ContractContext.Provider value={{ contract, account, contractData }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract debe usarse dentro de <ContractProvider>');
  }
  return context;
};
