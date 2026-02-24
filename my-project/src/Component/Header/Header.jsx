import React, { useState, useEffect } from 'react'
import Logo from '../SVGS/Logo'
import { FaBars } from 'react-icons/fa'
import Manu from './Manu'

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    const toggleMenu = () => {
        if (menuOpen) {
            setIsAnimating(false)
            setTimeout(() => setMenuOpen(false), 1000) // Match the main transition duration
        } else {
            setMenuOpen(true)
            // Small delay to ensure component mounts before animation starts
            setTimeout(() => setIsAnimating(true), 10)
        }
    }

    useEffect(() => {
        if (menuOpen) {
            setIsAnimating(true)
        }
    }, [menuOpen])

    // Handle escape key to close menu
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && menuOpen) {
                toggleMenu()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [menuOpen])
  return (
    <>
    {(menuOpen || isAnimating) && <Manu isOpen={isAnimating} onClose={toggleMenu} />}
      <div className={`fixed top-0 left-0 w-full z-50 bg-[#eeebdc] py-2 px-4 shadow-md border-b border-gray-200 cursor-pointer transition-all duration-500 ease-out ${menuOpen ? 'shadow-2xl' : ''}`}>
        <div className='container mx-auto'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Logo />
              <h1 className='text-2xl font-geist font-[900] uppercase tracking-wider'>GlobeSoft Solutions</h1>
            </div>
            <div className='flex items-center gap-4'>
              <button
                className={`bg-black text-white px-4 py-3 rounded-md hover:bg-gray-800 transition-all duration-500 ease-out transform`}
                onClick={toggleMenu}
              >
                <FaBars className={`transition-transform duration-300 ${menuOpen ? 'scale-90' : 'scale-100'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Header