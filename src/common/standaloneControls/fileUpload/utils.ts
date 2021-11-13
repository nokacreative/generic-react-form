import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { FileIcons } from '../../icon'

export function onDragOver(e: React.DragEvent<HTMLDivElement>) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
}

export function onDrop(
  e: React.DragEvent<HTMLElement>,
  existingFiles: File[] | undefined,
  startUpload: (newFiles: File[]) => void,
  setDraggingOver: React.Dispatch<React.SetStateAction<boolean>>
) {
  e.preventDefault()
  setDraggingOver(false)
  const files = e.dataTransfer.files
  if (files.length > 0) {
    const newFiles = Array.from(files)
    const uniqueFiles = existingFiles
      ? newFiles.filter(
          (f) => existingFiles.find((ef) => ef.name === f.name) === undefined
        )
      : newFiles
    startUpload(uniqueFiles)
    e.dataTransfer.clearData()
  }
}

const FILE_SIZE_THRESHOLD = 1000
const FILE_SIZE_UNITS = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

export function formatFileSize(bytes: number) {
  if (Math.abs(bytes) < FILE_SIZE_THRESHOLD) {
    return bytes + ' B'
  }

  let u = -1
  const r = 10 ** 2

  do {
    bytes /= FILE_SIZE_THRESHOLD
    ++u
  } while (
    Math.round(Math.abs(bytes) * r) / r >= FILE_SIZE_THRESHOLD &&
    u < FILE_SIZE_UNITS.length - 1
  )

  return bytes.toFixed(2) + ' ' + FILE_SIZE_UNITS[u]
}

const FILE_EXTENSIONS = {
  image: [
    'jpg',
    'jpeg',
    'jpe',
    'jif',
    'jfif',
    'png',
    'gif',
    'webp',
    'tiff',
    'tif',
    'psd',
    'raw',
    'bmp',
    'heif',
    'indd',
    'dib',
    'arw',
    'cr2',
    'nrw',
    'k25',
    'svg',
    'svgz',
    'ai',
    'eps',
  ],
  video: [
    'webm',
    'mkv',
    'flv',
    'vob',
    'ogv',
    'ogg',
    'rrc',
    'gifv',
    'mng',
    'mov',
    'avi',
    'qt',
    'wmv',
    'yuv',
    'rm',
    'asf',
    'amv',
    'mp4',
    'm4p',
    'm4v',
    'mpg',
    'mp2',
    'mpeg',
    'mpe',
    'mpv',
    'm4v',
    'svi',
    '3gp',
    '3g2',
    'mxf',
    'roq',
    'nsv',
    'flv',
    'f4v',
    'f4p',
    'f4a',
    'f4b',
  ],
  audio: [
    'aac',
    'aiff',
    'ape',
    'au',
    'flac',
    'gsm',
    'it',
    'm3u',
    'm4a',
    'mid',
    'mod',
    'mp3',
    'mpa',
    'pls',
    'ra',
    's3m',
    'sid',
    'wav',
    'wma',
    'xm',
  ],
  archive: [
    '7z',
    'a',
    'ace',
    'apk',
    'ar',
    'arc',
    'bz2',
    'cab',
    'chm',
    'cpio',
    'deb',
    'dmg',
    'ear',
    'egg',
    'epub',
    'gz',
    'iso',
    'jar',
    'lz',
    'lzma',
    'lzo',
    'mar',
    'pea',
    'pet',
    'pkg',
    'rar',
    'rpm',
    's7z',
    'sit',
    'sitx',
    'shar',
    'tar',
    'tbz2',
    'tgz',
    'tlz',
    'txz',
    'war',
    'whl',
    'xpi',
    'xz',
    'zip',
    'zipx',
    'zst',
  ],
  powerpoint: ['ppt', 'odp'],
  word: ['doc', 'docx', 'odt', 'docm', 'dot', 'dotm', 'dotx', 'wps', 'xps'],
  text: [
    'json',
    'txt',
    'log',
    'md',
    'msg',
    'org',
    'ebook',
    'pages',
    'rtf',
    'rst',
    'tex',
    'wpd',
    'wps',
  ],
  excel: [
    'xls',
    'xlsx',
    'xlsm',
    'xlsb',
    'xltx',
    'xltm',
    'xlt',
    'xml',
    'xlam',
    'xla',
    'xlw',
    'xlr',
    'csv',
  ],
}

// Todo add more icons here
export function getIcon(filename: string): IconDefinition {
  const extension = filename.split('.').pop()
  if (extension) {
    const formattedExtension = extension.toLowerCase()
    if (formattedExtension === 'pdf') {
      return FileIcons.Pdf
    }
    if (FILE_EXTENSIONS.powerpoint.includes(formattedExtension)) {
      return FileIcons.Powerpoint
    }
    if (FILE_EXTENSIONS.word.includes(formattedExtension)) {
      return FileIcons.Word
    }
    if (FILE_EXTENSIONS.text.includes(formattedExtension)) {
      return FileIcons.Text
    }
    if (FILE_EXTENSIONS.excel.includes(formattedExtension)) {
      return FileIcons.Excel
    }
    if (FILE_EXTENSIONS.image.includes(formattedExtension)) {
      return FileIcons.Image
    }
    if (FILE_EXTENSIONS.video.includes(formattedExtension)) {
      return FileIcons.Video
    }
    if (FILE_EXTENSIONS.audio.includes(formattedExtension)) {
      return FileIcons.Audio
    }
    if (FILE_EXTENSIONS.archive.includes(formattedExtension)) {
      return FileIcons.Archive
    }
  }
  return FileIcons.Default
}
