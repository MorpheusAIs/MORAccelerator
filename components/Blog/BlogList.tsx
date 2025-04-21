import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CgTime } from "react-icons/cg";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import ClientOnly from "../common/ClientOnly";

// Mock blog data list
const MOCK_BLOGS = [
  {
    image: "/design2.webp",
    title: "Future of Building in Web3",
    desc: "Explore how Web3 is changing the landscape for builders and creators",
    category: "Web3",
    time: "5",
    blogId: 1,
  },
  {
    image: "/design3.webp",
    title: "Understanding Builder Pools",
    desc: "Learn about collaborative pools and how they maximize rewards",
    category: "Staking",
    time: "4",
    blogId: 2,
  },
  {
    image: "/design4.webp",
    title: "Morpheus Reward Mechanisms",
    desc: "A deep dive into how rewards are distributed in the Morpheus ecosystem",
    category: "Rewards",
    time: "6",
    blogId: 3,
  },
  {
    image: "/design7.jpg",
    title: "Cross-Chain Builder Opportunities",
    desc: "How builders can leverage multiple chains for maximum impact",
    category: "Technology",
    time: "3",
    blogId: 4,
  },
];

function BlogList() {
  const [blogListData, setBlogListData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Fix hydration issues - only render on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Initialize AOS animation library
      AOS.init({
        duration: 800,
        once: false,
      });
      
      getBlogs();
    }
  }, [isClient]);

  const getBlogs = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      setBlogListData(MOCK_BLOGS);
      setIsLoading(false);
    } catch (error: any) {
      toast.error("Failed to load blogs", {
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

  if (!isClient) {
    return null;
  }

  return (
    <ClientOnly fallback={
      <div className="flex justify-center my-auto h-[300px] items-center">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    }>
      <article>
        <ToastContainer theme="dark" />
        <div className="container my-8">
          <div className="">
            <span className="text-white text-3xl font-bold">Blogs</span>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-5">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-20">
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                  />
                </div>
              ) : (
                blogListData && blogListData.map((blogData: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-2 p-5 bg-[#24243557] rounded-md"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="overflow-hidden rounded-md">
                        <Image
                          src={blogData.image}
                          alt={blogData.title}
                          className="transform transition duration-500 hover:scale-110"
                          width={500}
                          height={300}
                        />
                      </div>
                      <div className="flex justify-between mt-3">
                        <span className="text-[#00a3ff] bg-[#00a3ff20] px-3 py-1 rounded-full text-sm">
                          {blogData.category}
                        </span>
                        <span className="flex gap-1 text-[#acacac] items-center">
                          <CgTime className="my-auto" /> {blogData.time} min read
                        </span>
                      </div>
                      <Link href={`/blogs/${blogData.blogId}`}>
                        <div className="text-white text-2xl cursor-pointer hover:text-[#00a3ff] transition">
                          {blogData.title}
                        </div>
                      </Link>
                      <p className="text-[#acacac] text-sm line-clamp-2">{blogData.desc}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </article>
    </ClientOnly>
  );
}

export default BlogList;
