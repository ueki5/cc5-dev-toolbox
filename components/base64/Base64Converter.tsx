'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { DetectionBadge } from './DetectionBadge'
import { FlowAnimation } from './FlowAnimation'
import { encode, decode, detectMode } from '@/lib/base64'

export function Base64Converter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [pendingOutput, setPendingOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mode = detectMode(input)

  function handleEncode() {
    if (!input.trim()) return
    setError(null)
    const result = encode(input)
    setPendingOutput(result)
    setOutput('')
    setIsAnimating(true)
  }

  function handleDecode() {
    if (!input.trim()) return
    try {
      setError(null)
      const result = decode(input.trim())
      setPendingOutput(result)
      setOutput('')
      setIsAnimating(true)
    } catch {
      setError('デコードに失敗しました。有効な Base64 文字列を入力してください。')
    }
  }

  function handleAnimationComplete() {
    setIsAnimating(false)
    setOutput(pendingOutput)
    setPendingOutput('')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Base64 変換</h1>
        <p className="text-muted-foreground text-sm">
          テキストを Base64 にエンコード、または Base64 からデコードします
        </p>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">入力</label>
          {input.trim() && <DetectionBadge mode={mode} />}
        </div>
        <textarea
          className="w-full h-36 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="テキストまたは Base64 文字列を入力..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(null)
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleEncode} disabled={isAnimating || !input.trim()}>
          エンコード
        </Button>
        <Button
          variant="outline"
          onClick={handleDecode}
          disabled={isAnimating || !input.trim()}
        >
          デコード
        </Button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Animation */}
      {isAnimating && (
        <div className="rounded-md border border-input bg-muted/40 px-3 py-2 min-h-[5rem]">
          <FlowAnimation
            text={pendingOutput}
            isPlaying={isAnimating}
            onComplete={handleAnimationComplete}
          />
        </div>
      )}

      {/* Output */}
      <AnimatePresence>
        {!isAnimating && output && (
          <motion.div
            key={output}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium">出力</label>
            <div className="rounded-md border border-input bg-muted/40 px-3 py-2 min-h-[5rem] font-mono text-sm break-all whitespace-pre-wrap">
              {output}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(output)}
            >
              コピー
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
