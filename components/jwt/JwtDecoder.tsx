'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { decodeJwt, type JwtParts } from '@/lib/jwt'
import { JwtCard } from './JwtCard'
import { ExpiryBar } from './ExpiryBar'

export function JwtDecoder() {
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState<JwtParts | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleChange(value: string) {
    setToken(value)
    const trimmed = value.trim()
    if (!trimmed) {
      setDecoded(null)
      setError(null)
      return
    }
    try {
      const result = decodeJwt(trimmed)
      setDecoded(result)
      setError(null)
    } catch (e) {
      setDecoded(null)
      setError(e instanceof Error ? e.message : '不正なトークンです')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">JWT デコード</h1>
        <p className="text-muted-foreground text-sm">
          JWT トークンを貼り付けると Header / Payload / Signature に分解します
        </p>
      </div>

      <textarea
        value={token}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        spellCheck={false}
        className="w-full h-28 rounded-lg border bg-background p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
      />

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-destructive text-sm"
          >
            {error}
          </motion.p>
        )}

        {decoded && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <JwtCard title="Header" data={decoded.header} />
              <div className="flex flex-col flex-1 min-w-0 gap-4">
                <JwtCard title="Payload" data={decoded.payload} />
                <ExpiryBar payload={decoded.payload} />
              </div>
              <JwtCard title="Signature" data={decoded.signature} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
