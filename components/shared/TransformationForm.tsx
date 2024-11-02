"use client"
import React, { useEffect, useState, useTransition } from 'react'
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
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from '@/constants'
import { CustomField } from './CustomField'
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import MediaUploader from './MediaUploader'
import TransformedImage from './TransformedImage'
import { updateCredits } from '@/lib/actions/user.actions'
import { getCldImageUrl } from 'next-cloudinary'
import { addImage, updateImage } from '@/lib/actions/image.actions'
import { useRouter } from 'next/navigation'
import { InsufficientCreditsModal } from './InsufficientCreditsModal'


export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string(),
  prompt: z.string().optional(),
  publicId: z.string()


})

const TransformationForm = ({data, action,userId,type,creditBalance,config=null}:TransformationFormProps) => {


  const transformationType = transformationTypes[type]
  const [image, setImage] = useState(data)
  const [transformation, setTransformation] = useState<Transformations | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig] = useState(config)
  const [ isPendng,startTransition ]=useTransition()
  const router = useRouter()

  console.log(isPendng)
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
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    if(data ||  image ){
      const transformationURL = getCldImageUrl({
        width:image?.width,
        height:image?.height,
        src:image?.publicId,
        ...transformationConfig
      })
      const imageData = {
        title:values.title,
        publicId: image?.publicId,
        transformationType:type,
        width:image?.width,
        height:image?.height,
        config: transformationConfig,
        secureURL:image.secureURL,
        transformationURL,
        aspectRatio:values.aspectRatio,
        prompt:values.prompt,
        color:values.color
      }

  
      if(action==='Add'){
        try{
          
          const newImage = await addImage({image:imageData,userId:userId,path:'/'}) 

          if(newImage){
            form.reset()
            setImage(data)
            router.push(`/transformations/${newImage._id}`)
          }
        }catch(err){
          console.log(err)
        }
      }
        
      if(action==='Update'){
        try{
          const updatedImage = await updateImage({
            image:{
              ...imageData,
             _id:data._id 
            },
            userId,
            path:`/transformations/${data._id}`
          }) 

          if(updatedImage){
            router.push(`/transformations/${updatedImage._id}`)
          }
        }catch(err){
          console.log(err)
        }
      }
    }
    setIsSubmitting(false)
  }

  const onSelectFieldHandler=( value:string,onChange:(value:string)=>void)=>{

      const imageMeta = aspectRatioOptions[value as AspectRatioKey]
      setImage((prev:any)=>({
        ...prev,
        aspectRatio:  imageMeta.aspectRatio, 
        width: imageMeta.width,
        height:imageMeta.height
      }))
      setTransformation(transformationType.config)
      return onChange(value);


  }
  const onInputChangeHandler = ( fieldName:string,value: string,type:string,onChange: (value: string)=> void)=>{

    debounce(()=>{
      setTransformation((prevState:any)=>( {
        ...prevState,
        [type]:{
          ...prevState?.[type], 
          [fieldName === 'prompt' ? 'prompt': 'to' ]:value  
        }
      }))
    },1000)() 
    return onChange(value)
  }
  const onTransformHandler = async ()=>{
    setIsTransforming(true)
    setTransformationConfig( deepMergeObjects(transformation,transformationConfig)) 
    setTransformation(null)
    startTransition( async ()=>{
      await updateCredits(userId,creditFee) 
    } )

  }

  useEffect(
    ()=>{
      if(image && (type === 'restore' || type ==='removeBackground'))
      {
        setTransformation(transformationType.config)
      }
    }
    ,[image,transformationType.config,type])


  return ( <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {creditBalance< Math.abs(creditFee) && <InsufficientCreditsModal/>}
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
            <Select {...field} onValueChange={(value)=>{
              onSelectFieldHandler(value,field.onChange)
            }} 
            >
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
             render={( {field})=>{
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

        <div className="media-uploader-field">
          <CustomField control={form.control} 
            name='publicId'
            className='flex size-full flex-col'
            
            render={({field})=>(
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                type={type} image={image} />
            )} 
          />

          <TransformedImage 
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
          

        </div>

        <div className='flex flex-col gap-4'>

          <Button type="submit" className='submit-button capitalize' disabled={ isTransforming || transformation===null } onClick={onTransformHandler} >{ isTransforming ? 'Transforming...' : 'Apply Transformation' }</Button>

          <Button type="submit" className='submit-button capitalize' disabled={isSubmitting}   >Submit</Button>

        </div>
    </form>
  </Form>

  )
}

export default TransformationForm