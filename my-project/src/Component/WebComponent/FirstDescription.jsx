import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

const FirstDescription = () => {
    const rootRef = useRef(null)

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger)

        const q = gsap.utils.selector(rootRef)
        const rootEl = rootRef.current
        const scrollerEl = rootEl?.closest('.hide-scrollbar') || window

        const lines = q('[data-anim="line"]')
        const kicker = q('[data-anim="kicker"]')

        const setInitial = () => {
            gsap.set(lines, { yPercent: 120, opacity: 0 })
            gsap.set(kicker, { y: 14, opacity: 0 })
        }

        const run = (direction) => {
            // direction: 1 = scrolling down (top -> bottom), -1 = scrolling up (bottom -> top)
            setInitial()

            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

            if (direction === 1) {
                tl.to(kicker, { y: 0, opacity: 1, duration: 0.65 })
                    .to(lines, { yPercent: 0, opacity: 1, duration: 1.0, stagger: { each: 0.12, from: 'start' } }, '-=0.2')
            } else {
                tl.to(lines, { yPercent: 0, opacity: 1, duration: 1.0, stagger: { each: 0.12, from: 'end' } })
                    .to(kicker, { y: 0, opacity: 1, duration: 0.65 }, '-=0.25')
            }

            return tl
        }

        setInitial()

        ScrollTrigger.create({
            trigger: rootEl,
            scroller: scrollerEl,
            // Reset happens only when fully out of view to avoid "flash/hide" while visible.
            start: 'top 100%',
            end: 'bottom 0%',
            onEnter: () => run(1),
            onEnterBack: () => run(-1),
            onLeave: () => setInitial(),
            onLeaveBack: () => setInitial(),
        })
    }, { scope: rootRef })

    return (
        <>
            <div ref={rootRef} className='container mx-auto h-[93vh] mt-[3%] text-[#eeebdc] container mx-auto flex justify-center items-center flex-col gap-[50px]'>
                <p data-anim="kicker" className='uppercase text-[30px] font-semibold'>Next-Generation Digital Solutions</p>
                <p className='text-center uppercase text-[50px] font-geist font-extrabold tracking-[2px]'>
                    <span className='block overflow-hidden'>
                        <span data-anim="line" className='block will-change-transform'>We build modern web platforms,</span>
                    </span>
                    <span className='block overflow-hidden'>
                        <span data-anim="line" className='block will-change-transform'>AI-driven applications,</span>
                    </span>
                    <span className='block overflow-hidden'>
                        <span data-anim="line" className='block will-change-transform'>and scalable systems that</span>
                    </span>
                    <span className='block overflow-hidden'>
                        <span data-anim="line" className='block will-change-transform'>help businesses innovate and grow.</span>
                    </span>
                </p>
            </div>
        </>
    )
}

export default FirstDescription