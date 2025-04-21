import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaHeart, FaEthereum } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";
import Image from "next/image";
import { RotatingLines } from "react-loader-spinner";
import ClientOnly from "../common/ClientOnly";

// Mock NFT data for display
const MOCK_NFT_DATA = {
  "5": {
    price: "1.668",
    name: "Smart Function Generator",
    description: "A revolutionary tool that automatically generates smart contract functions based on natural language descriptions. Ideal for developers looking to speed up their workflow.",
    image: "/design2.webp",
    seller: "0x1234...5678",
    likes: "028",
    category: "Development"
  },
  "6": {
    price: "4.8",
    name: "Natural Language Smart Contracts",
    description: "Create smart contracts using plain English with this innovative NFT-powered tool. Simply describe what you want your contract to do, and it will generate the code for you.",
    image: "/design1.webp",
    seller: "0x8765...4321",
    likes: "253",
    category: "Utilities"
  },
  "7": {
    price: "1.668",
    name: "Decentralized Autonomous Initiatives",
    description: "A framework for launching community-driven initiatives with built-in governance and treasury management. Perfect for DAOs looking to streamline their operations.",
    image: "/design3.webp",
    seller: "0x2468...1357",
    likes: "120",
    category: "DAO"
  },
  "8": {
    price: "0.668",
    name: "Orthogonal Computing System",
    description: "A next-generation computing system designed for blockchain applications. Optimized for parallel processing and high-throughput transactions.",
    image: "/design4.webp",
    seller: "0x1357...2468",
    likes: "207",
    category: "Infrastructure"
  },
  "9": {
    price: "2.45",
    name: "Morpheus Builder Collection",
    description: "A special collection for Morpheus Builders with exclusive access to premium development tools and resources. Includes priority support and early access to new features.",
    image: "/design7.jpg",
    seller: "0x9876...5432",
    likes: "187",
    category: "Collectible"
  },
  "10": {
    price: "3.12",
    name: "Web3 Infrastructure Tools",
    description: "A comprehensive suite of tools for building robust Web3 infrastructure. Includes templates, libraries, and utilities for rapid development.",
    image: "/design8.webp",
    seller: "0x5432...9876",
    likes: "145",
    category: "Development"
  },
  "11": {
    price: "5.29",
    name: "Cross-Chain Bridge Protocol",
    description: "A secure and efficient protocol for bridging assets across multiple blockchains. Features atomic swaps and security guarantees to ensure safe transfers.",
    image: "/design10.jpg",
    seller: "0x3456...7890",
    likes: "319",
    category: "Infrastructure"
  }
};

function NFTDetail() {
  const router = useRouter();
  const { tokenId } = router.query;
  const { address } = useAccount();
  const [NFTData, setNFTData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Fix hydration issues - only render on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getNFTData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (tokenId && typeof tokenId === 'string') {
        // Use mock data
        const mockData = MOCK_NFT_DATA[tokenId as keyof typeof MOCK_NFT_DATA];
        
        if (mockData) {
          setNFTData({
            ...mockData,
            tokenId: tokenId
          });
        } else {
          toast.error("NFT not found", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching NFT:", error);
      toast.error("Failed to load NFT data", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tokenId && isClient) {
      getNFTData();
    }
  }, [tokenId, isClient]);

  const handleBuyNFT = async () => {
    try {
      if (!address) {
        toast.info("Please connect your wallet first", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      
      setIsLoading(true);
      
      // Simulate purchase delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Purchase successful! NFT will appear in your collection soon.", {
        position: "top-right",
        autoClose: 5000,
      });
      
      setIsLoading(false);
    } catch (error) {
      toast.error("Transaction failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <ClientOnly fallback={
      <div className="flex justify-center items-center h-[400px]">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    }>
      <div className="">
        <span className="text-white text-3xl font-bold">NFT Details</span>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          </div>
        ) : NFTData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-[#242435] p-6 rounded-lg overflow-hidden">
              <Image 
                src={NFTData.image} 
                alt={NFTData.name} 
                height={500} 
                width={500} 
                className="rounded-lg object-cover w-full h-auto"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <h3 className="text-3xl text-white font-bold">{NFTData.name}</h3>
                <span className="text-white flex items-center p-2 bg-[#242435] rounded-md">
                  <FaHeart className="mr-2 text-pink-500" />
                  {NFTData.likes}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="text-[#00a3ff] text-2xl font-bold flex items-center">
                  <FaEthereum className="mr-2" /> {NFTData.price} ETH
                </span>
              </div>
              
              <div>
                <span className="text-white font-bold">
                  Category: <span className="text-[#00a3ff] ml-2">{NFTData.category}</span>
                </span>
              </div>
              
              <div className="bg-[#242435] p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Description</h4>
                <p className="text-[#acacac]">{NFTData.description}</p>
              </div>
              
              <div className="bg-[#242435] p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Details</h4>
                <p className="text-[#acacac] flex justify-between">
                  <span>Seller:</span> <span className="text-white truncate max-w-[250px]">{NFTData.seller}</span>
                </p>
                <p className="text-[#acacac] flex justify-between mt-2">
                  <span>Token ID:</span> <span className="text-white">{NFTData.tokenId}</span>
                </p>
                <p className="text-[#acacac] flex justify-between mt-2">
                  <span>Blockchain:</span> <span className="text-white">Ethereum</span>
                </p>
              </div>
              
              <button
                onClick={handleBuyNFT}
                disabled={isLoading}
                className="w-full bg-[#00a3ff] hover:bg-[#0084cc] py-4 px-6 rounded-lg text-white font-bold transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <RotatingLines
                      strokeColor="white"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="20"
                      visible={true}
                    />
                    <span className="ml-3">Processing...</span>
                  </>
                ) : (
                  'Buy Now'
                )}
              </button>
              
              <ToastContainer theme="dark" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[400px] bg-[#242435] rounded-lg mt-8">
            <p className="text-white text-xl">NFT not found</p>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}

export default NFTDetail;
