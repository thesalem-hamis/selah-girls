import { useEffect, useState } from "react";
import EmailSignup from "./components/EmailSignup";
import HeroSection from "./components/Hero";

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function Sparkle({ className = "", style = {} }) {
  return (
    <span
      className={`text-pink-hot select-none pointer-events-none ${className}`}
      style={style}
      aria-hidden
    >
      ✦
    </span>
  );
}

function FeatureIcon({ type }) {
  const props = {
    className: "feature-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  switch (type) {
    case "star":
      return (
        <svg {...props} className="feature-icon feature-icon--fill">
          <path d="M12 2l2.2 6.8H21l-5.5 4.2 2.2 6.8L12 16.8 6.3 19.8 8.5 13 3 8.8h6.8L12 2z" />
        </svg>
      );
    case "gift":
      return (
        <svg {...props}>
          <rect x="3" y="10" width="18" height="11" rx="1" />
          <path d="M12 10V21M3 10h18M12 10c-2-3-5-3-5-1s2 2 5 1 5-3 5-1-3 0-5 1" />
          <path d="M12 10V6M9 6c0-1.5 1.5-3 3-3s3 1.5 3 3" />
        </svg>
      );
    case "heart":
      return (
        <svg {...props}>
          <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" />
        </svg>
      );
    case "lock":
      return (
        <svg {...props}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    default:
      return null;
  }
}

const TICKER_ITEMS = [
  "LIMITED DROP",
  "GIRLS ONLY",
  "SELAH GIRL SOCIETY",
  "COMING SOON",
  "MADE FOR HER",
];

const FEATURES = [
  { type: "star", title: "BE FIRST.", desc: "Early access to every drop." },
  {
    type: "gift",
    title: "5% OFF.",
    desc: "Exclusive discount for subscribers.",
  },
  { type: "heart", title: "GIRLS ONLY.", desc: "A community that gets you." },
  { type: "lock", title: "NO SPAM.", desc: "Only the good stuff, we promise." },
];

export default function App() {
  const timeLeft = useCountdown("2026-07-01T00:00:00");
  const pad = (n) => String(n).padStart(2, "0");

  const tickerSequence = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="min-h-screen main-bg overflow-x-hidden">
      {/* ===== HERO ===== */}
      <HeroSection />

      {/* ===== MARQUEE ===== */}
      <div className="ticker-wrap">
        <div className="ticker-content">
          {[...tickerSequence, ...tickerSequence].map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
              <span className="ticker-plus">+</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== FAITH APPAREL ===== */}
        {/* ===== FAITH APPAREL ===== */}
      <section className="selah-hero-viewport relative py-8 sm:py-16 px-4 sm:px-0  overflow-hidden">
        <div className=" sm:max-w-5xl  sm:mx-auto">
          <div className="flex flex-row lg:items-stretch gap-10 lg:gap-16 ">
            {/* Left copy */}
            <div className="flex-1 flex-col flex justify-center   lg:max-w-md ">
              <h2 className="headline-section mb-5">
                <span className="block">NOT JUST</span>
                <span className="block">CLOTHING,</span>
                <span className="block text-[#F472B6]">FAITH APPAREL</span>
              </h2>
              <p className="font-josefin  text-[10px] sm:text-sm font-medium text-gray-soft leading-relaxed max-w-sm">
                Wearable declarations of faith. Every piece is designed to
                remind you who you are – a daughter of the Most High – and to
                spark conversations worth having.
              </p>
            </div>

            {/* Right collage */}
            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="relative   w-full max-w-sm lg:max-w-md gallery-collage">
                <img
                  src="/gallery-main.png"
                  alt="Selah Girls faith apparel collage"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Features row */}
          <div className="grid grid-cols-4 gap-6 sm:gap-8 mt-12 sm:mt-14">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex  items-center text-left gap-2">
                <FeatureIcon type={f.type} />
                <div className="flex flex-col">
                  <span className="font-josefin text-[0.3rem]   sm:text-[0.8rem] font-bold text-gray-dark tracking-wider uppercase">
                    {f.title}
                  </span>
                  <span className="font-josefin text-[8px] sm:text-[0.75rem] font-medium text-gray-soft leading-snug ">
                    {f.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COUNTDOWN ===== */}
      <section className="countdown-sky relative py-8 sm:py-20   overflow-hidden">
        <Sparkle className="absolute top-8 left-1/4 text-xs text-gray-500 opacity-60" />
        <Sparkle className="absolute bottom-10 right-1/4 text-sm opacity-70" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="flex justify-center  gap-4" aria-hidden>
            <p className=" countdown-title text-gray-mid uppercase ">
              THE DROP GOES LIVE IN
            </p>
            <svg
              className="w-6 h-6  text-gray-400 opacity-80"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d=" M12 1 L15 10
                  L23 12
                  L15 14
                  L12 23
                  L9 14
                  L1 12
                  L9 10
                  Z

                  M12 9
                  L14 12
                  L12 15
                  L10 12
                  Z
                "
              />
            </svg>
          </div>

          <div className="flex justify-center items-start gap-5 sm:gap-10 lg:gap-14">
            {[
              { value: pad(timeLeft.days), label: "DAYS" },
              { value: pad(timeLeft.hours), label: "HOURS" },
              { value: pad(timeLeft.minutes), label: "MINUTES" },
              { value: pad(timeLeft.seconds), label: "SECONDS" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center min-w-[3.5rem]"
              >
                <span className="countdown-num">{item.value}</span>
                <span className="font-josefin text-[0.55rem] tracking-[0.2em] text-gray-soft uppercase mt-2">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== JOIN THE DROP ===== */}
      <section className=" py-16 sm:py-20 px-3 sm:px-12 lg:px-20 overflow-hidden">
        <Sparkle className="absolute top-12 right-1/3 text-gray-300 text-sm hidden sm:block" />

        <div className="max-w-5xl mx-auto flex flex-row items-center lg:items-center gap-4 lg:gap-8">
          {/* 3D heart */}
          <div className="flex-shrink-0 order-1 lg:order-none">
            <img
              src="/heart2.png"
              alt=""
              className="w-16 sm:w-36 animate-float"
              style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.12))" }}
            />
          </div>

          {/* CTA */}
          <div className="flex-1 text-center  order-2 relative z-10">
            <h2 className="headline-section mb-3">
              <span>JOIN THE </span>
              <span className="text-[#F472B6]">DROP</span>
            </h2>

            <p className="font-josefin text-[0.32rem] sm:text-[0.6rem]  font-medium tracking-[0.2em] text-gray-soft uppercase ml-3 sm:ml-10 mb-6">
              BE FIRST. GET 5% OFF. LIVE THAT SELAH LIFE.
            </p>

            <div className="flex justify-center ">
              <EmailSignup className="signup-form--wide" />
            </div>
          </div>

          {/* Kiss + signature */}
          <div className="flex-shrink-0 order-3 text-center  relative lg:self-end lg:pb-4">
            {/* <span className="kiss-mark block mb-2" aria-hidden>
              💋
            </span>
            <p className="signature-script text-sm sm:text-2xl">Love,</p>
            <p className="signature-script text-sm sm:text-3xl">Selah Girls</p>
            <p className="signature-script text-xs sm:text-xl opacity-90">
              xoxo
            </p> */}
             <img
              src="/kiss2.png"
              alt=""
              className="w-16 sm:w-36"
              // style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.12))" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}