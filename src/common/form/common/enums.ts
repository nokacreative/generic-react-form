export enum FormControlType {
  INPUT,
  RADIO_GROUP,
  CHECKBOX_GROUP,
  TEXTAREA,
  ATTACHMENT,
  DROPDOWN,
  /** A completely user-defined control that works with the responsive layout system. All non-visual properties such as isRequired are unused; they can be defined manually inside the render function as needed. */
  CUSTOM,
}

export enum ControlRowWidth {
  SMALL = 'small',
  MEDIUM = 'medium',
  MEDIUM_LARGE = 'medLarge',
  LARGE = 'large',
  FULL = 'full',
}

export enum RadioLayout {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  GRID = 'grid',
}
