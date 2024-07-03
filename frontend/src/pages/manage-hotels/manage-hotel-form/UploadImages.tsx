import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { ManageHotelFormData } from './ManageHotelForm'
import { AiOutlineDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'

type FilePreview = {
  file?: File
  previewUrl: string
  base64Data?: string
  isRemote?: boolean
}

const UploadImages = () => {
  const {
    register,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext<ManageHotelFormData>()
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([])
  const existingImageUrls = watch('imageUrls')

  useEffect(() => {
    if (existingImageUrls && existingImageUrls.length > 0) {
      const initialPreviews = existingImageUrls.map((url: string) => ({
        previewUrl: url,
        isRemote: true,
      }))
      setFilePreviews(initialPreviews)
    }
  }, [existingImageUrls])

  useEffect(() => {
    sessionStorage.setItem('filePreviews', JSON.stringify(filePreviews))
  }, [JSON.stringify(filePreviews)])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, 6 - filePreviews.length) // Limit to max 6 files

      try {
        const uniqueNewFiles = newFiles.filter(
          (file) =>
            !filePreviews.some((fp) => fp?.file && fp.file.name === file.name)
        )

        if (uniqueNewFiles.length !== newFiles.length) {
          toast.error('Some files were not added because they are duplicates.')
        }

        const newFilePreviews: FilePreview[] = await Promise.all(
          uniqueNewFiles.map((file) => {
            return new Promise<FilePreview>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => {
                const base64Data = reader.result as string
                const previewUrl = URL.createObjectURL(file)
                resolve({ file, previewUrl, base64Data })
              }
              reader.readAsDataURL(file)
            })
          })
        )

        const updatedFilePreviews = [...filePreviews, ...newFilePreviews]
        setFilePreviews(updatedFilePreviews)
        const allFileObjects = [
          ...filePreviews.filter((fp) => !!fp.file),
          ...uniqueNewFiles,
        ]
        setValue('imageFiles', allFileObjects)
        trigger('imageFiles')
      } catch (error) {
        console.error('Error processing files:', error)
        toast.error('Error processing files. Please try again.')
      }
    },
    [filePreviews, setValue, trigger]
  )

  const removeFile = (fileOrUrl: File | string) => {
    let updatedFilePreviews: FilePreview[] = []

    if (typeof fileOrUrl === 'string') {
      updatedFilePreviews = filePreviews.filter(
        (fp) => fp.previewUrl !== fileOrUrl
      )
      setValue(
        'imageUrls',
        existingImageUrls.filter((url: string) => url !== fileOrUrl)
      )
      trigger('imageUrls')
    } else {
      updatedFilePreviews = filePreviews.filter((fp) => fp.file !== fileOrUrl)
      const remainingFiles = updatedFilePreviews
        .filter((fp: FilePreview) => fp.file !== null && fp.file !== undefined)
        .map((fp: FilePreview) => fp.file)
      setValue('imageFiles', remainingFiles)
      trigger('imageFiles')
    }
    setFilePreviews(updatedFilePreviews)
    trigger('imageFiles')
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/apng': ['.apng'],
      'image/avif': ['.avif'],
      'image/gif': ['.gif'],
      'image/vnd.microsoft.icon': ['.ico'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg'],
      'image/tiff': ['.tif', '.tiff'],
      'image/webp': ['.webp'],
    }, // Accept only image files of common MIME types
    multiple: true,
    maxFiles: 6,
    maxSize: 850000, // 5MB max size for 6 images
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((file) => {
        if (file.errors && file.errors.length > 0) {
          file.errors.forEach((error) => {
            toast.error(
              `File "${file.file.name}" Unsuccussful upload: ${error.message}.`
            )
          })
        } else {
          toast.error(
            `File "${file.file.name}" Unsuccussful upload: Unknown reason.`
          )
        }
      })
    },
  })

  return (
    <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
      Upload accommodation images
      <div
        {...getRootProps({
          className:
            'dropzone border-2 border-neutral-400 border-dashed rounded mt-2 p-4 bg-neutral-50 h-40 flex items-center justify-center',
        })}
      >
        <input {...getInputProps()} {...register('imageFiles')} />
        <p className="text-center text-sm md:text-base font-medium text-neutral-500">
          Drag and drop images here or click to select images.
          <br />
          You can upload up to 6 images.
          <br />
          Each image may not exceed 850 KB.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filePreviews.map((fp, index) => (
          <div key={index} className="relative group">
            <img
              src={fp.base64Data || fp.previewUrl}
              alt={`Preview-${index}`}
              className="h-40 w-full object-cover rounded"
            />
            <div className="absolute top-0 right-0 bg-gray-800 bg-opacity-75 p-1 rounded-full cursor-pointer group-hover:flex items-center justify-center transition duration-300 opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  removeFile(fp.file || fp.previewUrl)
                }}
                className="text-white rounded-full hover:bg-red-500 p-1"
              >
                <AiOutlineDelete className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Display error message for imageFiles */}
      {errors.imageFiles && (
        <span className="text-red-600 text-xs font-normal tracking-wide block absolute bottom-0 left-0 transform translate-y-full">
          {errors.imageFiles.message as string}
        </span>
      )}
    </div>
  )
}

export default UploadImages
