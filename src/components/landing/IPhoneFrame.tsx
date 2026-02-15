interface Props {
  src: string;
  alt: string;
}

export function IPhoneFrame({ src, alt }: Props) {
  return (
    <div className="relative mx-auto" style={{ width: 280 }}>
      {/* iPhone 17 frame */}
      <div
        className="relative rounded-[3rem] bg-[#1a1a1a] shadow-2xl"
        style={{ padding: '14px 10px', border: '2px solid #2a2a2a' }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center" style={{ top: 10 }}>
          <div className="bg-black rounded-full" style={{ width: 90, height: 24, borderRadius: 14 }} />
        </div>

        {/* Screen */}
        <div className="overflow-hidden rounded-[2.4rem] bg-black" style={{ aspectRatio: '9/19.5' }}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* Glow */}
      <div className="absolute -inset-4 -z-10 rounded-[3.5rem] opacity-25 blur-2xl gold-gradient" />
    </div>
  );
}
