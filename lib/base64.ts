export function encode(text: string): string {
  const bytes = new TextEncoder().encode(text)
  const binary = String.fromCharCode(...bytes)
  return btoa(binary)
}

export function decode(base64: string): string {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

export function detectMode(input: string): 'encoded' | 'plain' {
  const trimmed = input.trim()
  if (trimmed.length === 0) return 'plain'
  return /^[A-Za-z0-9+/]+=*$/.test(trimmed) && trimmed.length % 4 === 0
    ? 'encoded'
    : 'plain'
}
