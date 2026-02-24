import React from 'react'
import { FaTimes } from 'react-icons/fa'

const Manu = ({ isOpen, onClose }) => {
  const menuItems = ['Home', 'About', 'Services', 'Contact']

  return (
   <>
    {/* Background Overlay with Blur - Click to close */}
    <div
      className={`fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm transition-all duration-700 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    ></div>

    {/* Main Menu Container */}
    <div className={`fixed inset-0 z-[999] transition-all duration-700 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        {/* Close Button */}
        <button
            onClick={onClose}
            className={`absolute top-6 right-6 md:top-8 md:right-[12rem] z-[1000] w-14 h-14 md:w-12 md:h-12 bg-white/15 hover:bg-white/30 active:bg-white/40 flex items-center justify-center text-white transition-all duration-500 ease-out transform backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-110 active:scale-95 ${isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-45'}`}
            style={{ transitionDelay: isOpen ? '400ms' : '0ms' }}
            aria-label="Close menu"
        >
            <FaTimes className="text-xl md:text-2xl" />
        </button>

        <div className={`flex items-center justify-center h-full transition-all duration-1000 ease-out ${isOpen ? 'scale-100' : 'scale-95'}`}>
            <ul className='flex flex-col gap-2 text-white w-full max-w-md mx-4'>
                {menuItems.map((item, index) => (
                    <li
                        key={item}
                        className={`text-3xl font-geist font-[900] uppercase tracking-[5px] cursor-pointer text-center leading-[80px] rounded-lg border-2 border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-500 ease-out transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                        style={{
                            transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
                            transform: isOpen ? 'translateY(0)' : `translateY(${20 + index * 10}px)`
                        }}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    </div>
   </>
  )
}

export default Manu