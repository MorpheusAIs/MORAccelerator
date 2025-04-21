'use client'

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import "swiper/css/pagination";

function Slider() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const SliderImageList: string[] = [
    "/design1.webp",
    "/design2.webp",
    "/design3.webp",
    "/design4.webp",
    "/design7.jpg",
    "/design8.webp",
    "/design10.jpg",
    "/dsign_9.webp",
  ];

  return (
    <div className="container py-16" data-aos="zoom-in-down">
      <div className="px-4">
        <Swiper
          modules={[Navigation, Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={2}
          navigation
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
          className="mySwiper"
        >
          {SliderImageList.map((NFTImage, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    <Image
                      src={NFTImage}
                      alt={`design${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">Design {index + 1}</h3>
                    <p className="text-sm text-gray-600">MOR Tool</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default Slider;