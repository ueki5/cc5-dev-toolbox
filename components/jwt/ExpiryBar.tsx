'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

type Props = {
  payload: Record<string, unknown>
}

export function ExpiryBar({ payload }: Props) {
  const exp = typeof payload.exp === 'number' ? payload.exp : null
  const iat = typeof payload.iat === 'number' ? payload.iat : null

  const [nowSec] = useState<number>(() => Date.now() / 1000)

  if (exp === null || iat === null) return null
  const isExpired = exp < nowSec
  const rawPercent = ((nowSec - iat) / (exp - iat)) * 100
  const percent = Math.min(100, Math.max(0, rawPercent))

  const barColor = isExpired ? 'bg-red-500' : 'bg-green-500'
  const expDate = new Date(exp * 1000).toLocaleString('ja-JP')

  return (
    <div className="mt-4 space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>有効期限: {expDate}</span>
        {isExpired && (
          <Badge variant="destructive" className="text-xs">
            Expired
          </Badge>
        )}
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: '0%' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
