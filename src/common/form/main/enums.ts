export enum FormActionType {
  SET_VALUE = 'SET_VALUE',
  ADD_ARRAY_VALUE = 'ADD_ARRAY_VALUE',
  REMOVE_ARRAY_VALUE = 'REMOVE_ARRAY_VALUE',
  REMOVE_ARRAY_INDEX = 'REMOVE_ARRAY_INDEX',
  REPLACE_DATA = 'REPLACE_DATA',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
}

export enum ValidationMode {
  LOAD = 1 << 0,
  BLUR = 1 << 1,
  CHANGE = 1 << 2,
  SUBMIT = 1 << 3,
}

export enum ErrorType {
  REQUIRED = 'required',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
  MIN_VALUE = 'min_value',
  MAX_VALUE = 'max_value',
  EMAIL = 'email',
  PHONE = 'phone',
  CUSTOM = 'custom',
  CHECKBOX_REQUIRED = 'checkbox_required',
  CHECKBOX_MIN_SELECTIONS = 'checkbox_min_selections',
  CHECKBOX_MAX_SELECTIONS = 'checkbox_max_selections',
}

export enum PageErrorDisplayMode {
  SHOW_AFTER_SUBMIT = 'show_after_submit',
  SHOW_ON_FIELD_ERROR = 'show_on_field_error',
  HIDE = 'hide',
}

export enum SubmissionErrorScrollMode {
  PAGE_ERROR = 'page_error',
  FIRST_FIELD_WITH_ERROR = 'first_field_with_error',
  NONE = 'none',
}
