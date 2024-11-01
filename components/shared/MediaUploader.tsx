'use client'
import React from 'react'
import { CldImage, CldUploadWidget  } from 'next-cloudinary'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { dataUrl, getImageSize } from '@/lib/utils'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'

type MediaUploaderProps={
    onValueChange : (value :string)=> void,
    setImage : React.Dispatch<any>,
    publicId: string,
    image:any,
    type:string
}

const MediaUploader = ({
    onValueChange,setImage,image,publicId,type
}:MediaUploaderProps) => {

    const {toast} = useToast()

    const onUploadSuccessHandler =  (res:any)=>{
        setImage((prev:any)=>({
            ...prev,
            publicId: res?.info?.public_id,
            width: res?.info?.width,
            height:res?.info?.height,
            secureURL : res?.info?.secure_url
    }))
    onValueChange(res?.info?.public_id)
        toast({
            title:"Image Uploaded Sucessfully",
            description:"1 credit deducted",
            duration:5000,
            className:'success-toast'
        })
    }
    const onUploadErrorHandler =  (res:any)=>{
        console.log(res)
        toast({
            title:"Something went wrong while uploading",
            description:"Please Try Again",
            duration:5000,
            className:'error-toast'
        })
    }

  return (
    <div>
        <CldUploadWidget uploadPreset='pixel_flow' 
            options={
                {
                    multiple:false,
                    resourceType:'image'
                }
        }
        onSuccess={onUploadSuccessHandler}
        onError={onUploadErrorHandler}
        >
            {({open})=>(
                <div className='flex flex-col gap-4'>
                    <h3 className='h3-bold text-dark-600'>Original</h3>
                    {publicId ? (
                            <div className="cursor-pointer overflow-hidden rounded-[10px]">
                                <CldImage width={getImageSize(type,image,"width")} 
                                            height={getImageSize(type,image,'height')}
                                            src={publicId}
                                            alt='Image Not Found'
                                            sizes={"(max-width: 767px) 100vw, 50vw"}
                                            placeholder={dataUrl as PlaceholderValue}
                                            className='media-uploader_cldImage'  />
                            </div>
                    ) : (
                        <div className='media-uploader_cta' onClick={()=>{
                            open()
                        }} >
                            <div className="media-uploader_cta-image">
                                <Image alt='Somethin went wrong😑' src={'/assets/icons/add.svg'} width={24} height={24} />
                            </div>
                                <p className='p-14-medium'>Upload Image</p>
                        </div>
                    ) }
                </div>
            )}

        </CldUploadWidget>
    </div>
  )
}

export default MediaUploader
