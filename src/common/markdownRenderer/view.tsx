import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import toc from 'remark-toc'
// @ts-expect-error
import rehypeHighlight from 'rehype-highlight'

import './styles.scss'
import { Checkbox } from '../standaloneControls/checkbox'
import { MarkdownRendererOptions } from './models'

export const UPLOADED_IMAGE_PREFIX = 'uploaded:'

const DEFAULT_OPTIONS = (
  uploadedImages:
    | {
        [formattedFilename: string]: string
      }
    | undefined
): MarkdownRendererOptions => ({
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
    img: (props: any) => {
      if (props.src?.startsWith(UPLOADED_IMAGE_PREFIX)) {
        const formattedFilename = props.src.replace(UPLOADED_IMAGE_PREFIX, '').trim()
        if (uploadedImages && formattedFilename in uploadedImages) {
          return <img src={uploadedImages[formattedFilename]} alt={props.alt} />
        } else {
          return 'Error retrieving the uploaded image!'
        }
      }
      return <img src={props.src || ''} alt={props.alt} />
    },
  },
  className: 'noka-markdown-renderer',
})

type Props = {
  value: string
  options?: (defaultOptions: MarkdownRendererOptions) => MarkdownRendererOptions
  uploadedImages?: {
    [formattedFilename: string]: string
  }
}

export const MarkdownRenderer = ({ value, options, uploadedImages }: Props) => {
  const defaultOptions = DEFAULT_OPTIONS(uploadedImages)
  return (
    <ReactMarkdown {...(options ? options(defaultOptions) : defaultOptions)}>
      {value}
    </ReactMarkdown>
  )
}
