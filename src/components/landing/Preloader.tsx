import { motion, AnimatePresence } from 'framer-motion';
import logoSubday from '@/assets/logo-subday.png';

interface Props {
  show: boolean;
}

const beanPositions = [
  { x: -60, y: -80, delay: 0, rotate: 30 },
  { x: 70, y: -50, delay: 0.15, rotate: -45 },
  { x: 80, y: 40, delay: 0.3, rotate: 60 },
  { x: -70, y: 60, delay: 0.45, rotate: -30 },
  { x: 0, y: -100, delay: 0.1, rotate: 15 },
  { x: 0, y: 100, delay: 0.35, rotate: -60 },
];

function CoffeeBean({ x, y, delay, rotate }: { x: number; y: number; delay: number; rotate: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: '50%', top: '50%' }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        x,
        y,
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.5],
        rotate,
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
        <ellipse cx="9" cy="12" rx="8" ry="11" fill="hsl(var(--primary))" opacity="0.85" />
        <path
          d="M9 2C9 2 6 8 6 12C6 16 9 22 9 22"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </motion.div>
  );
}

export function Preloader({ show }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="relative flex flex-col items-center">
            {/* Floating coffee beans */}
            {beanPositions.map((bean, i) => (
              <CoffeeBean key={i} {...bean} />
            ))}

            {/* Logo with pulse */}
            <motion.img
              src={logoSubday}
              alt="subday"
              className="h-16 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: [0.8, 1.05, 1] }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />

            {/* Loading bar */}
            <motion.div
              className="mt-8 h-0.5 rounded-full bg-primary/20 w-32 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.85, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
