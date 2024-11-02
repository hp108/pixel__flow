import React from 'react'

const Header = ({title,subTitle}:{title:string,subTitle?:string}) => {
  return (
    <>
    <h2 className='h2-bold text-dark-600' >{title}</h2>
    {subTitle && <h2 className='p-16-regular mt-4' >
        {subTitle}
        </h2>}
    </>
  )
}

export default Header