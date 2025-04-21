import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import 'aos/dist/aos.css'

function HeroSection() {
  useEffect(() => {
    AOS.init()
    AOS.refresh()
    // AOS is an external library that doesn't depend on props or state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    startDate: '',
    stakeRequirement: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="relative">
      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-90 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 rounded-3xl" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 132, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 132, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Hero Section */}
      <section className='relative container py-16'>
        <div className='max-w-4xl mx-auto text-center mb-16' data-aos="fade-up">
          <h1 className='text-5xl md:text-6xl font-bold uppercase tracking-wider leading-tight text-white mb-6'>
            Accelerate Smart Agents
          </h1>
          <p className='text-xl md:text-2xl text-[#00FF84] mb-8'>
            Stake MOR, support open-source, and earn rewards
          </p>
          <Link href="/connect_wallet">
            <button className='py-4 px-8 border-2 border-[#00FF84] hover:bg-[#00FF84] hover:text-black text-[#00FF84] font-bold rounded-lg text-lg duration-300 uppercase shadow-neon hover:shadow-neon-lg'>
              Get Started
            </button>
          </Link>
        </div>

        {/* Builder Registration Widget */}
        <div className='max-w-2xl mx-auto bg-[#0C0C0C] border border-[#00FF84] rounded-xl p-8 shadow-neon' data-aos="fade-up" data-aos-delay="200">
          <h2 className='text-2xl font-bold uppercase text-white mb-6 text-center'>
            Register as a Builder
          </h2>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-white text-sm font-medium mb-2'>
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                className='w-full bg-black border border-[#00FF84] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00FF84] focus:border-transparent'
                placeholder='Enter project name'
              />
            </div>
            <div>
              <label className='block text-white text-sm font-medium mb-2'>
                Project Description
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                className='w-full bg-black border border-[#00FF84] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00FF84] focus:border-transparent'
                rows={4}
                placeholder='Describe your project'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-white text-sm font-medium mb-2'>
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className='w-full bg-black border border-[#00FF84] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00FF84] focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-white text-sm font-medium mb-2'>
                  Stake Requirement (MOR)
                </label>
                <input
                  type="number"
                  name="stakeRequirement"
                  value={formData.stakeRequirement}
                  onChange={handleInputChange}
                  className='w-full bg-black border border-[#00FF84] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00FF84] focus:border-transparent'
                  placeholder='e.g., 1000'
                />
              </div>
            </div>
            <div className='text-sm text-gray-400 italic'>
              Provide a near-future start date so staking can begin immediately.
            </div>
            <button
              type="submit"
              className='w-full bg-[#00FF84] hover:bg-[#00CC6A] text-black font-bold py-4 px-8 rounded-lg text-lg uppercase transition-all duration-300 shadow-neon hover:shadow-neon-lg'
            >
              Create Builder Pool
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default HeroSection