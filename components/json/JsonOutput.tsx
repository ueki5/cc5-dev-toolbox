'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

type Props = {
  value: string
}

export function JsonOutput({ value }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-2 h-full min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <label className="text-sm font-medium text-muted-foreground">出力</label>
        {value && (
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 gap-1">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs">コピー済み</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="text-xs">コピー</span>
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto rounded-md border bg-[#1e1e1e] min-h-0">
        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key={value}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  background: 'transparent',
                  fontSize: '0.875rem',
                  minHeight: '100%',
                }}
              >
                {value}
              </SyntaxHighlighter>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full min-h-[200px] text-sm text-muted-foreground"
            >
              整形結果がここに表示されます
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
