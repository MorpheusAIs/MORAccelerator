import React from "react";
import FooterSocialMedia from "./FooterSocialMedia";
import { FaFacebook, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { IconType } from "react-icons";

function Footer() {
  interface socialMediaListStruct {
    icon: IconType;
    url: string;
  }
  const socialMediaList: socialMediaListStruct[] = [
    {
      icon: FaLinkedin,
      url: "https://in.linkedin.com/in/alltheai",
    },
    {
      icon: FaTwitter,
      url: "https://twitter.com/allthe_ai",
    },
    {
      icon: FaGithub,
      url: "https://github.com/myblockcities",
    },
  ];
  return (
    <footer className="px-3 md:px-16 py-4 md:py-8 border-t border-[#ffffff14]">
      <div className="flex flex-col md:flex-row justify-between text-[#acacac]">
        <div className="flex flex-col justify-center items-center md:flex-row gap-2">
          <span className="border-r border-[#ffffff14] px-2">
            Morpheus Developers @ 2024. All rights reserved
          </span>
          <ul className="flex gap-2">
            <li>Terms</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <ul className="flex gap-2">
              {
                socialMediaList.map((socialMedia: socialMediaListStruct, index) => {
                  return <FooterSocialMedia {...socialMedia} key={index} />
                })
              }
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
