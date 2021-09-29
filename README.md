A generic form written in React and Typescript with many features.

View the demo [here](https://nokacreative.github.io/generic-react-form-demo/). The demo's repository can also be found [here](https://github.com/nokacreative/generic-react-form-demo).

# Installation

```
npm i @nokacreative/generic-react-form
```

or

```
yarn add @nokacreative/generic-react-form
```

# Features

- Integrated validation
- Responsive controls and layouts
- Script-based configuration rather than HTML
- Simple customization of styling and messages

# Usage Overview

1. Define your form configuration
2. Define your default form values (can be an empty object)
3. Plug them into `<Form>`

```
import { Form, FormSectionConfig, FormControlType, InputType } from '@nokacreative/generic-react-form'
import '@nokacreative/generic-react-form/dist/index.css' // <-- Must add this for proper styling to work, even if using custom styles

import { emptyModel } from './data'

interface TestFormModel {
  username: string,
  password: string,
  age: number
}

const config: FormSectionConfig<TestFormModel>[] = [
  {
    headerText: 'Login Details',
    controlRows: [
      {
        controls: [
          {
            type: FormControlType.INPUT,
            label: 'Username',
            propertyPath: 'username',
            isRequired: true,
          },
          {
            type: FormControlType.INPUT,
            label: 'Password',
            propertyPath: 'password',
            inputType: InputType.PASSWORD,
            isRequired: true,
          },
          ...
        ]
      }
    ]
  }
]

const App = () => (
  <Form
    sections={config}
    defaultValues={emptyModel}
  />
)
```

Becomes this:

![Form](https://user-images.githubusercontent.com/6403562/122138329-83277100-ce14-11eb-9984-b0f8513100f3.png)
