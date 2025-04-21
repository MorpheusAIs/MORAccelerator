import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NetworkIndicator } from "../common/NetworkIndicator";
import { DarkModeToggle } from "../common/DarkModeToggle";

export default function Navbar() {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const navItems = [
    { 
      name: "About", 
      href: "#",
      dropdownItems: [
        { name: "Learn MOR", href: "https://github.com/MorpheusAIs/Morpheus" },
        { name: "Documentation", href: "/docs" }
      ]
    },
    { name: "Builder Pools", href: "/builder-pools" },
    { name: "Stake", href: "/stake" },
    { name: "Rewards", href: "/rewards" },
    { name: "Profile", href: "/profile" },
    { name: "Builders", href: "/register" }
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo-white.png" 
                  alt="Morpheus Logo" 
                  width={120} 
                  height={30}
                  className="cursor-pointer"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-6">
              {navItems.map((item) => (
                <div key={item.name} className="relative inline-flex items-center">
                  {item.dropdownItems ? (
                    <div>
                      <button
                        onClick={() => handleDropdownToggle(item.name)}
                        className={`${
                          openDropdown === item.name
                            ? 'border-[#00FF84] text-white'
                            : 'border-transparent text-gray-300 hover:text-white hover:border-[#00FF84]'
                        } inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors duration-200`}
                      >
                        {item.name}
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openDropdown === item.name && (
                        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            {item.dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`${
                        router.pathname === item.href
                          ? 'border-[#00FF84] text-white'
                          : 'border-transparent text-gray-300 hover:text-white hover:border-[#00FF84]'
                      } inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors duration-200`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NetworkIndicator />
            <DarkModeToggle />
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}