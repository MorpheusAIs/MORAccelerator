import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaHeart } from 'react-icons/fa';
import Link from "next/link";
import AOS from 'aos';
import 'aos/dist/aos.css';
import ClientOnly from "../common/ClientOnly";

interface NFTCardStruct {
  title: string;
  price: string;
  likes: string;
  image: string;
  tokenId: number;
}

function NFTCard(data: NFTCardStruct) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Fix hydration issues - only render AOS on client
    setIsClient(true);
    
    if (isClient) {
      AOS.init();
      AOS.refresh();
    }
  }, [isClient]);
  
  return (
    <ClientOnly>
      <div data-aos="fade-up">
        <div className="md:p-2 p-5 bg-[#242435] rounded-lg hover:shadow-2xl hover:shadow-[#00a3ff] transition duration-300">
          <div className="relative overflow-hidden rounded-lg">
            <Image 
              src={data.image} 
              height={330} 
              width={330} 
              alt={data.title} 
              className="transform mx-auto transition duration-500 hover:scale-110"
            />
          </div>
          <Link href={`/NFT/${data.tokenId}`}>
            <h4 className="text-white text-2xl font-bold cursor-pointer mt-4 hover:text-[#00a3ff] transition">{data.title}</h4>
          </Link>
          <div className="flex justify-between mt-2">
            <span className="text-[#00a3ff] font-semibold">{data.price} ETH</span>
            <span className="text-white flex items-center">
              <FaHeart className="mr-1 text-[#00a3ff]"/> 
              <span className="text-gray-300">{data.likes}</span>
            </span>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}

export default NFTCard;
