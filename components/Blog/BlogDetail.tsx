import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { RotatingLines } from "react-loader-spinner";
import ClientOnly from "../common/ClientOnly";

// Mock blog data 
const MOCK_BLOGS = {
  "1": {
    title: "The Future of Decentralized Builder Ecosystems",
    desc: "Exploring how Morpheus Builder is creating new opportunities for developers and stakeholders in Web3 through innovative staking and reward mechanisms.",
    image: "/design7.jpg",
    category: "Web3",
    date: "March 18, 2025"
  },
  "2": {
    title: "Understanding Builder Pools and Collaborative Staking",
    desc: "A deep dive into how builder pools work in the Morpheus ecosystem, allowing builders to combine resources and share rewards proportionally to their contributions.",
    image: "/design3.webp",
    category: "Staking",
    date: "March 15, 2025"
  }
};

function BlogDetail() {
  const router = useRouter();
  const { blogId } = router.query;
  const [blogData, setBlogData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Fix hydration issues - only render on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getBlogData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use mock data
    const id = typeof blogId === 'string' ? blogId : "1";
    const data = MOCK_BLOGS[id as keyof typeof MOCK_BLOGS] || MOCK_BLOGS["1"];
    
    setBlogData({
      ...data,
      blogId: id
    });
    
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (blogId && isClient) {
      getBlogData();
    }
  }, [blogId, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <ClientOnly fallback={
      <div className="flex justify-center my-auto h-screen items-center">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    }>
      {blogData ? (
        <div className="">
          <span className="text-white text-3xl font-bold">Blog Details</span>
          <div className="flex flex-col gap-x-10 gap-y-4 mt-8">
            <p className="text-white text-3xl font-extrabold">
              {blogData.title}
            </p>
            <time className="text-[#acacac]">{blogData.date}</time>
            <div className="relative w-full h-[400px]">
              <Image
                src={blogData.image}
                alt={blogData.title}
                fill
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <p className="text-[#acacac]">{blogData.desc}</p>
            <div className="mt-4">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {blogData.category}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center my-auto h-[400px] items-center">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      )}
    </ClientOnly>
  );
}

export default BlogDetail;
