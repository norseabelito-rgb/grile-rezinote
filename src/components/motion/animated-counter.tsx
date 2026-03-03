"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useMotionValue, useSpring, motion } from "framer-motion"

interface AnimatedCounterProps {
  value: number | string
  className?: string
  duration?: number
}

export function AnimatedCounter({
  value,
  className,
  duration = 1.5,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  const numericPart = typeof value === "string" ? parseFloat(value) || 0 : value
  const suffix = typeof value === "string" ? value.replace(/[\d.]/g, "") : ""

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericPart)
    }
  }, [isInView, motionValue, numericPart])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (Number.isInteger(numericPart)) {
        setDisplay(Math.round(latest).toString())
      } else {
        setDisplay(latest.toFixed(1))
      }
    })
    return unsubscribe
  }, [springValue, numericPart])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {display}{suffix}
    </motion.span>
  )
}
