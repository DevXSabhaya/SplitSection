import React, { useState, useEffect, useRef, useCallback } from 'react'
import Logo from './SVGS/Logo'
import Card from './Card'

const SplitSection = () => {
  const [splitProgress, setSplitProgress] = useState(0) // 0 = no split, 1 = fully split
  const [isSplitComplete, setIsSplitComplete] = useState(false)
  const [allowNormalScroll, setAllowNormalScroll] = useState(false)
  const [isReversing, setIsReversing] = useState(false)
  const [isReversingFromCard, setIsReversingFromCard] = useState(false)
  const virtualScrollRef = useRef(0)
  const sectionRef = useRef(null)
  const animationFrameRef = useRef(null)
  const lastTouchY = useRef(0)
  const rafSupported = useRef(typeof requestAnimationFrame !== 'undefined')

  const handleWheel = useCallback((e) => {
    // Allow normal scrolling when split is complete (Card handles its own scrolling)
    // But prevent interference during reverse animation from Card
    if (isSplitComplete && !isReversingFromCard) {
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

    // Define split threshold (how much scroll needed to complete split)
    const splitThreshold = window.innerHeight * 0.8

    const updateAnimation = () => {
      // Handle reverse animation (scrolling back up)
      if (virtualScrollRef.current <= 0) {
        // Fully closed - reset to initial state
        virtualScrollRef.current = 0
        setSplitProgress(0)
        setIsSplitComplete(false)
        setAllowNormalScroll(false)
        setIsReversing(false)

        // Allow body scrolling so Card can scroll internally
        document.body.style.overflow = 'auto'
        return
      }

      // Handle forward animation (scrolling down)
      if (virtualScrollRef.current >= splitThreshold) {
        // Split is complete
        virtualScrollRef.current = splitThreshold
        setSplitProgress(1)
        setIsSplitComplete(true)
        setAllowNormalScroll(true)
        setIsReversing(false)

        // Allow body scrolling so Card can scroll internally
        document.body.style.overflow = 'auto'
        return
      }

      // Calculate progress with smooth easing (ease-out cubic)
      const rawProgress = virtualScrollRef.current / splitThreshold
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
  }, [isSplitComplete, isReversingFromCard])

  const handleTouchStart = useCallback((e) => {
    // Allow normal touch behavior when split is complete (Card handles its own scrolling)
    // But prevent interference during reverse animation from Card
    if (isSplitComplete && !isReversingFromCard) {
      return
    }

    if (allowNormalScroll) {
      return
    }
    lastTouchY.current = e.touches[0].clientY
  }, [isSplitComplete, allowNormalScroll])

  const handleTouchMove = useCallback((e) => {
    // Allow normal touch behavior when split is complete (Card handles its own scrolling)
    // But prevent interference during reverse animation from Card
    if (isSplitComplete && !isReversingFromCard) {
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

    // Allow full range for smooth opening and closing animations
    virtualScrollRef.current = Math.max(-200, Math.min(virtualScrollRef.current, window.innerHeight * 1.5))

    // Define split threshold - increased for longer, smoother animation
    const splitThreshold = window.innerHeight * 1.2

    const updateAnimation = () => {
      // Handle fully closed state (scrolled back to top)
      if (virtualScrollRef.current <= -100) {
        virtualScrollRef.current = 0
        setSplitProgress(0)
        setIsSplitComplete(false)
        setAllowNormalScroll(false)
        setIsReversing(false)
        document.body.style.overflow = 'hidden'
        return
      }

      // Handle fully open state (split animation complete)
      if (virtualScrollRef.current >= splitThreshold) {
        virtualScrollRef.current = splitThreshold
        setSplitProgress(1)
        setIsSplitComplete(true)
        setAllowNormalScroll(true)
        setIsReversing(false)
        document.body.style.overflow = 'auto'
        return
      }

      // Calculate smooth progress with better easing curve
      const rawProgress = Math.max(0, Math.min(1, virtualScrollRef.current / splitThreshold))
      const progress = rawProgress < 0.5
        ? 2 * rawProgress * rawProgress // Ease-in for first half (gentle start)
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2 // Ease-out for second half (smooth finish)

      setSplitProgress(progress)
      setIsSplitComplete(false)
      setAllowNormalScroll(false)
      setIsReversing(virtualScrollRef.current < 0)

      // Keep page locked during animation
      document.body.style.overflow = 'hidden'
    }

    if (rafSupported.current) {
      animationFrameRef.current = requestAnimationFrame(updateAnimation)
    } else {
      setTimeout(updateAnimation, 16) // ~60fps fallback
    }
  }, [isSplitComplete, isReversingFromCard])

  const handleResize = useCallback(() => {
    // Reset animation if window is resized significantly during animation
    if (!isSplitComplete && virtualScrollRef.current > 0) {
      virtualScrollRef.current = 0
      setSplitProgress(0)
    }
  }, [isSplitComplete, isReversingFromCard])

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
          className='absolute left-0 w-full bg-[#eeebdc] flex items-end justify-center transition-all duration-300 ease-out will-change-transform'
          style={{
            top: `${splitProgress * -25}%`, // Move up from center
            height: `${50 - (splitProgress * 25)}%`, // Shrink height as it moves
            transform: 'translateZ(0)',
          }}
        >
          <div>
            <p className='text-[16px] font-geist leading-[0] uppercase mb-4'>Best in Class</p>
            <h2 className='text-[80px] md:text-[100px] font-geist font-bold leading-none antialiased md:subpixel-antialiased uppercase mb-2'>Your Vision</h2>
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
            <h2 className='text-[80px] md:text-[100px] font-geist font-bold leading-none antialiased md:subpixel-antialiased uppercase ms-80'>Our Expertise</h2>
            <div className="flex items-center justify-end gap-2 mt-4">
              <p className='text-[16px] font-geist leading-[5] uppercase'>Made in GlobeSoft Solutions</p>
              <Logo />
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
            <Card
              isSplitComplete={isSplitComplete}
              onScrollToTop={() => {
                // Trigger reverse animation when scrolling to top of Card
                setIsReversing(true)
              setIsReversingFromCard(true)
              setIsSplitComplete(false)
              setAllowNormalScroll(false)
              document.body.style.overflow = 'hidden'
              // Start reversing from current position using existing animation system
              virtualScrollRef.current = splitThreshold * splitProgress

              // Start the reverse animation using the existing wheel animation logic
              const startReverseAnimation = () => {
                const animateReverse = () => {
                  // Gradually decrease virtual scroll to trigger reverse animation
                  virtualScrollRef.current -= 20 // Adjust speed as needed

                  // Use the same animation logic as wheel handler
                  const splitThreshold = window.innerHeight * 0.8
                  if (virtualScrollRef.current <= 0) {
                    virtualScrollRef.current = 0
                    setSplitProgress(0)
                    setIsSplitComplete(false)
                    setAllowNormalScroll(false)
                    setIsReversing(false)
                    setIsReversingFromCard(false)
                    document.body.style.overflow = 'hidden'
                    return
                  }

                  // Calculate progress with smooth easing (ease-out cubic)
                  const rawProgress = virtualScrollRef.current / splitThreshold
                  const progress = 1 - Math.pow(1 - rawProgress, 3) // Cubic ease-out
                  setSplitProgress(progress)

                  // Continue animation
                  requestAnimationFrame(animateReverse)
                }

                requestAnimationFrame(animateReverse)
              }

              startReverseAnimation()
            }}
          />
        )}
      </div>
    </section >
    </>
  )
}

export default SplitSection