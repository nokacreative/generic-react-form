import { useState, useEffect } from 'react'

export function useControlCheckedState(
  htmlProps: Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'name' | 'value'
  >
) {
  const { defaultChecked, onChange: extraOnChange, ...miscProps } = htmlProps
  const [checked, setChecked] = useState<boolean>(!!defaultChecked)

  useEffect(() => {
    setChecked(!!defaultChecked)
  }, [defaultChecked])

  return {
    checked,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked)
      if (extraOnChange) extraOnChange(e)
    },
    miscProps,
  }
}
