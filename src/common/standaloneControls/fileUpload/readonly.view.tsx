import React from 'react'
import './styles.scss'

import { Icon } from '../../icon'
import { getIcon } from './utils'

type Props = {
  filenames: string[]
}

export const ReadOnlyFileUploader = ({ filenames }: Props) => (
  <div className="file-upload-control readonly">
    <section className="file-list">
      {filenames.map((name, i) => (
        <div className="file" key={`file_${i}`}>
          <div className="file-info">
            <Icon icon={getIcon(name)} size="2x" extraClassName="file-icon" />
            <div className="main">{name}</div>
          </div>
        </div>
      ))}
    </section>
  </div>
)
