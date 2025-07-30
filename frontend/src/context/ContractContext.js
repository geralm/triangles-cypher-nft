'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AlphabetFactory from '@/abi/Alphabet.json'
const ContractContext = createContext(null);

export const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [contractData, setContractData] = useState({
    address: 'loading... ',
    totalDonated: 'loading...',
    githubRepositoryUrl: '',
    baseAlphabetUrl: '',
    mintPrice: 'loading...',
  })
  const contractAddress = "0x77B3d33F95054A1d887467fE0635D15Cc8f68931"; // ✅ Define esta variable en tu .env
  const contractAbi = AlphabetFactory.abi;
  console.log("Contrato conectado:", contract?.target || contract?.address);
  console.log("🔵 Contract Address:", contractAddress)
  console.log("🔵 Contract ABI:", contractAbi);
  useEffect(() => {
    const init = async () => {
      try {
        const isBrowser = typeof window !== "undefined" && typeof window.ethereum !== "undefined";

        let provider;
        let signer = null;

        if (isBrowser) {
          provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          signer = await provider.getSigner();
          setAccount(accounts[0]);

          // Escucha cambios de cuenta
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0] || null);
          });

        } else {
          provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/2420f4f7657b4eb5ac749356b1f2ec46"); // Infura/Alchemy/Local
        }

        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer || provider);
        const data = {
          address: contractInstance.target,
          totalDonated: ethers.formatEther(await contractInstance.totalDonated()), // Convert BigInt to string
          githubRepositoryUrl: await contractInstance.githubRepositoryUrl(),
          baseAlphabetUrl: await contractInstance.baseAlphabetUrl(),
          mintPrice: (await contractInstance.mintPrice()).toString(), // Convert BigInt to string
        };
        setContract(contractInstance);
        setContractData(data);
      } catch (err) {
        console.error("🔴 Error initializing contract:", err);
        setContract(null);
        setAccount(null);
        setContractData({
          address: 'Contract not loaded',
          totalDonated: 'Contract not loaded',
          githubRepositoryUrl: '',
          baseAlphabetUrl: '',
          mintPrice: 'Contract not loaded',
        });
      }
    };

    init();

    return () => {
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
