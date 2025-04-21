import React, { useEffect, useState } from "react";
import NFTCard from "./NFTCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useAccount } from "wagmi";
import ClientOnly from "../common/ClientOnly";

function MyNFT() {
  const { address } = useAccount();
  const [NFTData, setNFTData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Fix hydration issues - only render on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Mock NFT data for display (subset of all NFTs - these would be owned by the user)
  const mockNFTData = [
    {
      title: "Decentralized Autonomous Initiatives",
      price: "1.668",
      likes: "120",
      image: "/design3.webp",
      tokenId: 7,
    },
    {
      title: "Morpheus Builder Collection",
      price: "2.45",
      likes: "187",
      image: "/design7.jpg",
      tokenId: 9,
    },
    {
      title: "Web3 Infrastructure Tools",
      price: "3.12", 
      likes: "145",
      image: "/design8.webp",
      tokenId: 10,
    }
  ];

  const getMyNFTs = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Check if wallet is connected
      if (!address) {
        toast.info(
          "Please connect your wallet to view your NFTs",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setNFTData([]);
        setIsLoading(false);
        return;
      }
      
      // Use mock data instead of contract calls
      setNFTData(mockNFTData);
      setIsLoading(false);
    } catch (error) {
      toast.error(
        "Something went wrong. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      getMyNFTs();
    }
  }, [isClient, address]); // Re-run when address changes

  if (!isClient) {
    return null;
  }

  return (
    <ClientOnly fallback={
      <div className="flex justify-center items-center h-[300px]">
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
        <ToastContainer theme="dark" />
        <span className="text-white text-3xl font-bold">My Collection</span>
        
        {!address ? (
          <div className="mt-8 p-6 bg-[#242435] rounded-lg text-center">
            <p className="text-white text-lg">Connect your wallet to view your NFTs</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          </div>
        ) : NFTData && NFTData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {NFTData.map((NFTCardData: any) => (
              <NFTCard key={NFTCardData.tokenId} {...NFTCardData} />
            ))}
          </div>
        ) : (
          <div className="mt-8 p-6 bg-[#242435] rounded-lg text-center">
            <p className="text-white text-lg">You don't own any NFTs yet</p>
            <p className="text-[#acacac] mt-2">Explore the marketplace to find NFTs to purchase</p>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}

export default MyNFT;
