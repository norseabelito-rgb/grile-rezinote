"use client"

import { motion, type Variant } from "framer-motion"
import type { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  once?: boolean
}

const directionMap: Record<string, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
  none: {},
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance,
  once = true,
}: FadeInProps) {
  const dir = directionMap[direction]
  const hidden: Variant = {
    opacity: 0,
    ...(dir.x !== undefined && { x: distance ?? dir.x }),
    ...(dir.y !== undefined && { y: distance ?? dir.y }),
  }
  const visible: Variant = {
    opacity: 1,
    x: 0,
    y: 0,
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  )
}
