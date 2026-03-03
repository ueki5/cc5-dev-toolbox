type JsonResult =
  | { result: string; error: null }
  | { result: null; error: { message: string; line: number } }

export function formatJson(input: string): JsonResult {
  try {
    const parsed = JSON.parse(input)
    return { result: JSON.stringify(parsed, null, 2), error: null }
  } catch (e) {
    const err = e as SyntaxError
    const line = extractLineNumber(input, err.message)
    return { result: null, error: { message: err.message, line } }
  }
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed)
}

function extractLineNumber(input: string, message: string): number {
  // "at position N" 形式 (V8)
  const posMatch = message.match(/at position (\d+)/)
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10)
    return input.slice(0, pos).split('\n').length
  }

  // "line N column M" 形式 (Firefox / Safari)
  const lineMatch = message.match(/line (\d+)/)
  if (lineMatch) {
    return parseInt(lineMatch[1], 10)
  }

  return 1
}
