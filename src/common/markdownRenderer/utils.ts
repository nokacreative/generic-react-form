export function formatFilenameForMarkdownRenderer(name: string) {
  return name.replace(/ /g, '')
}

export function formatImageDataString(mimeType: string, rawImageData: string) {
  return `data:${mimeType};base64,${rawImageData}`
}
