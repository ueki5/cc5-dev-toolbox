'use client'

import { cn } from '@/lib/utils'

type Props = {
  value: string
  onChange: (value: string) => void
  errorLine: number | null
  errorMessage: string | null
}

export function JsonInput({ value, onChange, errorLine, errorMessage }: Props) {
  const hasError = errorLine !== null

  return (
    <div className="flex flex-col gap-2 h-full min-h-0">
      <label className="text-sm font-medium text-muted-foreground shrink-0">入力</label>

      {hasError ? (
        <>
          {/* エラー時: 行ハイライト表示（スクロール可能） */}
          <div className="flex-1 overflow-auto rounded-md border border-red-300 bg-background font-mono text-sm min-h-0">
            {value.split('\n').map((line, i) => {
              const lineNum = i + 1
              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-start px-2 py-0.5 leading-6',
                    lineNum === errorLine && 'bg-red-50 border-l-4 border-red-500'
                  )}
                >
                  <span className="w-8 shrink-0 text-right mr-3 text-muted-foreground/40 select-none text-xs leading-6">
                    {lineNum}
                  </span>
                  <span className="whitespace-pre break-all">{line || ' '}</span>
                </div>
              )
            })}
          </div>

          {/* エラーメッセージ */}
          <div className="shrink-0 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            <span className="font-semibold">Line {errorLine}:</span> {errorMessage}
          </div>

          {/* 編集用 textarea */}
          <textarea
            className="shrink-0 h-32 resize-none rounded-md border border-red-300 bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            placeholder="修正してください..."
          />
        </>
      ) : (
        <textarea
          className="flex-1 resize-none rounded-md border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-0"
          placeholder={'{\n  "key": "value"\n}'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      )}
    </div>
  )
}
