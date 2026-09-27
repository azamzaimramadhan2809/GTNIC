'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none'

interface MotionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: RevealDirection
  distance?: number
  amount?: number
}

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
}

export default function MotionReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 28,
  amount = 0.18,
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion()
  const offset = offsets[direction]
  const x = offset.x === 0 ? 0 : Math.sign(offset.x) * distance
  const y = offset.y === 0 ? 0 : Math.sign(offset.y) * distance

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, x, y, scale: 0.985 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
