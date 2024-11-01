import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm'
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const AddTransformationTypePage = async ({params:{type}}:SearchParamProps) => {

  const transformation = transformationTypes[type]
  const {userId} = auth();
  if(!userId){
    redirect("/sign-in")
  }
  const user = await getUserById(userId )
  const user_id:string = user._id.toString()

  return (
    <>
      <Header  title={transformation.title} subTitle={transformation.subTitle} />
      <section className='mt-10'  >

        <TransformationForm action="Add"  userId = {user_id}
          type={type}
          creditBalance={user.creditBalance}
        />

      </section>
    </>
  )
}

export default AddTransformationTypePage    