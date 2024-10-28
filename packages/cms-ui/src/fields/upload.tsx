"use client"

import React, { type HTMLAttributes } from "react"
import { type Accept, type FileRejection, useDropzone } from "react-dropzone"
import { CircleX, CloudUpload, File, FileMusic } from "lucide-react"

import { Input } from "@repo/ui/input"
import { isObjectInCollectionByProperty } from "@repo/lib/compareCollections"
import { Button } from "@repo/ui/button"
import { formatBytes } from "@repo/lib/formatBytes"
import { Label } from "@repo/ui/label"
import { isEmpty } from "@repo/lib/isEmpty"
import { cn } from "@repo/ui/cn"

export type UploadFile = File & {
  description: string
  url: string
  ext: string
}

export type Upload = {
  // items?: AutocompleteCheckboxOption[]
  id: string
  accept?: Accept
  files: UploadFile[]
  maxFiles?: File["size"]
  maxSize?: number
  minSize?: number
  isMultiple?: boolean
  type: "audio" | "file" | "image" | "video"
  onChange: (files: UploadFile[]) => void
}

type ContextState = Upload & {
  fileRejections: FileRejection[]
  setFileRejections: React.Dispatch<React.SetStateAction<FileRejection[]>>
}

const UploadContext = React.createContext<ContextState>({
  id: "",
  files: [] as UploadFile[],
  type: "file",
  fileRejections: [],
  setFileRejections: () => {},
  onChange: () => {},
})

function useUpload() {
  return React.useContext(UploadContext)
}

export interface UploadProviderProps extends Upload {
  children?:
    | React.ReactElement<any, React.JSXElementConstructor<any>>
    | Iterable<React.ReactElement<any, React.JSXElementConstructor<any>>>
}

export function UploadProvider({
  id,
  accept,
  children,
  files = [],
  maxFiles = 1,
  maxSize = 500000,
  minSize,
  isMultiple,
  type,
  onChange,
}: UploadProviderProps) {
  const [fileRejections, setFileRejections] = React.useState<FileRejection[]>(
    []
  )

  const value = {
    id,
    accept,
    files,
    maxFiles,
    maxSize,
    minSize,
    isMultiple,
    type,
    fileRejections,
    setFileRejections,
    onChange,
  }

  React.useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.url))
  }, [])

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  )
}

export type UploadAcceptsProps = Omit<
  React.HTMLAttributes<HTMLParagraphElement>,
  "children"
>
export function UploadAccepts({ className, ...props }: UploadAcceptsProps) {
  const { accept } = useUpload()

  const accepts = Object.values(accept || {}).flat()

  return (
    <p
      className={cn("text-sm text-muted-foreground mt-1 mb-2", className)}
      {...props}
    >
      {accepts ? accepts.join(", ") : null}
    </p>
  )
}

export interface UploadDropzoneProps extends HTMLAttributes<HTMLDivElement> {}
export function UploadDropzone({ ...props }: UploadDropzoneProps) {
  const {
    accept,
    files,
    maxFiles,
    maxSize,
    minSize,
    isMultiple,
    setFileRejections,
    onChange,
  } = useUpload()

  const { getRootProps, getInputProps } = useDropzone({
    accept: accept,
    maxFiles,
    maxSize,
    minSize,
    multiple: isMultiple,
    onDropRejected: setFileRejections,
    onDrop: (acceptedFiles) => {
      setFileRejections([])

      const hasItem =
        isObjectInCollectionByProperty(acceptedFiles)(files)("name")

      if (!hasItem) {
        const nextFiles: UploadFile[] = acceptedFiles.map((file) => {
          return Object.assign(file, {
            url: URL.createObjectURL(file),
            description: "",
            ext: `.${file.type.split("/")[1]}`,
          })
        })
        onChange(nextFiles)
      }
    },
  })

  return (
    <div {...props} {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <p className='grid grid-rows-2 items-center text-center justify-center border-2 rounded-md border-dashed p-4  '>
        <CloudUpload className='h-20 w-20 text-muted-foreground m-auto' />
        Drag 'n' drop {isMultiple ? "some files" : "a file"} here,
        <br /> or click to select {isMultiple ? "files" : "a file"}
      </p>
    </div>
  )
}

export type UploadErrorProps = Omit<
  React.HTMLAttributes<HTMLParagraphElement>,
  "children"
>
export function UploadError({ className, ...props }: UploadErrorProps) {
  const { fileRejections, maxSize } = useUpload()

  const errorMessage = !isEmpty(fileRejections)
    ? ` File must be maximum size of ${formatBytes(maxSize as number)}`
    : null
  return (
    <p className={cn("text-destructive mb-1", className)} {...props}>
      {errorMessage}
    </p>
  )
}

export type UploadPreviewProps = {}
export function UploadPreview(props: UploadPreviewProps) {
  const { id, files, type, onChange } = useUpload()

  const handleOnDescriptionChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updateFiles = [...files]
      const file = updateFiles[index]

      file.description = e.target.value
      updateFiles[index] = file

      onChange(updateFiles)
    }
  const preview = (file: UploadFile) => {
    switch (type) {
      case "image":
      case "video":
        return (
          <div className='flex min-w-0 overflow-hidden rounded-md justify-center border'>
            <img
              src={file.url}
              className='h-full w-auto block rounded-md'
              // Revoke data uri after image is loaded
              onLoad={() => {
                URL.revokeObjectURL(file.url)
              }}
            />
          </div>
        )
      case "audio":
        return (
          <div className='flex min-w-0 overflow-hidden rounded-md justify-center border p-2'>
            <FileMusic className='w-10 h-10 text-muted-foreground' />
          </div>
        )
      default:
        return (
          <div className='flex min-w-0 overflow-hidden rounded-md justify-center border p-2'>
            <File className='w-10 h-10 text-muted-foreground' />
          </div>
        )
    }
  }

  //TODO: double click to zoom in
  const thumbs = files.map(async (file, index) => {
    const f = await file
    return (
      <li key={file.name} className='flex mb-2 items-top'>
        <div className='relative w-14 h-16 translate-y-3'>
          {preview(file)}
          <Button
            variant='outline'
            className='absolute p-0 rounded-full h-[26px] w-[26px] top-[-0.5rem] right-[-0.5rem]'
            onClick={() => onChange(files.filter((f) => f.name !== file.name))}
          >
            <CircleX />
          </Button>
        </div>

        <div className='ml-4 text-sm'>
          <p className='max-w-52 truncate mb-1'>{file.name}</p>
          <p className='mt-1 text-xs'>Size {formatBytes(file.size)}</p>

          {type === "image" || type === "video" ? (
            <div className='mt-2'>
              <Label className='mb-1' htmlFor={id}>
                Description
              </Label>
              <Input
                id={id}
                size='sm'
                value={(file as any)?.description || ""}
                onChange={handleOnDescriptionChange(index)}
              />
            </div>
          ) : null}
        </div>
      </li>
    )
  })

  return thumbs.length > 0 ? (
    <aside className='mt-4' {...props}>
      <ul className='flex flex-col gap-2'>{thumbs}</ul>
    </aside>
  ) : null
}
