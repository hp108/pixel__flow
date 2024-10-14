
import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/sidebar'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='root'  >
      {/* {side bar} */}
      <Sidebar/>
      {/* MobileNav */}
      <MobileNav/>

        <div className="root-container">
            <div className="wrapper">
                {children}
            </div>
        </div>
    </main>
  )
}

export default layout
