import React, { useState, useEffect, useRef, useCallback } from 'react'
import Logo from './SVGS/Logo'
// import Website from './Website'
import Website from './Website'

const SplitSection = () => {
  const [splitProgress, setSplitProgress] = useState(0) // 0 = no split, 1 = fully split
  const [isSplitComplete, setIsSplitComplete] = useState(false)
  const [allowNormalScroll, setAllowNormalScroll] = useState(false)
  const [isReversing, setIsReversing] = useState(false)
  const [isReversingFromWebsite, setIsReversingFromWebsite] = useState(false)
  const virtualScrollRef = useRef(0)
  const sectionRef = useRef(null)
  const animationFrameRef = useRef(null)
  const lastTouchY = useRef(0)
  const rafSupported = useRef(typeof requestAnimationFrame !== 'undefined')

  // Consistent threshold value used across all animation logic
  const splitThreshold = useRef(window.innerHeight * 0.8)

  const handleWheel = useCallback((e) => {
    // Allow normal scrolling when split is complete (Website handles its own scrolling)
    // But prevent interference during reverse animation from Website
    if (isSplitComplete && !isReversingFromWebsite) {
      return
    }

    // Allow normal scrolling only when fully reset AND scrolling up
    if (virtualScrollRef.current <= 0 && e.deltaY < 0) {
      return // Allow normal page scrolling when at start and scrolling up
    }

    e.preventDefault()

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Accumulate virtual scroll with smooth multiplier
    const previousScroll = virtualScrollRef.current
    virtualScrollRef.current += e.deltaY * 0.3

    // Allow negative values for reverse animation
    // Clamp to prevent over-scrolling beyond reasonable bounds
    virtualScrollRef.current = Math.max(-100, Math.min(virtualScrollRef.current, window.innerHeight * 1.2))

    // Detect reverse scrolling
    const isScrollingUp = virtualScrollRef.current < previousScroll


    const updateAnimation = () => {
      // Handle reverse animation (scrolling back up)
      if (virtualScrollRef.current <= 0) {
        // Fully closed - reset to initial state
        virtualScrollRef.current = 0
        setSplitProgress(0)
        setIsSplitComplete(false)
        setAllowNormalScroll(false)
        setIsReversing(false)
        setIsReversingFromWebsite(false)

        // Keep body scroll locked in initial state
        document.body.style.overflow = 'hidden'
        return
      }

      // Handle forward animation (scrolling down)
      if (virtualScrollRef.current >= splitThreshold.current) {
        // Split is complete
        virtualScrollRef.current = splitThreshold.current
        setSplitProgress(1)
        setIsSplitComplete(true)
        setAllowNormalScroll(true)
        setIsReversing(false)

        // Allow body scrolling so Website can scroll internally
        document.body.style.overflow = 'auto'
        return
      }

      // Calculate progress with smooth easing (ease-out cubic)
      const rawProgress = virtualScrollRef.current / splitThreshold.current
      const progress = 1 - Math.pow(1 - rawProgress, 3) // Cubic ease-out
      setSplitProgress(progress)
      setIsReversing(isScrollingUp)

      // Keep page locked during animation
      document.body.style.overflow = 'hidden'
      setAllowNormalScroll(false)
    }

    if (rafSupported.current) {
      animationFrameRef.current = requestAnimationFrame(updateAnimation)
    } else {
      // Fallback for browsers without requestAnimationFrame
      setTimeout(updateAnimation, 16) // ~60fps fallback
    }
  }, [isSplitComplete, isReversingFromWebsite, splitThreshold.current])

  const handleTouchStart = useCallback((e) => {
    // Allow normal touch behavior when split is complete (Website handles its own scrolling)
    // But prevent interference during reverse animation from Website
    if (isSplitComplete && !isReversingFromWebsite) {
      return
    }

    if (allowNormalScroll) {
      return
    }
    lastTouchY.current = e.touches[0].clientY
  }, [isSplitComplete, allowNormalScroll])

  const handleTouchMove = useCallback((e) => {
    // Allow normal touch behavior when split is complete (Website handles its own scrolling)
    // But prevent interference during reverse animation from Website
    if (isSplitComplete && !isReversingFromWebsite) {
      return
    }

    // Always prevent default to control the animation experience
    e.preventDefault()

    const touchY = e.touches[0].clientY
    const deltaY = lastTouchY.current - touchY
    lastTouchY.current = touchY

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Accumulate virtual scroll with gentler multiplier for smoother control
    virtualScrollRef.current += deltaY * 0.2

    // Allow negative values for reverse animation, clamp to prevent over-scrolling
    virtualScrollRef.current = Math.max(-100, Math.min(virtualScrollRef.current, window.innerHeight * 1.2))

    // Use consistent split threshold
    const touchSplitThreshold = window.innerHeight * 1.2

    const updateAnimation = () => {
      // Handle reverse animation (scrolling back up)
      if (virtualScrollRef.current <= 0) {
        // Fully closed - reset to initial state
        virtualScrollRef.current = 0
        setSplitProgress(0)
        setIsSplitComplete(false)
        setAllowNormalScroll(false)
        setIsReversing(false)
        setIsReversingFromWebsite(false)

        // Keep body scroll locked in initial state
        document.body.style.overflow = 'hidden'
        return
      }

      // Handle forward animation (scrolling down)
      if (virtualScrollRef.current >= splitThreshold.current) {
        // Split is complete
        virtualScrollRef.current = splitThreshold.current
        setSplitProgress(1)
        setIsSplitComplete(true)
        setAllowNormalScroll(true)
        setIsReversing(false)
        setIsReversingFromWebsite(false)

        // Allow body scrolling so Website can scroll internally
        document.body.style.overflow = 'auto'
        return
      }

      // Calculate progress with smooth easing (ease-out cubic)
      const rawProgress = virtualScrollRef.current / splitThreshold.current
      const progress = 1 - Math.pow(1 - rawProgress, 3) // Cubic ease-out
      setSplitProgress(progress)
      setIsReversing(virtualScrollRef.current < 0)

      // Keep page locked during animation
      document.body.style.overflow = 'hidden'
      setAllowNormalScroll(false)
    }

    if (rafSupported.current) {
      animationFrameRef.current = requestAnimationFrame(updateAnimation)
    } else {
      setTimeout(updateAnimation, 16) // ~60fps fallback
    }
  }, [isSplitComplete, isReversingFromWebsite, splitThreshold.current])

  const handleResize = useCallback(() => {
    // Update threshold on resize
    splitThreshold.current = window.innerHeight * 0.8

    // Reset animation if window is resized significantly during animation
    if (!isSplitComplete && virtualScrollRef.current > 0) {
      virtualScrollRef.current = 0
      setSplitProgress(0)
    }
  }, [isSplitComplete, isReversingFromWebsite])

  // Control body overflow based on split animation state
  // Lenis is now handled by the Website component directly
  useEffect(() => {
    if (isSplitComplete && allowNormalScroll && !isReversingFromWebsite) {
      // Allow body scrolling when website is active (Website component handles its own Lenis)
      document.body.style.overflow = 'auto'
    } else {
      // Keep body scroll locked during animation
      document.body.style.overflow = 'hidden'
    }
  }, [isSplitComplete, allowNormalScroll, isReversingFromWebsite])

  useEffect(() => {
    // Prevent scrollbars when first section is visible
    document.body.style.overflow = 'hidden'

    // Add wheel listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false })

    // Add touch event listeners for mobile devices
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    // Add resize listener for responsive behavior
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
      document.body.style.overflow = 'auto'
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [handleWheel, handleTouchStart, handleTouchMove, handleResize])


  // Panels use dynamic positioning and width for horizontal split animation

  return (
    <>
      {/* Split Section Container */}
      <section
        ref={sectionRef}
        className='h-screen w-full bg-[#eeebdc] relative overflow-hidden z-20'
        style={{
          perspective: '1000px', // Add depth for 3D effect
        }}
      >
        {/* Top Panel */}
        <div
          className='absolute left-[-10%] w-full bg-[#eeebdc] flex items-end justify-center transition-all duration-300 ease-out will-change-transform'
          style={{
            top: `${splitProgress * -25}%`, // Move up from center
            height: `${50 - (splitProgress * 25)}%`, // Shrink height as it moves
            transform: 'translateZ(0)',
          }}
        >
          <div>
            <p className='text-[16px] font-geist leading-[0] uppercase mb-4'>Best in Class</p>
            <h2 className='text-[80px] md:text-[120px] font-geist font-bold leading-none antialiased md:subpixel-antialiased uppercase mb-2'>Your Vision</h2>
          </div>
        </div>

        {/* Bottom Panel */}
        <div
          className='absolute bottom-0 left-0 w-full bg-[#eeebdc] flex items-start justify-center transition-all duration-300 ease-out will-change-transform'
          style={{
            bottom: `${splitProgress * -25}%`, // Move down from center
            height: `${50 - (splitProgress * 25)}%`, // Shrink height as it moves
            transform: 'translateZ(0)',
          }}
        >
          <div>
            <h2 className='text-[80px] md:text-[120px] font-geist font-bold leading-none antialiased md:subpixel-antialiased uppercase ms-[12rem]'>Our Expertise</h2>
            <div className="flex items-center justify-end gap-2 mt-4">
              <p className='text-[16px] font-geist leading-[5] uppercase'>Made in GlobeSoft Solutions</p>
              <Logo />
            </div>
            <div className="flex flex-col  items-center justify-end gap-2 mt-4 absolute right-[45%] top-[70%]">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="animate-bounce cursor-pointer hover:animate-pulse">
                <path d="M0 0 C0.639375 -0.01289063 1.27875 -0.02578125 1.9375 -0.0390625 C5.37673697 1.06826759 6.83279228 2.76251062 9 5.625 C9.71572695 8.64817796 9.70034845 11.53069016 9.625 14.625 C9.65400391 15.81609375 9.65400391 15.81609375 9.68359375 17.03125 C9.6479423 21.30942457 9.36593004 23.14167261 6.7109375 26.6484375 C3.05822051 29.31165767 3.05822051 29.31165767 0 29.25 C-0.639375 29.26289063 -1.27875 29.27578125 -1.9375 29.2890625 C-5.37673697 28.18173241 -6.83279228 26.48748938 -9 23.625 C-9.71572695 20.60182204 -9.70034845 17.71930984 -9.625 14.625 C-9.64433594 13.8309375 -9.66367188 13.036875 -9.68359375 12.21875 C-9.6479423 7.94057543 -9.36593004 6.10832739 -6.7109375 2.6015625 C-3.05822051 -0.06165767 -3.05822051 -0.06165767 0 0 Z M-4.8125 4.9375 C-7.86084777 9.26936262 -7.47678174 14.5581839 -7 19.625 C-5.83567931 22.10550929 -4.90574048 23.71925952 -3 25.625 C1.16990664 26.05281673 1.16990664 26.05281673 4.8125 24.3125 C7.86084777 19.98063738 7.47678174 14.6918161 7 9.625 C5.83567931 7.14449071 4.90574048 5.53074048 3 3.625 C-1.16990664 3.19718327 -1.16990664 3.19718327 -4.8125 4.9375 Z " fill="#000000" transform="translate(16,1.375)" />
                <path d="M0 0 C0.66 0 1.32 0 2 0 C2 1.98 2 3.96 2 6 C1.34 6 0.68 6 0 6 C0 4.02 0 2.04 0 0 Z " fill="#000000" transform="translate(15,8)" />
              </svg>
              <p className='text-[16px] font-geist uppercase tracking-[3px]'>Scroll</p>
            </div>
          </div>
        </div>

        {/* Center reveal area - fills the gap during vertical split */}
        <div className='absolute left-0 top-1/2 transform -translate-y-1/2 w-full bg-black transition-all duration-300 ease-out overflow-auto hide-scrollbar'
          style={{
            height: `${splitProgress * 100}%`, // Grows from center to fill the gap
            transform: 'translateY(-50%)', // Center the growing element
          }}
        >
          {/* Optional: Add content that appears in the center during split */}
          {splitProgress > 0.3 && (
            <Website
              isSplitComplete={isSplitComplete}
              onScrollToTop={() => {
                // Trigger reverse animation when scrolling to top of Website
                setIsReversing(true)
                setIsReversingFromWebsite(true)
                setIsSplitComplete(false)
                setAllowNormalScroll(false)
                document.body.style.overflow = 'hidden'

                // Start reversing from current position
                virtualScrollRef.current = splitThreshold.current * splitProgress

                // Cancel any existing animation frame
                if (animationFrameRef.current) {
                  cancelAnimationFrame(animationFrameRef.current)
                }

                // Start smooth reverse animation
                const animateReverse = () => {
                  // Gradually decrease virtual scroll with consistent speed
                  virtualScrollRef.current = Math.max(0, virtualScrollRef.current - 15)

                  if (virtualScrollRef.current <= 0) {
                    // Animation complete - reset all states
                    virtualScrollRef.current = 0
                    setSplitProgress(0)
                    setIsSplitComplete(false)
                    setAllowNormalScroll(false)
                    setIsReversing(false)
                    setIsReversingFromWebsite(false)
                    document.body.style.overflow = 'hidden'
                    return
                  }

                  // Calculate progress with smooth easing (ease-out cubic)
                  const rawProgress = virtualScrollRef.current / splitThreshold.current
                  const progress = 1 - Math.pow(1 - rawProgress, 3) // Cubic ease-out
                  setSplitProgress(progress)

                  // Continue animation
                  animationFrameRef.current = requestAnimationFrame(animateReverse)
                }

                animationFrameRef.current = requestAnimationFrame(animateReverse)
              }}
            />
          )}
        </div>
      </section >
    </>
  )
}

export default SplitSection