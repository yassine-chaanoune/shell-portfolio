import { motion } from 'framer-motion'

export const Cursor = () => {
  return (
    <motion.span
      aria-hidden
      className="block h-4 w-2 rounded-sm bg-terminal-accent"
      animate={{ opacity: [0, 1, 1] }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
    />
  )
}

