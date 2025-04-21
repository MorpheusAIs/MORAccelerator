import React, { useEffect, useState } from "react";
import { FaFileUpload, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import ClientOnly from "../common/ClientOnly";
import Image from "next/image";

function CreateBlog() {
  // Initialize AOS animation library on component mount
  useEffect(() => {
    AOS.init();
    AOS.refresh();
    // AOS is an external library that doesn't depend on props or state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  interface BlogData {
    title: string;
    desc: string;
    category: string;
    file: File | null;
  }

  const [blogData, setBlogData] = useState<BlogData>({
    title: "",
    desc: "",
    category: "blockchain",
    file: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issues - only render on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onchangeBlogInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBlogData({
      ...blogData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setBlogData({
        ...blogData,
        file
      });

      // Create a preview for the image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitBlog = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!blogData.title || !blogData.desc || !blogData.category || !blogData.file) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success message
      toast.success("Blog post created successfully! It will be reviewed before publishing.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      // Reset form
      setBlogData({
        title: "",
        desc: "",
        category: "blockchain",
        file: null
      });
      setPreviewUrl(null);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Something went wrong. Please try again later.", {
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
    <ClientOnly fallback={<div className="h-screen flex justify-center items-center">Loading blog creation form...</div>}>
      <div className="container my-8">
        <ToastContainer theme="dark" />
        <div className="">
          <span className="text-white text-3xl font-bold">Create Blog Post</span>
          <form onSubmit={onSubmitBlog}>
            <div className="flex flex-col md:flex-row gap-x-3 md:gap-x-10 mt-8">
              <div className="justify-center my-auto" data-aos="fade-right">
                <p className="text-white">Upload Cover Image</p>
                <div className="relative py-6 mt-7 flex justify-center text-center my-auto flex-col border-2 border-dashed border-[#575767] rounded-lg overflow-hidden">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {previewUrl ? (
                    <div className="relative w-full h-48">
                      <Image src={previewUrl} alt="Preview" width={400} height={200} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <p className="text-white">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <FaFileUpload className="mx-auto text-3xl text-[#00a3ff]" />
                      <p className="text-[#acacac]">Choose a File</p>
                      <p className="text-[#acacac]">PNG, JPEG, WEBP</p>
                    </>
                  )}
                </div>
              </div>
              <div
                className="flex flex-col border border-[#ffffff14] p-10 bg-[#24243557] rounded-lg gap-4 w-full mt-6 md:mt-0"
                data-aos="fade-left"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="text-[#acacac]">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    onChange={onchangeBlogInput}
                    name="title"
                    value={blogData.title}
                    required
                    id="title"
                    placeholder="Enter a catchy title..."
                    className="h-12 w-full bg-[#242435] border-2 border-[#ffffff14] text-white rounded-md focus:border focus:border-[#00a3ff] px-4"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="category" className="text-[#acacac]">
                    Blog Category
                  </label>
                  <select
                    onChange={onchangeBlogInput}
                    name="category"
                    value={blogData.category}
                    id="category"
                    className="h-12 w-full bg-[#242435] border-2 border-[#ffffff14] text-white rounded-md focus:border focus:border-[#00a3ff] px-4"
                  >
                    <option value="blockchain">Blockchain</option>
                    <option value="defi">DeFi</option>
                    <option value="web3">Web3</option>
                    <option value="staking">Staking</option>
                    <option value="morpheus">Morpheus</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="desc" className="text-[#acacac]">
                    Description
                  </label>
                  <textarea
                    id="desc"
                    onChange={onchangeBlogInput}
                    value={blogData.desc}
                    name="desc"
                    placeholder="Write your blog content here..."
                    className="h-36 w-full bg-[#242435] border-2 border-[#ffffff14] text-white rounded-md focus:border focus:border-[#00a3ff] p-4"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex justify-center items-center py-4 px-6 bg-[#00a3ff] hover:bg-[#212e48] text-white rounded-md transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${
                    isLoading ? "w-44" : "w-36"
                  }`}
                >
                  {isLoading && <FaSpinner className="animate-spin mr-2" />}
                  Submit Blog
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ClientOnly>
  );
}

export default CreateBlog;
