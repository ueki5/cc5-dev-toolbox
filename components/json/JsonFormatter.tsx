'use client'

import { useState } from 'react'
import { JsonInput } from './JsonInput'
import { JsonOutput } from './JsonOutput'
import { formatJson, minifyJson } from '@/lib/json'
import { Button } from '@/components/ui/button'

type Mode = 'format' | 'minify'

export function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('format')

  const handleInput = (value: string) => {
    setInput(value)
    // 入力変更時にエラーをクリア
    if (errorLine !== null) {
      setErrorLine(null)
      setErrorMessage(null)
    }
  }

  const handleFormat = () => {
    setMode('format')
    const res = formatJson(input)
    if (res.error) {
      setErrorLine(res.error.line)
      setErrorMessage(res.error.message)
      setOutput('')
    } else {
      setErrorLine(null)
      setErrorMessage(null)
      setOutput(res.result)
    }
  }

  const handleMinify = () => {
    setMode('minify')
    try {
      const result = minifyJson(input)
      setErrorLine(null)
      setErrorMessage(null)
      setOutput(result)
    } catch (e) {
      const err = e as SyntaxError
      const res = formatJson(input)
      const line = res.error?.line ?? 1
      setErrorLine(line)
      setErrorMessage(err.message)
      setOutput('')
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-lg font-semibold">JSON 整形</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleFormat}
            variant={mode === 'format' ? 'default' : 'outline'}
            size="sm"
          >
            整形
          </Button>
          <Button
            onClick={handleMinify}
            variant={mode === 'minify' ? 'default' : 'outline'}
            size="sm"
          >
            圧縮
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-4 min-h-0">
        <div className="flex-1 min-h-0">
          <JsonInput
            value={input}
            onChange={handleInput}
            errorLine={errorLine}
            errorMessage={errorMessage}
          />
        </div>
        <div className="flex-1 min-h-0">
          <JsonOutput value={output} />
        </div>
      </div>
    </div>
  )
}
