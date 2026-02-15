import { useEffect, useRef } from 'react';

interface Bean {
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'bean' | 'logo1' | 'logo2';
}

export function CoffeeBeansBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beansRef = useRef<Bean[]>([]);
  const animRef = useRef<number>(0);
  const imagesRef = useRef<{ logo1: HTMLImageElement | null; logo2: HTMLImageElement | null }>({ logo1: null, logo2: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load logo images
    const logo1 = new Image();
    logo1.src = '/images/subday-icon.png';
    logo1.onload = () => { imagesRef.current.logo1 = logo1; };

    const logo2 = new Image();
    // Use the existing header logo
    import('@/assets/logo-subday.png').then((mod) => {
      logo2.src = mod.default;
      logo2.onload = () => { imagesRef.current.logo2 = logo2; };
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const BEAN_COUNT = 16;
    const LOGO_COUNT = 10; // 5 of each logo type

    const createBean = (randomY = false, forceType?: Bean['type']): Bean => {
      let type: Bean['type'] = 'bean';
      if (forceType) {
        type = forceType;
      }
      const isLogo = type !== 'bean';
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : -(isLogo ? 40 : 30),
        size: isLogo ? 22 + Math.random() * 18 : 10 + Math.random() * 10,
        speed: isLogo ? 0.2 + Math.random() * 0.5 : 0.3 + Math.random() * 0.7,
        rotation: isLogo ? 0 : Math.random() * Math.PI * 2,
        rotationSpeed: isLogo ? (Math.random() - 0.5) * 0.01 : (Math.random() - 0.5) * 0.02,
        opacity: isLogo ? 0.15 + Math.random() * 0.1 : 0.06 + Math.random() * 0.06,
        type,
      };
    };

    const items: Bean[] = [];
    for (let i = 0; i < BEAN_COUNT; i++) items.push(createBean(true, 'bean'));
    for (let i = 0; i < LOGO_COUNT / 2; i++) items.push(createBean(true, 'logo1'));
    for (let i = 0; i < LOGO_COUNT / 2; i++) items.push(createBean(true, 'logo2'));
    beansRef.current = items;

    const drawBean = (bean: Bean) => {
      ctx.save();
      ctx.translate(bean.x, bean.y);
      ctx.rotate(bean.rotation);
      ctx.globalAlpha = bean.opacity;

      if (bean.type === 'bean') {
        const w = bean.size * 0.7;
        const h = bean.size;
        ctx.beginPath();
        ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#8B6914';
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.8);
        ctx.quadraticCurveTo(w * 0.3, 0, 0, h * 0.8);
        ctx.strokeStyle = '#6B4F10';
        ctx.lineWidth = 1;
        ctx.globalAlpha = bean.opacity * 0.5;
        ctx.stroke();
      } else {
        const img = bean.type === 'logo1' ? imagesRef.current.logo1 : imagesRef.current.logo2;
        if (img) {
          const s = bean.size * 2;
          ctx.drawImage(img, -s / 2, -s / 2, s, s);
        }
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const bean of beansRef.current) {
        bean.y += bean.speed;
        bean.rotation += bean.rotationSpeed;

        if (bean.y > canvas.height + 50) {
          Object.assign(bean, createBean(false, bean.type));
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
