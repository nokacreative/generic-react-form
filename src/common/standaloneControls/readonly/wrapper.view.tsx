import { NOKA_COLORS_CLASS } from '../../../assets/constants'

type Props = {
  children: React.ReactNode
}

export const ReadOnlyControlWrapper = ({ children }: Props) => (
  <div className={`${NOKA_COLORS_CLASS} readonly-control-wrapper`}>{children}</div>
)
