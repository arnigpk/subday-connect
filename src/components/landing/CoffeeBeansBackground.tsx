import { useEffect, useRef } from 'react';

interface Bean {
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export function CoffeeBeansBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beansRef = useRef<Bean[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const BEAN_COUNT = 18;

    const createBean = (randomY = false): Bean => ({
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : -30,
      size: 10 + Math.random() * 10,
      speed: 0.3 + Math.random() * 0.7,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.06 + Math.random() * 0.06,
    });

    beansRef.current = Array.from({ length: BEAN_COUNT }, () => createBean(true));

    const drawBean = (bean: Bean) => {
      ctx.save();
      ctx.translate(bean.x, bean.y);
      ctx.rotate(bean.rotation);
      ctx.globalAlpha = bean.opacity;

      const w = bean.size * 0.7;
      const h = bean.size;

      // Bean shape
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#8B6914';
      ctx.fill();

      // Center line
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.8);
      ctx.quadraticCurveTo(w * 0.3, 0, 0, h * 0.8);
      ctx.strokeStyle = '#6B4F10';
      ctx.lineWidth = 1;
      ctx.globalAlpha = bean.opacity * 0.5;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const bean of beansRef.current) {
        bean.y += bean.speed;
        bean.rotation += bean.rotationSpeed;

        if (bean.y > canvas.height + 30) {
          Object.assign(bean, createBean(false));
        }

        drawBean(bean);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
