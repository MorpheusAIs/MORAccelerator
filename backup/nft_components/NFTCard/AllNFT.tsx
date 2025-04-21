import React, { useEffect, useState } from "react";
import NFTCard from "./NFTCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import ClientOnly from "../common/ClientOnly";

function AllNFT() {
  const [NFTData, setNFTData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Fix hydration issues - only render on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Mock NFT data for display
  const mockNFTData = [
    {
      title: "Smart Function Generator",
      price: "1.668",
      likes: "028",
      image: "/design2.webp",
      tokenId: 5,
    },
    {
      title: "Natural Language Smart Contracts",
      price: "4.8",
      likes: "253",
      image: "/design1.webp",
      tokenId: 6,
    },
    {
      title: "Decentralized Autonomous Initiatives",
      price: "1.668",
      likes: "120",
      image: "/design3.webp",
      tokenId: 7,
    },
    {
      title: "Orthogonal Computing System",
      price: "0.668",
      likes: "207",
      image: "/design4.webp",
      tokenId: 8,
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
    },
    {
      title: "Cross-Chain Bridge Protocol",
      price: "5.29",
      likes: "319",
      image: "/design10.jpg",
      tokenId: 11,
    },
  ];

  const getItems = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      getItems();
    }
  }, [isClient]);

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
        <span className="text-white text-3xl font-bold">Featured Collections</span>
        <div>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {NFTData && NFTData.map((NFTCardData: any) => (
                <NFTCard key={NFTCardData.tokenId} {...NFTCardData} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}

export default AllNFT;
