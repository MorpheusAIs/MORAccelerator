import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

function NFTCard({ title, price, likes, image, tokenId }) {
  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <div className="flex justify-between items-center text-gray-300">
        <span>{price} MOR</span>
        <span>{likes} Likes</span>
      </div>
      <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-300">
        View Details
      </button>
    </div>
  );
}

function NFTItems() {
  const NFTCardList = [
    {
      title: "Natural Language Smart Contracts",
      price: "4.8",
      likes: "028",
      image: "/design2.webp",
      tokenId: 5,
    },
    {
      title: "Smart Function Generator",
      price: "2.68",
      likes: "253",
      image: "/design1.webp",
      tokenId: 5,
    },
    {
      title: "Chainlink Integration",
      price: "3.68",
      likes: "120",
      image: "/design3.webp",
      tokenId: 5,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Newest Items</h2>
        <Link href="/allnft">
          <span className="text-xl text-blue-400 flex items-center hover:text-blue-300 transition duration-300">
            View All <FaArrowRight className="ml-2" />
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {NFTCardList.map((NFTCardData) => (
          <NFTCard key={NFTCardData.title} {...NFTCardData} />
        ))}
      </div>
    </div>
  );
}

export default NFTItems;