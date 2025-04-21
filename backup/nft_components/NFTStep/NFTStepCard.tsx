import React, { useEffect } from "react";
import Image from "next/image";
import AOS from 'aos';
import 'aos/dist/aos.css';

interface NFTStepStruct {
  step: string;
  title: string;
  desc: string;
  image: string;
}

function NFTStepCard(data: NFTStepStruct) {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <div className="flex flex-col gap-6 bg-[#24243557] px-3 py-6 rounded-xl hover:-translate-y-2 duration-300" data-aos="fade-down">
      <div className="flex justify-between items-center">
        <h4 className="text-[#acacac] text-2xl">STEP-{data.step}</h4>
        <div className="w-20 h-20 flex items-center justify-center bg-[#1e1e1e] rounded-full">
          <Image
            src={data.image}
            alt="shape"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>
      </div>
      
      <h5 className="text-2xl text-white">{data.title}</h5>
      <p className="text-[#acacac]">{data.desc}</p>
    </div>
  );
}

export default NFTStepCard;