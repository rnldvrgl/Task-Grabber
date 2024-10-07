'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useState } from 'react'

interface Props {
  children: React.ReactNode
  withSparkles?: boolean
  size?: 'sm' | 'md' | 'lg' // Size prop for small, medium, large
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm', // Small size
  md: 'px-6 py-3 text-base', // Medium size
  lg: 'px-10 py-4 text-lg', // Large size
}

const SecondBrain = ({
  children,
  withSparkles = false,
  size = 'md',
}: Props) => {
  const [hovering, setHovering] = useState(false)

  return (
    <div className="h-full center">
      <motion.button
        whileHover={{
          scale: 1.3,
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={cn(
          'bg-primary text-white z-0 relative outline-none border-none text-primary-foreground font-medium rounded-xl overflow-hidden hover:shadow-[0_0_10px] hover:shadow-primary/90',
          sizeClasses[size],
        )}
      >
        <span className="flex gap-2 items-center z-10 tracking-tight">
          {withSparkles && (
            <span>
              <Sparkles
                className="h-4 w-4"
                fill="white"
              />
            </span>
          )}
          {children}
        </span>

        <span className="absolute inset-0 top-0 left-0 -translate-x-0 -translate-y-0 shadow-[0_0_10px_inset] -z-10 shadow-primary/80 rounded-xl"></span>

        <span
          className={cn(
            'absolute w-8 h-[200%] bg-indigo-100/10 -top-1/2 -left-5 -z-[20] rotate-12 transition-all duration-300',
            hovering && 'left-[90%]',
          )}
        />
      </motion.button>
    </div>
  )
}

export default SecondBrain
