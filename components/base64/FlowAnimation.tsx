'use client'

import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  text: string
  isPlaying: boolean
  onComplete: () => void
}

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
    },
  },
}

const charVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

export function FlowAnimation({ text, isPlaying, onComplete }: Props) {
  if (!isPlaying) return null

  const chars = text.split('')

  return (
    <AnimatePresence>
      <motion.div
        key={text}
        variants={container}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onComplete}
        className="font-mono text-sm break-all text-foreground/70"
      >
        {chars.map((char, i) => (
          <motion.span key={i} variants={charVariant}>
            {char}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
