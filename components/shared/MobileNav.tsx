'use client' 
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'
  

const MobileNav = () => {
  const pathname = usePathname()
  return (
    <header className='header' >
        <Link href={'/'} className='flex items-center gap-2 md:py-2'>
            <Image src={'/assets/images/logo-text.svg'} alt='logo' height={28} width={180} />
        </Link>
        <nav className='flex gap-2' >
            <SignedIn>
              <UserButton afterSwitchSessionUrl='/' />
          <Sheet>
              <SheetTrigger>
                <Image src={'/assets/icons/menu.svg'} alt='logo' width={28}  height={38}/>
              </SheetTrigger>
              <SheetContent className='sheet-content sm:w-64' >
                <Image src={'/assets/images/logo-text.svg'} alt='logo' width={152}  height={128}/>
                <div className="flex justify-between">

                <ul className='header-nav_elements'>
                        {navLinks.map((ele)=>{
                            const isActive = ele.route ===  pathname
                            return (
                                <li key={ele.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-gradient': 'text-gray-700'}`}  >
                                     <Link href={ele.route} className='sidebar-link cursor-pointer' >
                                        <Image src={ele.icon} alt='logo' width={24} height={24} className={`${isActive} && 'brightness-200 text-white'`} ></Image>
                                        {ele.label}
                                     </Link>
                                </li>
                        )
                        })}
                    </ul>
                </div>

              </SheetContent>
          </Sheet>

            </SignedIn>
        </nav>
    </header>
  )
}

export default MobileNav