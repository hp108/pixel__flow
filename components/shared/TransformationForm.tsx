"use client"
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Form
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, defaultValues } from '@/constants'
import { CustomField } from './CustomField'
import { AspectRatioKey } from '@/lib/utils'


export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string(),
  prompt: z.string().optional(),
  publicId: z.string()


})

const TransformationForm = ({data, action,userId,type,creditBalance,config=null}:TransformationFormProps) => {
  // 1. Define your form.

  const [image, setImage] = useState(data)
  const [transformation, setTransformation] = useState<Transformations | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig] = useState(config)
  const initialValues = data && action == 'Update' ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId
  } : defaultValues
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const onSelectFieldHandler=( value:string,onChange:(value:string)=>void)=>{

  }
  const onInputChangeHandler = ( fieldName:string,value: string,type:string,onChange: (value: string)=> void)=>{

  }
  const onTransformHandler = ()=>{

  }


  return ( <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <CustomField 
        control={form.control}
        name='title'
        formLabel='Image Title'
        className='w-full'
        render={({field})=>{
            return <Input {...field} className='input-field' />
        }}
      />
      {type === 'fill'  &&
      <CustomField 
        control={form.control}
        name='aspectRatio'
        formLabel='Aspect Ratio'
        className='w-full'
        render={({field})=>{
            return(
            <Select onValueChange={(value)=>{
              onSelectFieldHandler(value,field.onChange)
            }} >
              <SelectTrigger className="w-[180px] select-field">
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(aspectRatioOptions).map(key=>{
                  return  <SelectItem value={key} key={key}>{aspectRatioOptions[key as AspectRatioKey].label}</SelectItem>

                })}
              </SelectContent>
            </Select>
            )
        }}
      />}

        {
          (type === 'remove' || type === 'recolor') && <div className='prompt-field'>
            <CustomField control={form.control}
             name='prompt'
             className='w-full'
             formLabel= {type ==='remove'?'Object to Remove' : 'Object to Recolor'}
             render={({field})=>{
               return <Input value={field.value} onChange={(e)=>onInputChangeHandler('prompt',e.target.value,type,field.onChange)} className='input-field' />
             }}
             />
          {type === 'recolor' && <CustomField control={form.control}
                       name='color' 
                       className='w-full'
                       formLabel= {'Replacement Color'}
                       render={({field})=>{
                         return <Input value={field.value} onChange={(e)=>onInputChangeHandler('color',e.target.value,'recolor',field.onChange)} className='input-field' />
                       }}
                       />
          
          }
          </div>
        }
        <div className='flex flex-col gap-4'>

          <Button type="submit" className='submit-button capitalize' disabled={ isTransforming || transformation===null } onClick={onTransformHandler} >{ isTransforming ? 'Transforming...' : 'Apply Transformation' }</Button>

          <Button type="submit" className='submit-button capitalize' disabled={isSubmitting}   >Submit</Button>

        </div>
    </form>
  </Form>

  )
}

export default TransformationForm