'use client'
import { navLinks } from '@/constants'
import { SignedOut, UserButton } from '@clerk/clerk-react'
import { SignedIn } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

const Sidebar = () => {
    const pathname = usePathname()
    console.log(pathname)
  return (
    <aside className="sidebar">
        <div className="flex side-full flex-col">
            <Link href={'/'} className='sidebar-logo' >
                <Image  src="/assets/images/logo-text.svg" alt='logo' style={{color:'grey'}} width={200} height={30} />
            </Link>
            <nav className='sidebar-nav' >
                <SignedIn>

                    <ul className='sidebar-nav_elements'>
                        {navLinks.slice(0,6).map((ele)=>{
                            const isActive = ele.route ===  pathname
                            return (
                                <li key={ele.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-gradient': 'text-gray-700'}`}  >
                                     <Link href={ele.route} className='sidebar-link' >
                                        <Image src={ele.icon} alt='logo' width={24} height={24} className={`${isActive} && 'brightness-200'`} ></Image>
                                        {ele.label}
                                     </Link>
                                </li>
                        )
                        })}
                    </ul>
                        <ul className='sidebar-nav_elements' >
                        {navLinks.slice(6).map((ele)=>{
                            const isActive = ele.route ===  pathname
                            return (
                                <li key={ele.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-gradient': 'text-gray-700'}`}  >
                                     <Link href={ele.route} className='sidebar-link' >
                                        <Image src={ele.icon} alt='logo' width={24} height={24} className={`${isActive} && 'brightness-200'`} ></Image>
                                        {ele.label}
                                     </Link>
                                </li>
                        )
                        })}
                            <li className='flex-center cursor-pointer gap-2 p-4'  >
                                <UserButton   showName />
                            </li>
                        </ul>
                </SignedIn>
            </nav>
            <SignedOut>
                <Button asChild >
                    <Link href={'/sign-in'} >Login</Link>
                </Button>
            </SignedOut>
        </div>
        
    </aside>
  )
}

export default Sidebar