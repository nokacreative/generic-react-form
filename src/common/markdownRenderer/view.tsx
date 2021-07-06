import ReactMarkdown, { ReactMarkdownOptions } from 'react-markdown'
import gfm from 'remark-gfm'

import './styles.scss'

import { Checkbox } from '../standaloneControls'

const DEFAULT_OPTIONS: any = {
  input: (props: any) => {
    return (
      <Checkbox
        key={props.key}
        label=""
        htmlProps={{ checked: props.checked, disabled: props.disabled }}
      />
    )
  },
  li: (props: any) => {
    if (props.checked !== null) {
      const { children, ...rest } = props
      return <li {...rest}>{children[0]}</li>
    }
    return <li {...props} />
  },
}

type Props = {
  value: string
  options?: (defaultOptions: ReactMarkdownOptions) => ReactMarkdownOptions
}

export const MarkdownRenderer = ({ value, options }: Props) => (
  <ReactMarkdown
    remarkPlugins={[[gfm]]}
    components={options ? options(DEFAULT_OPTIONS) : DEFAULT_OPTIONS}
    className="noka-markdown-renderer"
  >
    {value}
  </ReactMarkdown>
)
