import ReactMarkdown, { ReactMarkdownOptions } from 'react-markdown'
import gfm from 'remark-gfm'
import toc from 'remark-toc'
// @ts-expect-error
import rehypeHighlight from 'rehype-highlight'

import './styles.scss'
import { Checkbox } from '../standaloneControls'

type Options = Omit<ReactMarkdownOptions, 'children'>

const DEFAULT_OPTIONS: Options = {
  remarkPlugins: [gfm, toc],
  rehypePlugins: [[rehypeHighlight, { ignoreMissing: true }]],
  components: {
    input: (props: any) => {
      return (
        <Checkbox
          key={props.key}
          label=""
          htmlProps={{ defaultChecked: props.checked, disabled: props.disabled }}
        />
      )
    },
    li: (props: any) => {
      if (props.checked !== null) {
        const { children, ordered: _, ...rest } = props
        return (
          <li {...rest}>
            {children[0]}
            {children[2]}
          </li>
        )
      }
      return <li {...props} />
    },
    a: (props: any) => {
      return (
        <a href={props.href} target="_blank" rel="noreferrer">
          {props.children ? props.children[0] : props.href || '(link)'}
        </a>
      )
    },
  },
  className: 'noka-markdown-renderer',
}

type Props = {
  value: string
  options?: (defaultOptions: Options) => Options
}

export const MarkdownRenderer = ({ value, options }: Props) => (
  <ReactMarkdown {...(options ? options(DEFAULT_OPTIONS) : DEFAULT_OPTIONS)}>
    {value}
  </ReactMarkdown>
)
