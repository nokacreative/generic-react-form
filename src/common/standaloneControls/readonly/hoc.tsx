import React from 'react'
import './styles.scss'

import { EMPTY_VALUE_TEXT } from '../../../assets/constants'
import { ReadOnlyControlWrapper } from './wrapper.view'

type HocProps<TProps> = TProps & { isReadOnly?: boolean }
type ComponentProps = { defaultValue?: any | never; value?: any | never }

function valueExists<TProps extends ComponentProps>(props: TProps, valuePath: string) {
  if (valuePath in props) {
    // @ts-expect-error
    const v = props[valuePath]
    if (v == null) return false
    if (typeof v === 'string' && v === '') return false
    return true
  }
  return false
}

export function withReadOnlySwitch<TProps extends ComponentProps>(
  renderNormalControl: (props: TProps) => JSX.Element,
  renderReadOnlyControl: (props: TProps) => JSX.Element | string
): React.FunctionComponent<HocProps<TProps>> {
  return (props: HocProps<TProps>) => {
    if (props.isReadOnly) {
      if (!valueExists(props, 'defaultValue') && !valueExists(props, 'value')) {
        return <ReadOnlyControlWrapper>{EMPTY_VALUE_TEXT}</ReadOnlyControlWrapper>
      }
      return (
        <ReadOnlyControlWrapper>{renderReadOnlyControl(props)}</ReadOnlyControlWrapper>
      )
    }
    return renderNormalControl(props)
  }
}
