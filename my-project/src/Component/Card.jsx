import React, { useState, useEffect, useRef, useCallback } from 'react'
import Logo from './SVGS/Logo'

const Card = ({ isSplitComplete = false, onScrollToTop = () => {} }) => {
  const scrollContainerRef = useRef(null)
  const lastScrollTop = useRef(0)

  const handleScroll = useCallback((e) => {
    if (!isSplitComplete) return

    const scrollTop = e.target.scrollTop
    const isScrollingUp = scrollTop < lastScrollTop.current

    // Trigger reverse animation when scrolling to the very top
    if (scrollTop <= 0 && isScrollingUp) {
      onScrollToTop()
    }

    lastScrollTop.current = scrollTop

    // Prevent the scroll event from bubbling up to prevent interference with animation
    e.stopPropagation()
  }, [isSplitComplete, onScrollToTop])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      // Reset scroll position when state changes
      container.scrollTop = 0
      lastScrollTop.current = 0

      // Force reflow to ensure CSS changes take effect
      container.offsetHeight
    }
  }, [isSplitComplete])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <>
    <section
      ref={scrollContainerRef}
      className="w-full bg-black hide-scrollbar"
      style={{
        height: isSplitComplete ? '100vh' : 'auto',
        minHeight: '100vh',
        overflowY: isSplitComplete ? 'auto' : 'visible'}}>
        <div className="card_content text-center max-w-4xl mx-auto">
          <h2 className='text-[80px] md:text-[100px] font-geist font-bold leading-none antialiased md:subpixel-antialiased uppercase text-white mb-6'>
            Your Vision
          </h2>
          <p className='text-[16px] font-geist leading-[5] uppercase text-white/80 mb-8'>
            Made in GlobeSoft Solutions
          </p>
          <div className="flex justify-center mb-16">
            <Logo className='text-white' />
          </div>
          {/* Additional content */}
          <div className="space-y-8">
            <p className='text-[18px] font-geist text-white/80 max-w-2xl leading-relaxed mx-auto'>
              Transform your ideas into reality with our cutting-edge development solutions.
              We specialize in creating exceptional digital experiences that drive results.
            </p>

            <div className="space-y-4">
              <h3 className='text-[32px] font-geist font-bold uppercase text-white'>Why Choose Us</h3>
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <h4 className="text-[20px] font-geist font-bold text-white mb-2">Innovation</h4>
                  <p className="text-[14px] font-geist text-white/70 leading-relaxed">
                    Cutting-edge technologies and creative solutions
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-[20px] font-geist font-bold text-white mb-2">Quality</h4>
                  <p className="text-[14px] font-geist text-white/70 leading-relaxed">
                    Premium code quality and attention to detail
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-[20px] font-geist font-bold text-white mb-2">Results</h4>
                  <p className="text-[14px] font-geist text-white/70 leading-relaxed">
                    Measurable outcomes that drive business growth
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <p className='text-[18px] font-geist text-white/80 max-w-2xl leading-relaxed mx-auto'>
              Transform your ideas into reality with our cutting-edge development solutions.
              We specialize in creating exceptional digital experiences that drive results.
            </p>

            <div className="space-y-4">
              <h3 className='text-[32px] font-geist font-bold uppercase text-white'>Why Choose Us</h3>
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <h4 className="text-[20px] font-geist font-bold text-white mb-2">Innovation</h4>
                  <p className="text-[14px] font-geist text-white/70 leading-relaxed">
                    Cutting-edge technologies and creative solutions
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-[20px] font-geist font-bold text-white mb-2">Quality</h4>
                  <p className="text-[14px] font-geist text-white/70 leading-relaxed">
                    Premium code quality and attention to detail
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-[20px] font-geist font-bold text-white mb-2">Results</h4>
                  <p className="text-[14px] font-geist text-white/70 leading-relaxed">
                    Measurable outcomes that drive business growth
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional scrollable content */}
          <div className="space-y-12 py-20">
            <div className="text-center">
              <h3 className='text-[48px] font-geist font-bold uppercase text-white mb-8'>Our Services</h3>
              <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div className="text-left">
                  <h4 className="text-[24px] font-geist font-bold text-white mb-4">Web Development</h4>
                  <p className="text-[16px] font-geist text-white/70 leading-relaxed mb-6">
                    Custom web applications built with modern technologies. From responsive websites to complex web platforms, we deliver scalable solutions that grow with your business.
                  </p>
                  <ul className="space-y-2 text-[14px] font-geist text-white/60">
                    <li>• React & Next.js Applications</li>
                    <li>• E-commerce Platforms</li>
                    <li>• Progressive Web Apps (PWA)</li>
                    <li>• API Development & Integration</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="text-[24px] font-geist font-bold text-white mb-4">Mobile Development</h4>
                  <p className="text-[16px] font-geist text-white/70 leading-relaxed mb-6">
                    Native and cross-platform mobile applications that provide exceptional user experiences across all devices.
                  </p>
                  <ul className="space-y-2 text-[14px] font-geist text-white/60">
                    <li>• iOS & Android Native Apps</li>
                    <li>• React Native Solutions</li>
                    <li>• Flutter Applications</li>
                    <li>• App Store Optimization</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className='text-[48px] font-geist font-bold uppercase text-white mb-8'>Our Process</h3>
              <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[24px] font-geist font-bold text-white">1</span>
                  </div>
                  <h4 className="text-[18px] font-geist font-bold text-white mb-2">Discovery</h4>
                  <p className="text-[14px] font-geist text-white/70 leading-relaxed">
                    Understanding your vision, goals, and requirements
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[24px] font-geist font-bold text-white">2</span>
                  </div>
                  <h4 className="text-[18px] font-geist font-bold text-white mb-2">Design</h4>
                  <p className="text-[14px] font-geist text-white/70 leading-relaxed">
                    Creating intuitive and beautiful user experiences
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[24px] font-geist font-bold text-white">3</span>
                  </div>
                  <h4 className="text-[18px] font-geist font-bold text-white mb-2">Development</h4>
                  <p className="text-[14px] font-geist text-white/70 leading-relaxed">
                    Building robust and scalable solutions
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[24px] font-geist font-bold text-white">4</span>
                  </div>
                  <h4 className="text-[18px] font-geist font-bold text-white mb-2">Launch</h4>
                  <p className="text-[14px] font-geist text-white/70 leading-relaxed">
                    Deploying and supporting your successful project
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center py-20">
              <h3 className='text-[48px] font-geist font-bold uppercase text-white mb-8'>Ready to Get Started?</h3>
              <p className='text-[18px] font-geist text-white/80 max-w-2xl leading-relaxed mx-auto mb-12'>
                Let's transform your ideas into reality. Contact us today to discuss your next project.
              </p>
              <button className="bg-white text-black px-12 py-4 font-geist font-bold uppercase text-[16px] hover:bg-gray-100 transition-colors duration-300">
                Start Your Project
              </button>
            </div>
          </div>
        </div>
        </section>

    </>
  )
}

export default Card