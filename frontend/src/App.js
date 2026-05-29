import { useEffect, useRef, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/0453ddb9-3c51-424b-84d2-04ec7caf3ec6/images/27633724d7af2f3ddfae519d9ebf462fa528fa1f6f7bb2080587559bcafb6dbb.png";

const PORTFOLIO = [
  {
    num: "01",
    title: "SkyForge Roofing",
    category: "Commercial Roofing · GTA",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHx3ZWIlMjBkZXNpZ24lMjBtb2NrdXAlMjBkYXJrfGVufDB8fHx8MTc4MDAxMDk0NHww&ixlib=rb-4.1.0&q=85",
    href: "/skyforge/",
    live: true,
  },
  {
    num: "02",
    title: "North Atlas",
    category: "Boutique Consultancy",
    img: "https://images.pexels.com/photos/6625655/pexels-photo-6625655.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    num: "03",
    title: "Field Notes",
    category: "Service-based Brand",
    img: "https://images.unsplash.com/photo-1707836885254-79b6e3d7b18d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBtb2NrdXAlMjBkYXJrfGVufDB8fHx8MTc4MDAxMDk0NHww&ixlib=rb-4.1.0&q=85",
  },
];

/* ============ HEADER ============ */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Work", href: "#work" },
    { label: "Packs", href: "#packs" },
    { label: "Calculator", href: "#calculator" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-24 flex items-center justify-between">
        <a
          href="#top"
          data-testid="brand-link"
          className="flex items-center group"
        >
          <img
            src="https://customer-assets.emergentagent.com/job_akron-digital/artifacts/i47kudt6_Akron%20Digital%20Logo.png"
            alt="Akron"
            className="h-20 md:h-24 w-auto object-contain"
          />
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              data-testid={`nav-${l.label.toLowerCase()}`}
              href={l.href}
              className="link-underline text-sm text-white/80 hover:text-white font-body"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          data-testid="header-cta"
          className="hidden md:inline-flex btn-primary px-5 py-2.5 text-sm font-medium tracking-wide"
        >
          Start a Project
        </a>

        <button
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d={open ? "M6 6L18 18M6 18L18 6" : "M3 6H21M3 12H21M3 18H21"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black/95 border-t border-white/5 px-6 py-6 space-y-4">
          {links.map((l) => (
            <a
              key={l.href}
              data-testid={`mobile-nav-${l.label.toLowerCase()}`}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-white/80 hover:text-white font-display text-2xl"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            data-testid="mobile-header-cta"
            onClick={() => setOpen(false)}
            className="inline-flex btn-primary px-5 py-3 text-sm mt-4"
          >
            Start a Project
          </a>
        </div>
      )}
    </header>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative min-h-screen flex items-end overflow-hidden grain"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-20 md:pb-28 pt-32 w-full">
        <div className="reveal reveal-delay-1 flex items-center gap-3 mb-8">
          <span className="w-8 h-px bg-white/50" />
          <span className="section-num">Akron Digital — Est. GTA</span>
        </div>

        <h1
          data-testid="hero-headline"
          className="reveal reveal-delay-2 font-display font-black tracking-tighter leading-[0.92] text-white text-[12vw] md:text-[8.5vw] lg:text-[7.5vw] max-w-6xl"
        >
          Designed in silence.
          <br />
          <span className="text-white/55">Built to be </span>
          <span className="italic font-medium">remembered</span>
          <span className="text-[#1E3A8A]">.</span>
        </h1>

        <div className="reveal reveal-delay-3 mt-10 max-w-xl">
          <p className="text-white/70 text-lg md:text-xl leading-relaxed font-body">
            We build modern websites for service-based businesses that need to
            look as serious as they are. No templates. No filler. Just sharp
            design that converts.
          </p>
        </div>

        <div className="reveal reveal-delay-4 mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#packs"
            data-testid="hero-cta-packs"
            className="btn-primary px-7 py-4 text-sm font-medium tracking-wide inline-flex items-center gap-3"
          >
            See Website Packs
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </a>
          <a
            href="#calculator"
            data-testid="hero-cta-calculator"
            className="btn-ghost px-7 py-4 text-sm font-medium tracking-wide"
          >
            Calculate Your ROI
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-3 text-white/60">
        <span className="section-num">Scroll</span>
        <span className="w-px h-10 bg-white/30" />
      </div>
    </section>
  );
}

/* ============ MARQUEE ============ */
function Marquee() {
  const items = [
    "Web Design",
    "Service Businesses",
    "Conversion Focus",
    "Mobile-First",
    "GTA Ontario",
    "Built In-House",
    "Premium Craft",
    "AI-Ready",
  ];
  const loop = [...items, ...items];
  return (
    <div className="border-y border-white/5 bg-black py-8 overflow-hidden marquee-mask">
      <div className="marquee-track flex whitespace-nowrap will-change-transform">
        {loop.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-12 px-6 font-display font-medium text-white/60 text-3xl md:text-5xl tracking-tight"
          >
            <span>{t}</span>
            <span className="text-[#1E3A8A]">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ PORTFOLIO ============ */
function Portfolio() {
  return (
    <section
      id="work"
      data-testid="portfolio-section"
      className="relative py-24 md:py-32 bg-black"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between gap-8 mb-16 md:mb-24 flex-wrap">
          <div>
            <div className="section-num mb-4">01 / Selected Work</div>
            <h2 className="font-display font-bold tracking-tighter text-5xl md:text-7xl leading-[0.95]">
              The proof <br />
              <span className="text-white/40">is the product.</span>
            </h2>
          </div>
          <p className="max-w-md text-white/60 font-body text-base md:text-lg">
            A small sample of recent builds — handcrafted for service-based
            operators who refuse to look like everyone else.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {PORTFOLIO.map((item, idx) => (
            <div
              key={item.num}
              data-testid={`portfolio-item-${item.num}`}
              className={`group relative ${
                idx % 2 === 0 ? "mr-auto" : "ml-auto"
              } max-w-3xl`}
            >
              <PortfolioFrame item={item} />

              <div className="flex items-end justify-between mt-5">
                <div>
                  <div className="font-display font-bold text-2xl md:text-3xl tracking-tight">
                    {item.title}
                  </div>
                  <div className="text-white/55 mt-1 text-sm font-body">
                    {item.category}
                  </div>
                </div>
                {item.live ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`portfolio-open-${item.num}`}
                    className="group/cta inline-flex items-center gap-3 text-sm tracking-wide font-medium px-5 py-3 border border-white/20 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors"
                  >
                    Open Site
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform"
                    >
                      <path
                        d="M7 17L17 7M17 7H8M17 7V16"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </a>
                ) : (
                  <div className="text-xs font-mono text-white/40 tracking-widest uppercase">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioFrame({ item }) {
  const wrapRef = useRef(null);
  const DEVICE_W = 1440;
  const DEVICE_H = 900;

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const apply = () => {
      const w = el.clientWidth;
      const s = w / DEVICE_W;
      el.style.setProperty("--frame-scale", s);
      el.style.height = `${DEVICE_H * s}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden border border-white/10 tilt bg-[#0a0a0d] w-full"
    >
      {item.live ? (
        <iframe
          title={item.title}
          src={item.href}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          style={{
            width: `${DEVICE_W}px`,
            height: `${DEVICE_H}px`,
            transform: "scale(var(--frame-scale, 1))",
            transformOrigin: "top left",
          }}
          className="absolute top-0 left-0 bg-black border-0"
        />
      ) : (
        <div className="aspect-[16/10] relative">
          <img
            src={item.img}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>
      )}

      <div className="absolute top-0 inset-x-0 flex items-start justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10">
        <div className="section-num text-white/80">{item.num} / Project</div>
        <div className="section-num text-white/60 hidden md:block">
          {item.live ? "Live Preview · 1440×900" : "Coming Soon"}
        </div>
      </div>
    </div>
  );
}
/* ============ WEBSITE PACKS ============ */
function Packs() {
  const packs = [
    {
      id: "standard",
      price: "$299",
      name: "Standard",
      tag: "One-time",
      summary:
        "A focused one-pager that earns trust and books calls. Perfect launch point.",
      features: [
        "One-Page Website",
        "Services Section",
        "Work Photos",
        "Reviews",
        "Contact Information",
        "Contact Form",
        "Mobile-Friendly Design",
      ],
    },
    {
      id: "premium",
      price: "$799",
      name: "Premium",
      tag: "One-time · Most Popular",
      summary:
        "A full multi-page site with custom design and SEO. Built to outclass competitors.",
      features: [
        "Home Page",
        "Services Page",
        "Our Work Page",
        "About Us Page",
        "Contact Page",
        "Modern Custom Design",
        "Enhanced User Experience",
        "Work Photos / Portfolio",
        "Reviews",
        "Contact Form",
        "Mobile-Friendly Design",
        "Basic SEO Setup",
      ],
      highlighted: true,
    },
    {
      id: "monthly",
      price: "$75",
      priceSuffix: "/mo",
      name: "Monthly Care",
      tag: "Subscription",
      summary:
        "Keep your site sharp, fast and protected. Add live AI chat & Google reviews.",
      features: [
        "AI Assistant Chat",
        "Live Google Reviews",
        "Domain Management",
        "Website Updates",
        "Security Monitoring",
        "Website Backups",
        "Analytics Reports",
        "Priority Support",
      ],
    },
  ];

  return (
    <section
      id="packs"
      data-testid="packs-section"
      className="relative py-24 md:py-32 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-16 md:mb-24">
          <div className="section-num mb-4">02 / Website Packs</div>
          <h2 className="font-display font-bold tracking-tighter text-5xl md:text-7xl leading-[0.95]">
            Pick a pack. <br />
            <span className="text-white/40">We do the rest.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 border border-white/10">
          {packs.map((p) => (
            <div
              key={p.id}
              data-testid={`pack-card-${p.id}`}
              className={`relative p-8 md:p-10 border-white/10 md:border-r last:md:border-r-0 border-b last:border-b-0 md:border-b-0 transition-colors ${
                p.highlighted
                  ? "bg-gradient-to-b from-[#0c0f1f] to-[#070709]"
                  : "bg-[#08080a] hover:bg-[#0a0a0d]"
              }`}
            >
              {p.highlighted && (
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E3A8A] to-transparent" />
              )}
              <div className="flex items-center justify-between mb-8">
                <div className="section-num">{p.tag}</div>
                {p.highlighted && (
                  <div className="px-2 py-1 text-[10px] tracking-widest font-mono uppercase border border-[#1E3A8A] text-[#3b82f6]">
                    Popular
                  </div>
                )}
              </div>
              <div className="font-display font-bold text-3xl mb-2">
                {p.name}
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display font-black text-6xl tracking-tighter">
                  {p.price}
                </span>
                {p.priceSuffix && (
                  <span className="text-white/50 font-body">
                    {p.priceSuffix}
                  </span>
                )}
              </div>
              <p className="text-white/60 mb-8 font-body leading-relaxed">
                {p.summary}
              </p>
              <ul className="space-y-3 mb-10">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-white/85 font-body text-sm"
                  >
                    <span className="mt-2 w-1.5 h-1.5 bg-[#1E3A8A] flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                data-testid={`pack-cta-${p.id}`}
                onClick={() => {
                  try {
                    sessionStorage.setItem("akron_selected_pack", p.name);
                    window.dispatchEvent(
                      new CustomEvent("akron:pack-selected", {
                        detail: p.name,
                      }),
                    );
                  } catch (e) {
                    /* noop */
                  }
                }}
                className={`block w-full text-center px-5 py-3.5 text-sm font-medium tracking-wide transition-all ${
                  p.highlighted
                    ? "btn-primary"
                    : "btn-ghost hover:border-white/70"
                }`}
              >
                Get {p.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ CONVERSION RATE CALCULATOR ============ */
function Calculator() {
  const [visitors, setVisitors] = useState(500);
  const [conversion, setConversion] = useState(5);
  const [jobPrice, setJobPrice] = useState(10000);
  const cardRef = useRef(null);

  const clients = Math.round((visitors * conversion) / 100);
  const monthly = clients * jobPrice;
  const yearly = monthly * 12;

  const fmt = (n) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(n);

  const onMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    cardRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      id="calculator"
      data-testid="calculator-section"
      className="relative py-24 md:py-32 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="section-num mb-4">03 / Conversion Calculator</div>
            <h2 className="font-display font-bold tracking-tighter text-5xl md:text-6xl leading-[0.95]">
              What a real <br />
              website is <br />
              <span className="text-[#3b82f6]">worth.</span>
            </h2>
            <p className="text-white/60 mt-8 max-w-md font-body leading-relaxed">
              Plug in your numbers. See what a properly converting website could
              add to your bottom line each month — and each year.
            </p>
          </div>

          <div
            ref={cardRef}
            onMouseMove={onMove}
            data-testid="calculator-card"
            className="lg:col-span-7 glow-card p-8 md:p-10"
          >
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <Field
                label="Monthly Visitors"
                value={visitors}
                onChange={setVisitors}
                min={10}
                max={50000}
                step={10}
                suffix="visitors"
                testid="input-visitors"
              />
              <Field
                label="Conversion Rate · 2–5% avg"
                value={conversion}
                onChange={setConversion}
                min={0.1}
                max={50}
                step={0.1}
                suffix="%"
                decimals={1}
                testid="input-conversion"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Average Job Price"
                  value={jobPrice}
                  onChange={setJobPrice}
                  min={50}
                  max={500000}
                  step={50}
                  prefix="$"
                  testid="input-job-price"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <div className="section-num mb-6">Projected Revenue</div>
              <div className="grid sm:grid-cols-3 gap-6">
                <Stat
                  label="New Clients / mo"
                  value={`${clients}`}
                  testid="stat-clients"
                />
                <Stat
                  label="Revenue / mo"
                  value={fmt(monthly)}
                  testid="stat-monthly"
                  accent
                />
                <Stat
                  label="Revenue / yr"
                  value={fmt(yearly)}
                  testid="stat-yearly"
                />
              </div>

              <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
                <div className="font-mono text-xs text-white/50">
                  <span className="text-[#3b82f6]">●</span> Live calculation
                  <span className="blink ml-1">_</span>
                </div>
                <a
                  href="#contact"
                  data-testid="calculator-cta"
                  className="btn-primary px-6 py-3 text-sm font-medium tracking-wide"
                >
                  Let's Build It
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  testid,
}) {
  const [raw, setRaw] = useState(String(value));

  useEffect(() => {
    // sync from parent only if it actually differs from the parsed buffer
    const parsed = raw === "" ? 0 : Number(raw);
    if (parsed !== value) setRaw(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handle = (e) => {
    const v = e.target.value;
    setRaw(v);
    if (v === "" || v === "-") {
      onChange(0);
      return;
    }
    const num = Number(v);
    if (!Number.isNaN(num)) onChange(num);
  };

  const handleBlur = () => {
    if (raw === "" || raw === "-") setRaw("0");
  };

  return (
    <label className="block">
      <div className="section-num mb-3">{label}</div>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-display text-2xl pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          data-testid={testid}
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={handle}
          onBlur={handleBlur}
          style={{
            paddingLeft: prefix ? "44px" : undefined,
            paddingRight: suffix ? "80px" : undefined,
          }}
          className="akron-input font-display text-2xl"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-mono text-xs uppercase tracking-widest pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function Stat({ label, value, accent, testid }) {
  return (
    <div data-testid={testid}>
      <div className="section-num mb-2">{label}</div>
      <div
        className={`ticker font-display font-bold text-3xl md:text-4xl tracking-tight ${
          accent ? "text-[#3b82f6]" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/* ============ ABOUT ============ */
function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative py-24 md:py-32 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="section-num mb-4">04 / Why Akron</div>
          <h2 className="font-display font-bold tracking-tighter text-5xl md:text-7xl leading-[0.92]">
            Built for the <br />
            <span className="italic font-medium">underestimated.</span>
          </h2>
        </div>
        <div className="lg:col-span-7 lg:pt-8">
          <p className="text-white/80 text-xl md:text-2xl leading-relaxed font-body">
            Akron Digital is a small, ruthless studio out of the GTA that builds
            websites for{" "}
            <span className="text-white">service-based businesses</span> —
            trades, clinics, consultants, salons and operators who do real work
            and need a site that earns real trust.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 gap-8">
            {[
              {
                k: "01",
                t: "No templates",
                d: "Every site is designed for your brand and your customer.",
              },
              {
                k: "02",
                t: "Built to convert",
                d: "Sharp copy, fast load, clear CTAs. Booked calls, not pretty pixels.",
              },
              {
                k: "03",
                t: "Local & responsive",
                d: "GTA based. We pick up the phone. We move fast.",
              },
              {
                k: "04",
                t: "Care after launch",
                d: "Optional monthly plan keeps your site protected and improving.",
              },
            ].map((b) => (
              <div
                key={b.k}
                className="border-t border-white/10 pt-5"
                data-testid={`about-pillar-${b.k}`}
              >
                <div className="section-num mb-3">{b.k}</div>
                <div className="font-display font-bold text-xl mb-2">
                  {b.t}
                </div>
                <div className="text-white/60 font-body text-sm leading-relaxed">
                  {b.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CONTACT ============ */
function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    package: "",
    business_name: "",
    has_website: "",
  });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  useEffect(() => {
    try {
      const sel = sessionStorage.getItem("akron_selected_pack");
      if (sel) setForm((f) => ({ ...f, package: sel }));
    } catch (e) {
      /* noop */
    }
    const onPick = (e) => {
      const name = e?.detail || "";
      if (name) setForm((f) => ({ ...f, package: name }));
    };
    window.addEventListener("akron:pack-selected", onPick);
    return () => window.removeEventListener("akron:pack-selected", onPick);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setStatus({
        state: "error",
        msg: "Please fill name and email.",
      });
      return;
    }
    setStatus({ state: "loading", msg: "Opening your email..." });

    // Save lead silently in DB (best effort)
    axios.post(`${API}/contact`, form).catch(() => {});

    // Build a genuine, human-sounding email body
    const sentences = [];
    const firstName = (form.name || "").trim().split(/\s+/)[0] || form.name;

    let intro = `My name is ${form.name}`;
    if (form.business_name) intro += ` and I run ${form.business_name}`;
    intro += ".";
    sentences.push(intro);

    if (form.has_website === "Yes") {
      sentences.push("I already have a website but I'm looking to redo it.");
    } else if (form.has_website === "No") {
      sentences.push("I don't have a website yet and I'm looking to get one built.");
    }

    if (form.package) {
      if (form.package === "Not sure yet") {
        sentences.push("I'm not sure yet which package fits best — would love your advice.");
      } else {
        sentences.push(`I'm interested in your ${form.package} package.`);
      }
    }

    let openingPara = sentences.join(" ");

    const messagePara = form.message ? form.message.trim() : "";

    const contactBits = [];
    contactBits.push(`Email: ${form.email}`);
    if (form.phone) contactBits.push(`Phone: ${form.phone}`);

    const bodyLines = [
      "Hi Akron Digital,",
      "",
      openingPara,
    ];
    if (messagePara) {
      bodyLines.push("", messagePara);
    }
    bodyLines.push(
      "",
      "Looking forward to hearing from you.",
      "",
      "Thanks,",
      firstName,
      "",
      ...contactBits,
    );

    const body = bodyLines.join("\n");

    const subject = `Website Form — ${form.business_name || form.name}`;
    const mailto =
      `https://mail.google.com/mail/?view=cm` +
      `&to=${encodeURIComponent("Goncaloc007@gmail.com")}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.open(mailto, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      setStatus({
        state: "success",
        msg: "Gmail opened in a new tab — just hit send.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        package: "",
        business_name: "",
        has_website: "",
      });
      try {
        sessionStorage.removeItem("akron_selected_pack");
      } catch (e) {
        /* noop */
      }
    }, 600);
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-24 md:py-32 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="section-num mb-4">05 / Start a Project</div>
          <h2 className="font-display font-bold tracking-tighter text-5xl md:text-7xl leading-[0.92]">
            Let's build <br />
            something <br />
            <span className="text-[#3b82f6]">sharp.</span>
          </h2>

          <div className="mt-12 space-y-6">
            <div>
              <div className="section-num mb-2">Email</div>
              <a
                href="mailto:contact@akrondigital.com"
                data-testid="contact-email"
                className="font-display text-xl md:text-2xl link-underline"
              >
                contact@akrondigital.com
              </a>
            </div>
            <div>
              <div className="section-num mb-2">Phone</div>
              <a
                href="tel:+16477455082"
                data-testid="contact-phone"
                className="font-display text-xl md:text-2xl link-underline"
              >
                647-745-5082
              </a>
            </div>
            <div>
              <div className="section-num mb-2">Location</div>
              <div className="font-display text-xl md:text-2xl">
                GTA, Ontario
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          data-testid="contact-form"
          className="lg:col-span-7 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <div className="section-num mb-3">Name</div>
              <input
                data-testid="contact-name"
                className="akron-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div>
              <div className="section-num mb-3">Email</div>
              <input
                data-testid="contact-email-input"
                className="akron-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@business.com"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <div className="section-num mb-3">Business Name</div>
              <input
                data-testid="contact-business-input"
                className="akron-input"
                value={form.business_name}
                onChange={(e) =>
                  setForm({ ...form, business_name: e.target.value })
                }
                placeholder="e.g. Goncalo Landscaping"
              />
            </div>
            <div>
              <div className="section-num mb-3">Already Have a Website?</div>
              <div className="flex gap-3">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    data-testid={`contact-has-website-${opt.toLowerCase()}`}
                    onClick={() => setForm({ ...form, has_website: opt })}
                    className={`flex-1 px-5 py-[14px] text-sm font-medium tracking-wide border transition-all ${
                      form.has_website === opt
                        ? "btn-primary"
                        : "bg-[#0a0a0d] border-white/10 text-white/70 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <div className="section-num mb-3">Phone (optional)</div>
              <input
                data-testid="contact-phone-input"
                className="akron-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(647) 555-0123"
              />
            </div>
            <div>
              <div className="section-num mb-3">Interested In</div>
              <select
                data-testid="contact-package-input"
                className="akron-input"
                value={form.package}
                onChange={(e) => setForm({ ...form, package: e.target.value })}
              >
                <option value="">Select a pack...</option>
                <option value="Standard">Standard — $299</option>
                <option value="Premium">Premium — $799</option>
                <option value="Monthly Care">Monthly Care — $75/mo</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </div>
          </div>
          <div>
            <div className="section-num mb-3">Message (optional)</div>
            <textarea
              data-testid="contact-message"
              rows={6}
              className="akron-input resize-none"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us about your business and what you need..."
            />
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            <div
              data-testid="contact-status"
              className={`font-mono text-xs ${
                status.state === "success"
                  ? "text-[#3b82f6]"
                  : status.state === "error"
                    ? "text-red-400"
                    : "text-white/50"
              }`}
            >
              {status.msg || "Opens Gmail pre-filled in a new tab. You hit send."}
            </div>
            <button
              data-testid="contact-submit"
              type="submit"
              disabled={status.state === "loading"}
              className="btn-primary px-8 py-4 text-sm font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.state === "loading" ? "Opening..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-black border-t border-white/5 pt-20 pb-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-7">
            <div className="section-num mb-6">Akron Digital · GTA Ontario</div>
            <a
              href="mailto:contact@akrondigital.com"
              className="block link-underline font-display text-2xl md:text-3xl"
              data-testid="footer-email"
            >
              contact@akrondigital.com
            </a>
            <a
              href="tel:+16477455082"
              className="block link-underline font-display text-2xl md:text-3xl mt-2"
              data-testid="footer-phone"
            >
              647-745-5082
            </a>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <div className="section-num mb-4">Sitemap</div>
              <ul className="space-y-2 font-body">
                <li>
                  <a href="#work" className="text-white/70 hover:text-white">
                    Work
                  </a>
                </li>
                <li>
                  <a href="#packs" className="text-white/70 hover:text-white">
                    Packs
                  </a>
                </li>
                <li>
                  <a
                    href="#calculator"
                    className="text-white/70 hover:text-white"
                  >
                    Calculator
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-white/70 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-white/70 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="section-num mb-4">Studio</div>
              <ul className="space-y-2 font-body">
                <li className="text-white/70">GTA · Ontario</li>
                <li className="text-white/70">Mon–Fri · 9–6 EST</li>
                <li className="text-white/70">By appointment</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-10 mt-10 border-t border-white/10 text-white/40 text-xs font-mono">
          <div>© {new Date().getFullYear()} Akron Digital. All rights reserved.</div>
          <div>Crafted in the GTA</div>
        </div>
      </div>
    </footer>
  );
}

/* ============ CHATBOT WIDGET ============ */
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId] = useState(() => {
    try {
      const k = "akron_chat_session";
      let v = localStorage.getItem(k);
      if (!v) {
        v = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem(k, v);
      }
      return v;
    } catch (e) {
      return `s_${Date.now()}`;
    }
  });
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey — I help out around here. What can I tell you about?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: text,
      });
      const reply = res.data?.reply || "Hmm, no response. Try again?";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "I couldn't connect. Try emailing contact@akrondigital.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-[60]">
      {open && (
        <div
          data-testid="chat-panel"
          className="chat-pop mb-3 w-[92vw] max-w-sm bg-[#08080a] border border-white/10 shadow-2xl shadow-[#1E3A8A]/10 flex flex-col"
          style={{ height: "min(560px, 75vh)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#1E3A8A] animate-pulse" />
              <div>
                <div className="font-display font-bold text-sm">
                  Akron Assistant
                </div>
                <div className="section-num">Online · Claude AI</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              data-testid="chat-close"
              className="text-white/60 hover:text-white"
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                data-testid={`chat-msg-${m.role}`}
                className={`max-w-[85%] px-3 py-2 text-sm font-body leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-[#1E3A8A] text-white"
                    : "mr-auto bg-white/5 border border-white/10 text-white/90"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/60">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3 flex items-center gap-2">
            <input
              data-testid="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about pricing, timelines..."
              className="akron-input flex-1 !py-2.5 text-sm"
            />
            <button
              data-testid="chat-send"
              onClick={send}
              disabled={loading || !input.trim()}
              className="btn-primary px-4 py-2.5 disabled:opacity-50"
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        data-testid="chat-toggle"
        onClick={() => setOpen(!open)}
        className="group relative w-16 h-16 bg-[#1E3A8A] flex items-center justify-center shadow-[0_0_48px_rgba(30,58,138,0.55)] hover:shadow-[0_0_72px_rgba(30,58,138,0.8)] transition-all"
        aria-label="Open chat"
      >
        <span className="absolute inset-0 bg-[#1E3A8A] animate-ping opacity-20" />
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="white"
              strokeWidth="1.8"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              stroke="white"
              strokeWidth="1.6"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

/* ============ APP ============ */
function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Portfolio />
        <Packs />
        <Calculator />
        <About />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default App;
