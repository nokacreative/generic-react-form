import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

import './styles.scss'
import { GeneralIcons, Icon } from '../icon'
import { useClickOutside } from '../utils/clickOutside.hook'

type Props = {
  headerText?: string
  icon?: IconDefinition
  children: React.ReactNode
  buttons?: React.ReactNode
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  showCloseButton?: boolean
  closeButtonText?: string
  onClose?: () => void
  width?: number
  className?: string
  id?: string
  closeOnClickOutside?: boolean
}

export const Modal = (props: Props) => {
  const ref = useClickOutside(!!props.closeOnClickOutside, () => props.setOpen(false))
  return (
    <div className={`background-overlay ${props.className || ''}`} id={props.id}>
      <article
        className="modal"
        style={props.width ? { width: props.width } : {}}
        ref={ref}
      >
        <Icon
          icon={GeneralIcons.Close}
          extraClassName="modal-close"
          onClick={() => props.setOpen(false)}
        />
        {(props.headerText || props.icon) && (
          <section className="modal-header">
            {props.icon && <Icon icon={props.icon} size="2x" />}
            <span>{props.headerText}</span>
          </section>
        )}
        <section className="modal-contents">{props.children}</section>
        <section className="modal-footer button-container">
          {props.buttons}
          {props.showCloseButton && (
            <button
              onClick={() => {
                props.setOpen(false)
                if (props.onClose) props.onClose()
              }}
              className="primary"
            >
              {props.closeButtonText || 'Close'}
            </button>
          )}
        </section>
      </article>
    </div>
  )
}
