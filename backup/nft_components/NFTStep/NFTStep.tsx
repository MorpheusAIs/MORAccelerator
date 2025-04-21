'use client'

import React from 'react'
import NFTStepCard from './NFTStepCard'

function NFTStep() {
    interface NFTStepStruct {
        step: string;
        title: string;
        desc: string;
        image: string;
    }

    const NFTStepList: NFTStepStruct[] = [
        {
            step: '01',
            title: "Connect Wallet",
            desc: "Securely link your digital wallet to access features.",
            image: "/shape-7.png"
        },
        {
            step: '02',
            title: "Explore MRCs",
            desc: "Browse and review current Morpheus Request for Comments.",
            image: "/shape-1.png"
        },
        {
            step: '03',
            title: "Submit Proposal",
            desc: "Craft and submit your feature proposal to contribute.",
            image: "/shape-5.png"
        },
        {
            step: '04',
            title: "Sponsor",
            desc: "Pledge MOR tokens to support development of proposals.",
            image: "/shape-6.png"
        },
    ]

    return (
        <div className='container mx-auto px-4'>
            <h3 className='text-white text-3xl mb-6 font-bold'>How To Participate</h3>
            <div className='flex flex-wrap justify-between gap-4'>
                {NFTStepList.map((NFTStep: NFTStepStruct) => (
                    <div key={NFTStep.title} className='w-full sm:w-[calc(50%-8px)] md:w-[calc(25%-12px)]'>
                        <NFTStepCard {...NFTStep} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NFTStep