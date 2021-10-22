import { useState, useEffect } from 'react'
import { SupportedDefaultValues } from './models'

export function useGetFilesFromDefaultValue(defaultValue: SupportedDefaultValues) {
  const state = useState<File[]>()
  const setFiles = state[1]

  useEffect(() => {
    if (typeof defaultValue === 'string') {
      setFiles([new File([], defaultValue)])
    } else if (defaultValue instanceof File) {
      setFiles([defaultValue])
    } else if (defaultValue instanceof FileList) {
      setFiles(Array.from(defaultValue))
    } else if (defaultValue == null) {
      setFiles(undefined)
    } else if (Array.isArray(defaultValue)) {
      if (typeof defaultValue[0] === 'string') {
        setFiles((defaultValue as string[]).map((filename) => new File([], filename)))
      } else if (defaultValue[0] instanceof File) {
        setFiles(defaultValue as File[])
      }
    }
  }, [defaultValue])

  return state
}
