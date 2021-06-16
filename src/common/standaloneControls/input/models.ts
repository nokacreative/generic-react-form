import { InputType } from './enums'

export type StandardInputType = Exclude<InputType, InputType.MONEY | InputType.DATE>
