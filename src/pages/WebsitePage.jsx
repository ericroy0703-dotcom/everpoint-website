import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logoStackedSrc from "../assets/logo/everpoint-stacked.png";
import logoMarkSrc from "../assets/logo/everpoint-mark.png";
import { buildProductUrl, PORTAL_LOGIN_URL } from "../lib/productUrls.js";
import {
  MARKETING_STORAGE,
  readMarketingFlag,
  writeMarketingFlag,
} from "../lib/marketingStorage.js";

/* ---------------------------------------------------------- */
/* Data                                                        */
/* ---------------------------------------------------------- */

const VALUE_PILLARS = [
  {
    title: "Run smarter",
    copy: "Operations, scheduling, and the people side of your business — managed in one connected workspace instead of a stack of disconnected tools.",
  },
  {
    title: "Look professional",
    copy: "A consistent brand on every quote, invoice, document, and customer touchpoint. Built-in templates and identity that scale with you.",
  },
  {
    title: "One partner",
    copy: "EverPoint is built to grow with your business — operations, brand, web, and merchandise, all under one roof, one identity, one login.",
  },
];

const ACCENTS = {
  emerald: {
    label: "text-emerald-300",
    bar: "bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent",
    hoverRing: "hover:ring-emerald-400/30",
    softBg: "bg-emerald-400/10",
    softBorder: "border-emerald-400/30",
    softText: "text-emerald-200",
  },
  cyan: {
    label: "text-cyan-300",
    bar: "bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent",
    hoverRing: "hover:ring-cyan-400/30",
    softBg: "bg-cyan-400/10",
    softBorder: "border-cyan-400/30",
    softText: "text-cyan-200",
  },
  amber: {
    label: "text-amber-200",
    bar: "bg-gradient-to-r from-transparent via-amber-400/60 to-transparent",
    hoverRing: "hover:ring-amber-400/30",
    softBg: "bg-amber-400/10",
    softBorder: "border-amber-400/30",
    softText: "text-amber-200",
  },
  violet: {
    label: "text-violet-300",
    bar: "bg-gradient-to-r from-transparent via-violet-400/60 to-transparent",
    hoverRing: "hover:ring-violet-400/30",
    softBg: "bg-violet-400/10",
    softBorder: "border-violet-400/30",
    softText: "text-violet-200",
  },
};

const SOFTWARE_PRODUCTS = [
  {
    key: "everflow",
    name: "EverFlow",
    accent: "emerald",
    tagline: "Office & workflow operations",
    description:
      "Scheduling, customers, quotes, invoices, contracts, and dashboards for your office team — wired to live field data.",
  },
  {
    key: "everfield",
    name: "EverField",
    accent: "cyan",
    tagline: "Field workforce tools",
    description:
      "A focused mobile-first portal for technicians: schedule, timecards, job context, and updates — without office noise.",
  },
  {
    key: "everagent",
    name: "EverAgent",
    accent: "violet",
    tagline: "AI orchestration & automation",
    description:
      "Workspace-scoped Gemini assistant plus task automations that respect your company tenancy and permissions.",
  },
  {
    key: "eversafe",
    name: "EverSafe",
    accent: "emerald",
    tagline: "Safety & compliance workspace",
    description: "Trusted safety records, certifications, and inspection tooling for compliance-heavy industries.",
  },
];

const SERVICE_OFFERINGS = [
  {
    key: "graphic-design-branding",
    name: "Graphic Design & Branding",
    accent: "violet",
    tagline: "Graphics, logos & brand systems",
    description:
      "Identity systems, logos, document templates, and on-brand marketing collateral designed around your business.",
  },
  {
    key: "web-design-hosting",
    name: "Web Design & Hosting",
    accent: "cyan",
    tagline: "Website design & hosting",
    description:
      "Professionally built and hosted websites that match your brand, support your customers, and connect back to EverPoint.",
  },
  {
    key: "apparel-merchandise",
    name: "Apparel & Merchandise",
    accent: "amber",
    tagline: "Apparel & merchandise design",
    description:
      "Branded apparel, signage, and field-ready merchandise designed to carry the same identity into the field.",
  },
];

const DIVISION_GROUPS = [
  {
    id: "software",
    eyebrow: "Software Division",
    title: "Operational software for office and field teams.",
    copy:
      "EverPoint Software is where the installable products live: office workflows, field tools, AI assistance, and safety/compliance systems.",
    items: SOFTWARE_PRODUCTS,
  },
  {
    id: "services",
    eyebrow: "Services Division",
    title: "Business services that support the same identity.",
    copy:
      "EverPoint Services turns the brand around your operations into customer-facing web, design, and merchandise work.",
    items: SERVICE_OFFERINGS,
  },
];

const SERVICE_TABS = [
  {
    id: "office",
    label: "Office Operations",
    title: "Run the business side with less friction",
    intro:
      "Dispatchers, accountants, and managers get a fast, opinionated workspace for the entire customer-to-cash lifecycle.",
    items: [
      "Live dashboard snapshots",
      "Scheduling & dispatch",
      "Quotes, invoices, and cheques",
      "Contracts with signing",
      "Customers and job tracking",
      "Employee management",
      "Gemini assistant in the header",
    ],
  },
  {
    id: "field",
    label: "Field Crews",
    title: "Give technicians a portal they will actually use",
    intro:
      "A focused mobile-first experience: only the schedule, jobs, and updates the field needs — nothing the office should not share.",
    items: [
      "Simple crew portal",
      "Timecard entry",
      "Schedule visibility",
      "Field team workflows",
      "Job-facing updates",
      "Mobile-optimized layout",
    ],
  },
  {
    id: "records",
    label: "Records & Compliance",
    title: "Documents, fleet, and paperwork in one place",
    intro:
      "Versioned records and structured paperwork keep your audit trail clean and your office out of email threads.",
    items: [
      "Job files and document history",
      "Fleet assets and inspections",
      "Office field paperwork",
      "Customer record vault",
      "Cheques and contract archive",
      "Tenant-isolated storage",
    ],
  },
  {
    id: "ai",
    label: "AI Assistance",
    title: "Workspace-scoped intelligence",
    intro:
      "EverAgent (in development) brings a Gemini-powered assistant directly into your workspace — answers and automations bound to your tenant.",
    items: [
      "Workspace-scoped chat assistant",
      "Plain-language operational queries",
      "Permission-aware responses",
      "No pasted API keys for your team",
      "Roadmap: task automations",
      "Roadmap: cross-product orchestration",
    ],
  },
];

const TRUST_STRIPS = [
  "Tenant-isolated by design",
  "Office + field in sync",
  "Role-based access",
  "Built on Firebase",
  "Made in Canada",
];

const EARLY_ACCESS_MAILTO = "mailto:admin@everpoint.ca?subject=EverPoint%20Early%20Access";

/**
 * Pre-launch gate. While EverPoint is in active development we keep the public
 * marketing site as advertising + "request early access" only, and hide every
 * surface that implies the product is usable today: portal login links, the
 * installable-app section, and "open portal" buttons. The /portal route itself
 * stays reachable by direct URL (so the team can still sign in) — we only hide
 * the public entry points.
 *
 * Default is now ON (app access surfaced) so the EverField/EverFlow login and
 * install entry points are visible everywhere, including the live marketing
 * site. Set VITE_SHOW_APP_ACCESS=0 to hide them again (e.g. a pre-launch
 * marketing-only build) without deleting the code.
 */
const SHOW_APP_ACCESS = import.meta.env.VITE_SHOW_APP_ACCESS !== "0";

/* ---------------------------------------------------------- */
/* Small UI primitives                                         */
/* ---------------------------------------------------------- */

function Eyebrow({ children, tone = "emerald" }) {
  const toneCls =
    tone === "emerald"
      ? "text-emerald-300/90"
      : tone === "cyan"
      ? "text-cyan-300/90"
      : "text-zinc-400";
  return (
    <p className={`text-[12px] font-semibold uppercase tracking-[0.18em] ${toneCls}`}>
      {children}
    </p>
  );
}

function PrimaryBtn({ href, to, children, size = "md", className = "" }) {
  const sizeCls = size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm";
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-zinc-950 " +
    "bg-gradient-to-br from-emerald-300 to-emerald-500 " +
    "shadow-[0_0_30px_-8px_rgba(52,211,153,0.6)] " +
    "transition-all hover:from-emerald-200 hover:to-emerald-400 " +
    "hover:shadow-[0_0_40px_-6px_rgba(52,211,153,0.8)] hover:-translate-y-0.5 " +
    "selection:bg-emerald-400/30";
  if (to) {
    return (
      <Link to={to} className={`${base} ${sizeCls} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={`${base} ${sizeCls} ${className}`}>
      {children}
    </a>
  );
}

function GhostBtn({ href, to, children, size = "md", className = "" }) {
  const sizeCls = size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm";
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-zinc-100 " +
    "bg-white/[0.04] ring-1 ring-white/10 backdrop-blur " +
    "transition-all hover:bg-white/[0.06] hover:ring-white/20 hover:-translate-y-0.5";
  if (to) {
    return (
      <Link to={to} className={`${base} ${sizeCls} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={`${base} ${sizeCls} ${className}`}>
      {children}
    </a>
  );
}

function LiveDot({ tone = "emerald" }) {
  const c =
    tone === "emerald" ? "bg-emerald-400" :
    tone === "cyan" ? "bg-cyan-400" :
    tone === "amber" ? "bg-amber-400" :
    tone === "violet" ? "bg-violet-400" :
    "bg-zinc-400";
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      <span className={`absolute inline-flex h-full w-full rounded-full ${c} opacity-75 animate-ping`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${c}`} />
    </span>
  );
}

function KpiCard({ label, value, delta, deltaTone = "up", sub }) {
  const tone =
    deltaTone === "up"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      : "border-white/10 bg-white/5 text-zinc-300";
  return (
    <div className="rounded-xl bg-zinc-950/60 ring-1 ring-white/5 p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold leading-none tracking-tight text-zinc-100 tabular-nums">
          {value}
        </span>
        {delta ? (
          <span
            className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${tone}`}
          >
            {delta}
          </span>
        ) : null}
      </div>
      {sub ? <p className="mt-1.5 text-[11px] text-zinc-500">{sub}</p> : null}
    </div>
  );
}

function ActivityRow({ time, tone = "emerald", text, detail }) {
  const dot =
    tone === "emerald" ? "bg-emerald-400" :
    tone === "cyan" ? "bg-cyan-400" :
    tone === "amber" ? "bg-amber-400" :
    "bg-zinc-400";
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-zinc-100">{text}</p>
        <p className="truncate text-[12px] text-zinc-500">{detail}</p>
      </div>
      <span className="shrink-0 text-[11px] text-zinc-500 tabular-nums">{time}</span>
    </li>
  );
}

/* ---------------------------------------------------------- */
/* Install apps section                                        */
/*                                                             */
/* Marketing-side CTAs that hand users off to the product      */
/* subdomains where the actual PWA install prompts fire        */
/* (`everflow.everpoint.ca`, `everfield.everpoint.ca`).        */
/*                                                             */
/* Buttons are "smart" in the sense that we cannot detect      */
/* cross-origin installs from `everpoint.ca`, but we can:      */
/*   - Remember the user clicked Install on this device        */
/*     (localStorage flag) and flip the label to "Open" next   */
/*     visit, since the most likely follow-up is launching it. */
/*   - Detect when the marketing page itself is being viewed   */
/*     from inside an installed PWA (rare — they'd have to     */
/*     navigate cross-origin) and label as "Open" upfront.     */
/*   - Detect iOS Safari and show the manual                   */
/*     Share -> Add to Home Screen hint, since iOS does not    */
/*     fire the install prompt our subdomain banner relies on. */
/* ---------------------------------------------------------- */

const INSTALL_APPS = [
  {
    key: "everflow",
    name: "EverFlow",
    accent: "emerald",
    tagline: "Office & workflow operations",
    description:
      "Scheduling, customers, quotes, invoices, contracts, and dashboards — built for managers, owners, and office staff.",
    audience: "For: office, company owners, admins",
    storageKey: MARKETING_STORAGE.installClickedEverflow,
    product: "everflow",
    landingPath: "/",
  },
  {
    key: "everfield",
    name: "EverField",
    accent: "cyan",
    tagline: "Field workforce portal",
    description:
      "A focused mobile-first app for technicians: schedule, timecards, job context, and updates — without office noise.",
    audience: "For: employees in the field",
    storageKey: MARKETING_STORAGE.installClickedEverfield,
    product: "everfield",
    landingPath: "/",
  },
];

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(display-mode: standalone)")?.matches) return true;
  return Boolean(window.navigator?.standalone);
}

function isIosSafari() {
  if (typeof window === "undefined") return false;
  const ua = String(window.navigator?.userAgent || "").toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua) ||
    (ua.includes("mac") && (window.navigator?.maxTouchPoints || 0) > 1);
  if (!isIos) return false;
  // Safari excludes CriOS (Chrome iOS), FxiOS (Firefox iOS), EdgiOS, etc.
  if (/crios|fxios|edgios|opios/.test(ua)) return false;
  return ua.includes("safari");
}

function InstallAppCard({ app, accents }) {
  const accent = accents[app.accent] || accents.emerald;
  const [clickedBefore, setClickedBefore] = useState(false);
  const [iosHintVisible, setIosHintVisible] = useState(false);
  const standalone = useMemo(() => isStandaloneDisplay(), []);
  const showIos = useMemo(() => isIosSafari(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = readMarketingFlag(app.storageKey);
    // One-time hydrate of persisted "clicked before" flag from storage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (flag === "1") setClickedBefore(true);
  }, [app.storageKey]);

  const targetUrl = useMemo(
    () => buildProductUrl(app.product, app.landingPath, "", ""),
    [app.product, app.landingPath]
  );

  const alreadyOpenable = standalone || clickedBefore;
  const buttonLabel = alreadyOpenable ? `Open ${app.name}` : `Install ${app.name}`;

  const handleClick = useCallback(
    (event) => {
      // On iOS Safari there's no install prompt — show the manual hint instead
      // of silently sending them to a subdomain where nothing pops up either.
      if (showIos && !alreadyOpenable) {
        event.preventDefault();
        setIosHintVisible(true);
        try {
          writeMarketingFlag(app.storageKey, "1");
          setClickedBefore(true);
        } catch {
          // localStorage blocked (Safari private mode) — non-fatal.
        }
        return;
      }
      try {
        writeMarketingFlag(app.storageKey, "1");
      } catch {
        // Non-fatal: we can still navigate.
      }
      setClickedBefore(true);
    },
    [showIos, alreadyOpenable, app.storageKey]
  );

  return (
    <article
      className={
        "relative flex flex-col rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/5 transition-all " +
        "hover:-translate-y-0.5 hover:bg-white/[0.04] " + accent.hoverRing
      }
    >
      <div className={`absolute inset-x-6 top-0 h-px ${accent.bar}`} aria-hidden />
      <div className="flex items-center justify-between gap-3">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${accent.label}`}>
          {app.tagline}
        </p>
        <span
          className={
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold " +
            `${accent.softBg} border ${accent.softBorder} ${accent.softText}`
          }
        >
          <LiveDot tone={app.accent} />
          {alreadyOpenable ? "Ready to open" : "Installable"}
        </span>
      </div>

      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">{app.name}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">{app.description}</p>
      <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-zinc-500">{app.audience}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={targetUrl}
          onClick={handleClick}
          className={
            "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold " +
            "text-zinc-950 bg-gradient-to-br " +
            (app.accent === "cyan"
              ? "from-cyan-300 to-cyan-500 hover:from-cyan-200 hover:to-cyan-400 shadow-[0_0_30px_-8px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_-6px_rgba(34,211,238,0.8)]"
              : "from-emerald-300 to-emerald-500 hover:from-emerald-200 hover:to-emerald-400 shadow-[0_0_30px_-8px_rgba(52,211,153,0.6)] hover:shadow-[0_0_40px_-6px_rgba(52,211,153,0.8)]") +
            " transition-all hover:-translate-y-0.5"
          }
        >
          {buttonLabel}
          <span aria-hidden>→</span>
        </a>
        <span className="text-[12px] text-zinc-500">
          Opens <span className="text-zinc-300">{app.product}.everpoint.ca</span>
        </span>
      </div>

      {showIos && iosHintVisible ? (
        <div
          className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[12.5px] leading-relaxed text-zinc-300"
          role="status"
        >
          <strong className="text-zinc-100">iOS install:</strong> on the next page, tap the
          <span className="mx-1 inline-block rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-zinc-100">
            Share
          </span>
          icon, then{" "}
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-zinc-100">
            Add to Home Screen
          </span>
          .
        </div>
      ) : null}
    </article>
  );
}

function InstallAppsSection({ accents }) {
  return (
    <section
      id="install"
      className="border-y border-white/5 bg-gradient-to-br from-zinc-950/60 via-zinc-900/60 to-zinc-950 px-6 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <Eyebrow>Install the apps</Eyebrow>
          <h2 className="mt-2 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Two installable products. One platform.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-400">
            EverPoint Software ships as two separate installable apps so each role gets a focused
            workspace. Pick the one that matches how you work — install it once, open it from your
            home screen or desktop.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {INSTALL_APPS.map((app) => (
            <InstallAppCard key={app.key} app={app} accents={accents} />
          ))}
        </div>

        <p className="mt-6 text-[12.5px] text-zinc-500">
          Already signed in elsewhere? Use the{" "}
          <a href={PORTAL_LOGIN_URL} className="text-emerald-300 hover:text-emerald-200">
            portal
          </a>{" "}
          and we&apos;ll route you to the right app for your role.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- */
/* Page                                                        */
/* ---------------------------------------------------------- */

export default function WebsitePage() {
  const [activeServiceTab, setActiveServiceTab] = useState(SERVICE_TABS[0].id);

  // Brand-mark intro: the central "powering up" logo swoops into the exact spot where the
  // static panel logo sits. We measure the in-panel logo slot (not the panel) because the
  // panel's asymmetric bottom padding shifts the logo's visual center above the panel's
  // geometric center, and any mismatch causes a visible "slide" at the overlay handoff.
  //
  // Mobile (and any narrow viewport where the slot is below the fold) plays a "center-fade"
  // variant instead — same power-up sequence, but the logo fades out at viewport center
  // rather than swooping into a panel the user can't see yet. No rAF tracking needed.
  // Phases:
  //   'idle'             — nothing playing yet (initial render)
  //   'animating'        — desktop swoop, rAF tracks the slot every frame
  //   'animating-mobile' — mobile center-fade, no slot tracking
  //   'fading'           — viewer scrolled past the panel mid-flight (desktop only)
  //   'done'             — overlay unmounted, in-panel static logo visible
  const brandLogoSlotRef = useRef(null);
  const [introPhase, setIntroPhase] = useState("idle");
  const isMobileIntro = introPhase === "animating-mobile";

  useEffect(() => {
    document.title = "EverPoint — Elevate your business. The EverPoint way.";
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (prefersReducedMotion) {
      // Skip intro animation for reduced-motion users; synchronous terminal state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIntroPhase("done");
      return undefined;
    }

    // The browser may restore a previous scroll position on refresh, which would push the
    // panel out of view and silently disable the intro. Pin to the top before measuring so
    // the swoop fires consistently on every fresh page load.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const root = document.documentElement;
    const viewportWidth = root.clientWidth;
    const viewportHeight = root.clientHeight;

    // Narrow viewports (Tailwind's `md` breakpoint = 768px) get a "center-fade" variant:
    // power up at viewport center, then fade out at center. There's no slot to swoop into
    // because the brand panel is below the fold on phones.
    const isNarrowViewport =
      window.matchMedia?.("(max-width: 767px)").matches ?? viewportWidth < 768;
    if (isNarrowViewport) {
      // Mobile peak is sized off the smaller layout-viewport dimension so the logo reads
      // large on phones but never overruns landscape mini-tablets. 280px ceiling keeps the
      // glow from blowing past the safe area.
      const mobilePeakLogoWidth = Math.min(
        Math.min(viewportWidth, viewportHeight) * 0.55,
        280,
      );
      root.style.setProperty("--intro-peak-size", `${mobilePeakLogoWidth.toFixed(0)}px`);
      setIntroPhase("animating-mobile");
      return undefined;
    }

    const slot = brandLogoSlotRef.current;
    const slotRect = slot ? slot.getBoundingClientRect() : null;
    const slotUnusable =
      !slotRect ||
      !slotRect.width ||
      !slotRect.height ||
      slotRect.top > viewportHeight * 0.85;
    if (slotUnusable) {
      // Slot not measurable or below the fold (small laptops in portrait, mini-tablets in
      // narrow windows). Fall back to the mobile center-fade variant instead of swooping
      // into nothing.
      const fallbackPeakLogoWidth = Math.min(
        Math.min(viewportWidth, viewportHeight) * 0.55,
        280,
      );
      root.style.setProperty(
        "--intro-peak-size",
        `${fallbackPeakLogoWidth.toFixed(0)}px`,
      );
      setIntroPhase("animating-mobile");
      return undefined;
    }

    // IMPORTANT: viewportWidth/viewportHeight come from documentElement.clientWidth/Height
    // (the layout viewport) — declared above. With `html { scrollbar-gutter: stable; }` the
    // browser reserves space for the vertical scrollbar, so the layout viewport is narrower
    // than the window. Fixed-position elements (the swoop overlay) anchor to the layout
    // viewport, and getBoundingClientRect returns layout-viewport coordinates — so all
    // three references must agree, otherwise the swoop lands offset by half-a-gutter.
    const slotCenterX = slotRect.left + slotRect.width / 2;
    const slotCenterY = slotRect.top + slotRect.height / 2;
    const dx = slotCenterX - viewportWidth / 2;
    const dy = slotCenterY - viewportHeight / 2;

    // The static logo is `max-w/max-h` + `object-contain` inside the slot. Logo aspect
    // (1008×558 → 1.806:1) is wider than the slot, so logo width === slot width.
    const LOGO_ASPECT = 1008 / 558;
    const widthFitHeight = slotRect.width / LOGO_ASPECT;
    const finalLogoWidth =
      widthFitHeight <= slotRect.height ? slotRect.width : slotRect.height * LOGO_ASPECT;

    // Peak intro size: 42% of the smaller layout-viewport dimension, capped at 460px so it
    // never overruns small laptops or tall portrait viewports.
    const peakLogoWidth = Math.min(
      Math.min(viewportWidth, viewportHeight) * 0.42,
      460,
    );

    const finalScale = finalLogoWidth / peakLogoWidth;

    root.style.setProperty("--intro-target-x", `${dx.toFixed(1)}px`);
    root.style.setProperty("--intro-target-y", `${dy.toFixed(1)}px`);
    root.style.setProperty("--intro-target-scale", finalScale.toFixed(3));
    root.style.setProperty("--intro-peak-size", `${peakLogoWidth.toFixed(0)}px`);

    setIntroPhase("animating");
    return undefined;
  }, []);

  // Live tracker: while the swoop is playing, re-measure the slot every frame and update
  // the CSS variables that drive the keyframes. This guarantees the logo lands exactly
  // inside the slot regardless of mid-flight layout shifts (web fonts loading, images
  // loading, viewport resize, etc.). If the viewer scrolls past the slot, hand off to the
  // 'fading' phase so the overlay can fade out instead of swooping into nothing.
  useEffect(() => {
    if (introPhase !== "animating") return undefined;
    if (typeof window === "undefined") return undefined;

    const ANIMATION_MS = 2200;
    const LOGO_ASPECT = 1008 / 558;
    const root = document.documentElement;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now) => {
      const slot = brandLogoSlotRef.current;
      if (!slot) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const slotRect = slot.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;

      // If the slot has fully scrolled off the top or bottom, gracefully fade out the
      // overlay instead of swooping the logo into a target that's no longer visible.
      const fullyOffScreen =
        slotRect.bottom < 0 || slotRect.top > viewportHeight;
      if (fullyOffScreen) {
        setIntroPhase("fading");
        return;
      }

      const slotCenterX = slotRect.left + slotRect.width / 2;
      const slotCenterY = slotRect.top + slotRect.height / 2;
      const dx = slotCenterX - viewportWidth / 2;
      const dy = slotCenterY - viewportHeight / 2;

      const widthFitHeight = slotRect.width / LOGO_ASPECT;
      const finalLogoWidth =
        widthFitHeight <= slotRect.height
          ? slotRect.width
          : slotRect.height * LOGO_ASPECT;

      const peakLogoWidth = Math.min(
        Math.min(viewportWidth, viewportHeight) * 0.42,
        460,
      );
      const finalScale = finalLogoWidth / peakLogoWidth;

      root.style.setProperty("--intro-target-x", `${dx.toFixed(1)}px`);
      root.style.setProperty("--intro-target-y", `${dy.toFixed(1)}px`);
      root.style.setProperty("--intro-target-scale", finalScale.toFixed(3));
      root.style.setProperty("--intro-peak-size", `${peakLogoWidth.toFixed(0)}px`);

      // Stop tracking exactly when the keyframes finish — any post-landing layout shift
      // (font load, etc.) would otherwise drag the swoop logo off-target and create a
      // visible "slide" at the moment the overlay hands off to the static panel logo.
      // We do the final var update *before* checking, so the very last frame uses fresh
      // measurements right at the moment of unmount.
      const elapsed = now - startTime;
      if (elapsed >= ANIMATION_MS) {
        setIntroPhase("done");
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [introPhase]);

  // Fade phase: viewer scrolled past the panel. Hold the overlay in fading state for one
  // CSS opacity transition, then unmount it. The CSS class on the overlay handles the
  // visual fade; this timer just gates the unmount.
  useEffect(() => {
    if (introPhase !== "fading") return undefined;
    const fadeTimer = window.setTimeout(() => {
      setIntroPhase("done");
    }, 350);
    return () => {
      window.clearTimeout(fadeTimer);
    };
  }, [introPhase]);

  // Mobile center-fade phase: there's nothing to track (no slot to land on), so we just
  // unmount the overlay after the keyframes finish playing. Duration mirrors the desktop
  // intro at 2.2s so the timing feels consistent across breakpoints.
  useEffect(() => {
    if (introPhase !== "animating-mobile") return undefined;
    const mobileTimer = window.setTimeout(() => {
      setIntroPhase("done");
    }, 2200);
    return () => {
      window.clearTimeout(mobileTimer);
    };
  }, [introPhase]);

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-400/30 selection:text-white">
      {/* Brand-mark intro overlay — powering up at viewport center.
          Desktop: swoops into the brand panel slot.
          Mobile (`animating-mobile`): power-up + fade-out at center, no swoop. */}
      {introPhase === "animating" ||
      introPhase === "fading" ||
      introPhase === "animating-mobile" ? (
        <div
          aria-hidden
          className={[
            "pointer-events-none fixed inset-0 z-[80] transition-opacity duration-300 ease-out",
            // When the viewer scrolls past the panel mid-animation, the wrapper fades
            // every animated child out together (opacity multiplies down to 0) — graceful
            // exit instead of a logo swooping into nothing.
            introPhase === "fading" ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          {/* Backdrop dim with subtle blur — focuses attention on the central charge. */}
          <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm motion-safe:animate-[brand-intro-backdrop_2.2s_ease-in-out_both]" />

          {/* Outer emerald aura — the energy field powering up. Mobile keeps it centered
              for the fade-out; desktop trails it toward the panel slot. */}
          <div
            className={[
              "absolute left-1/2 top-1/2 h-[640px] w-[640px] rounded-full bg-emerald-500/35 blur-[140px]",
              isMobileIntro
                ? "motion-safe:animate-[brand-intro-aura-mobile_2.2s_linear_both]"
                : "motion-safe:animate-[brand-intro-aura_2.2s_linear_both]",
            ].join(" ")}
          />

          {/* Pulsing energy rings expanding outward as the logo charges. */}
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] rounded-full border-2 border-emerald-400/50 motion-safe:animate-[brand-intro-ring_2.2s_ease-out_both]" />
          <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] rounded-full border border-emerald-300/40 motion-safe:animate-[brand-intro-ring-secondary_2.2s_ease-out_both]" />

          {/* The "discharge" flash at peak charge — a brief radial burst as the logo launches. */}
          <div
            className="absolute left-1/2 top-1/2 h-[480px] w-[480px] rounded-full blur-2xl motion-safe:animate-[brand-intro-flash_2.2s_linear_both]"
            style={{
              background:
                "radial-gradient(circle, rgba(110,231,183,0.7) 0%, rgba(52,211,153,0.25) 40%, transparent 72%)",
            }}
          />

          {/* The logo itself. Desktop swoops into the panel slot; mobile holds at peak
              then fades out at viewport center. */}
          <img
            src={logoStackedSrc}
            alt=""
            className={[
              "absolute left-1/2 top-1/2 h-auto",
              isMobileIntro
                ? "motion-safe:animate-[brand-intro-travel-mobile_2.2s_linear_both]"
                : "motion-safe:animate-[brand-intro-travel_2.2s_linear_both]",
            ].join(" ")}
            style={{ width: "var(--intro-peak-size, 380px)" }}
          />
        </div>
      ) : null}

      {/* Ambient layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-20 z-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-80 -right-20 z-0 h-72 w-72 rounded-full bg-emerald-500/15 blur-[120px]"
      />

      {/* Eyebrow strip */}
      <div className="relative z-20 flex items-center justify-center gap-2.5 border-b border-white/5 bg-zinc-950/95 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
        <LiveDot />
        <span>In active development · Now accepting early-access requests</span>
      </div>

      {/* Sticky nav */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
          <Link to="/" aria-label="EverPoint home" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/10 transition-all group-hover:ring-emerald-400/40">
              <img src={logoMarkSrc} alt="" aria-hidden className="h-8 w-8 object-contain drop-shadow-[0_2px_8px_rgba(52,211,153,0.4)]" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-tight text-zinc-100">EverPoint</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
                Elevate your business
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-zinc-400 lg:flex" aria-label="Primary">
            <a href="#services" className="transition-colors hover:text-white">Services</a>
            <a href="#capabilities" className="transition-colors hover:text-white">What we do</a>
            {SHOW_APP_ACCESS ? (
              <a href="#install" className="transition-colors hover:text-white">Install</a>
            ) : null}
            <a href="#contact" className="transition-colors hover:text-white">Contact</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {SHOW_APP_ACCESS ? (
              <a
                href={PORTAL_LOGIN_URL}
                className="hidden rounded-full bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-100 ring-1 ring-white/10 transition-all hover:bg-white/[0.06] hover:ring-white/20 sm:inline-flex"
              >
                Portal Login
              </a>
            ) : null}
            <PrimaryBtn href={EARLY_ACCESS_MAILTO}>Request Early Access</PrimaryBtn>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO */}
        <section className="px-6 pt-16 pb-12 sm:pt-24 lg:pt-32 lg:pb-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="flex flex-col items-start gap-6 text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                <LiveDot />
                In active development
              </span>
              <h1 className="text-balance text-4xl font-semibold leading-snug tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
                Elevate your business.{" "}
                <span className="block bg-gradient-to-br from-emerald-200 via-emerald-400 to-emerald-700 bg-clip-text text-transparent">
                  The EverPoint way.
                </span>
              </h1>
              <p className="max-w-[560px] text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
                A connected platform for the office, the field, and everything around your business.
                Operations, brand, web, and merchandise — all on the road map under one roof.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <PrimaryBtn href={EARLY_ACCESS_MAILTO} size="lg">
                  Request Early Access
                </PrimaryBtn>
                {SHOW_APP_ACCESS ? (
                  <GhostBtn href="#install" size="lg">
                    Install the Apps
                  </GhostBtn>
                ) : null}
                <GhostBtn href="#services" size="lg">
                  See the Road Map
                </GhostBtn>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Tenant-isolated by design", "Office + field in sync", "Role-based portals"].map(
                  (label) => (
                    <span
                      key={label}
                      className="inline-flex items-center rounded-full bg-white/[0.04] px-3 py-1 text-[12px] text-zinc-300 ring-1 ring-white/5"
                    >
                      {label}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Brand mark — measured by useLayoutEffect so the intro overlay can swoop here. */}
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]"
              />

              <div className="group relative aspect-square w-full max-w-[540px] overflow-hidden rounded-[32px] bg-zinc-950 ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_80%)]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"
                />

                <div className="absolute inset-0 p-14 pb-20 sm:p-16 sm:pb-24">
                  {/* Slot fills exactly the padded area — used as the swoop target so the
                      overlay's logo lands where the static logo actually centers itself
                      (the asymmetric bottom padding makes panel-center wrong). */}
                  <div
                    ref={brandLogoSlotRef}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <img
                      src={logoStackedSrc}
                      alt="EverPoint"
                      className={[
                        "max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]",
                        // While the intro overlay is showing the swooping logo, hide the
                        // in-panel one so the user only sees a single logo at any time.
                        introPhase === "animating" ? "opacity-0" : "opacity-100",
                      ].join(" ")}
                    />
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-zinc-950/90 px-5 py-3 backdrop-blur">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    EverPoint · Brand mark
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                    <LiveDot />
                    Established
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE COMMAND CENTER */}
        <section id="preview" className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <Eyebrow>Live preview</Eyebrow>
              <h2 className="mt-2 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                See what we&rsquo;re building.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-400">
                A connected command center for your office and field &mdash; wired to live data, the way
                it will look when the platform ships.
              </p>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-[40px] bg-gradient-to-br from-emerald-500/15 via-emerald-500/0 to-emerald-500/0 blur-3xl"
              />
              <div className="overflow-hidden rounded-3xl bg-zinc-900/80 ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-950/60 px-5 py-3">
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </span>
                  <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    EverPoint &middot; Live Command Center
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                    <LiveDot />
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-5 lg:grid-cols-4">
                  <KpiCard label="Revenue" value="$124.8K" delta="+12.4%" deltaTone="up" sub="vs last week" />
                  <KpiCard label="Active Jobs" value="38" delta="+6" deltaTone="up" sub="in the field" />
                  <KpiCard label="Crews Active" value="27" delta="84%" deltaTone="neutral" sub="clocked in now" />
                  <KpiCard label="Completed Today" value="14" delta="+3" deltaTone="up" sub="ahead of target" />
                </div>

                <div className="grid grid-cols-1 gap-5 px-5 pb-5 lg:grid-cols-[1.2fr_1fr]">
                  <div className="rounded-xl bg-zinc-950/60 p-5 ring-1 ring-white/5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                        Jobs completed
                      </span>
                      <span className="text-[11px] text-zinc-500">Mon &mdash; Sun</span>
                    </div>
                    <div className="flex h-32 items-end gap-2">
                      {[42, 65, 58, 78, 92, 70, 85].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/30 to-emerald-300/90 transition-[height] duration-700"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-zinc-950/60 p-5 ring-1 ring-white/5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                        Live activity
                      </span>
                      <span className="text-[11px] text-zinc-500">Last 30 min</span>
                    </div>
                    <ul className="space-y-2.5 text-[13px]">
                      <ActivityRow time="2m" tone="emerald" text="Boiler replacement updated" detail="Job #4821 → In Progress · North Ridge Apts." />
                      <ActivityRow time="11m" tone="cyan" text="Maya Chen clocked in" detail="Emergency HVAC · Team Atlas" />
                      <ActivityRow time="23m" tone="amber" text="Quote approved" detail="Q-1942 · Summit Dental · $18,600" />
                      <ActivityRow time="48m" tone="emerald" text="Invoice issued" detail="INV-2204 · Cedar Holdings · $4,250" />
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE PILLARS */}
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <Eyebrow>Why EverPoint</Eyebrow>
              <h2 className="mt-2 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                One platform. Every part of your business.
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {VALUE_PILLARS.map((pillar) => (
                <article
                  key={pillar.title}
                  className="group relative overflow-hidden rounded-2xl bg-white/[0.03] p-7 ring-1 ring-white/5 transition-all hover:-translate-y-0.5 hover:bg-white/[0.04] hover:ring-emerald-400/25"
                >
                  <span className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <h3 className="text-xl font-semibold tracking-tight text-zinc-100">{pillar.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">{pillar.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="border-y border-white/5 bg-gradient-to-br from-zinc-950/60 via-zinc-900/60 to-zinc-950 px-6 py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            <div>
              <Eyebrow>About EverPoint</Eyebrow>
              <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Built to take care of the running side of your business.
              </h2>
              <p className="mt-5 text-balance text-base leading-relaxed text-zinc-400 lg:text-lg">
                EverPoint began as an operations platform for service teams — scheduling, dispatch,
                timecards, and customer work. We are growing into a full business services partner:
                software and services now sit under two clear divisions: installable products for
                operations, and hands-on services for the brand, web, and merchandise work around them.
              </p>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                The roadmap stays visible so teams can see which products are closest to launch and
                which services will support the same EverPoint identity.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "2", l: "Business divisions" },
                { v: "4", l: "Software products" },
                { v: "3", l: "Service offerings" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl bg-white/[0.03] p-5 text-center ring-1 ring-white/5"
                >
                  <strong className="block text-4xl font-semibold leading-none tracking-tight text-emerald-300 tabular-nums">
                    {s.v}
                  </strong>
                  <span className="mt-2 block text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                    {s.l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAPABILITIES TABS */}
        <section id="capabilities" className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-2xl">
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-2 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Capabilities live across four lanes.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-400">
                The same workspace serves office, field, records, and AI assistance — wired together
                by tenant, not bolted on.
              </p>
            </div>

            <div className="mb-6 inline-flex max-w-full flex-wrap gap-1 overflow-x-auto rounded-2xl bg-white/[0.03] p-1.5 ring-1 ring-white/5">
              {SERVICE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeServiceTab === tab.id}
                  onClick={() => setActiveServiceTab(tab.id)}
                  className={[
                    "whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide transition-all",
                    activeServiceTab === tab.id
                      ? "bg-emerald-400/15 text-zinc-100 ring-1 ring-inset ring-emerald-400/30"
                      : "text-zinc-400 hover:text-white",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-950 p-7 ring-1 ring-white/10 sm:p-12">
              {SERVICE_TABS.filter((tab) => tab.id === activeServiceTab).map((tab) => (
                <div
                  key={tab.id}
                  className="grid grid-cols-1 gap-7 transition-all duration-500 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12"
                >
                  <div>
                    <h3 className="text-balance text-2xl font-semibold leading-snug tracking-tight text-zinc-100 sm:text-3xl">
                      {tab.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">{tab.intro}</p>
                  </div>
                  <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {tab.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[15px] text-zinc-200">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-[11px] font-bold text-emerald-300 ring-1 ring-emerald-400/30">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIVISIONS — software products + plain-named business services */}
        <section
          id="services"
          className="border-y border-white/5 bg-gradient-to-br from-zinc-950/60 via-zinc-900/60 to-zinc-950 px-6 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <Eyebrow>Road Map</Eyebrow>
              <h2 className="mt-2 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                One company, two divisions.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-400">
                EverPoint Software carries the installable app products. EverPoint Services handles
                the web, design, and merchandise work that surrounds the same business identity.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {DIVISION_GROUPS.map((division) => (
                <section
                  key={division.id}
                  aria-labelledby={`${division.id}-division-heading`}
                  className="rounded-3xl bg-white/[0.025] p-5 ring-1 ring-white/5 sm:p-6"
                >
                  <div className="mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                      {division.eyebrow}
                    </p>
                    <h3
                      id={`${division.id}-division-heading`}
                      className="mt-2 text-balance text-2xl font-semibold leading-snug tracking-tight text-zinc-100"
                    >
                      {division.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {division.copy}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {division.items.map((service) => {
                      const a = ACCENTS[service.accent];
                      return (
                        <article
                          key={service.key}
                          className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/5 transition-all hover:-translate-y-0.5 hover:bg-white/[0.04] ${a.hoverRing}`}
                        >
                          <span className={`pointer-events-none absolute inset-x-0 top-0 h-px ${a.bar}`} />
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-lg font-semibold tracking-tight text-zinc-100">
                              {service.name}
                            </h4>
                            <span className="inline-flex shrink-0 items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                              In Development
                            </span>
                          </div>
                          <p
                            className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${a.label}`}
                          >
                            {service.tagline}
                          </p>
                          <p className="flex-1 text-sm leading-relaxed text-zinc-400">
                            {service.description}
                          </p>
                          <a
                            href={`mailto:admin@everpoint.ca?subject=${encodeURIComponent(
                              `${service.name} updates`
                            )}`}
                            className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-white/[0.04] px-4 py-2 text-[13px] font-semibold text-zinc-100 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
                          >
                            Notify me at launch
                            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
                          </a>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        {/* INSTALL THE APPS — hidden pre-launch (see SHOW_APP_ACCESS) */}
        {SHOW_APP_ACCESS ? <InstallAppsSection accents={ACCENTS} /> : null}

        {/* TRUST STRIP */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-center gap-2">
              {TRUST_STRIPS.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full bg-white/[0.03] px-4 py-1.5 text-[13px] text-zinc-300 ring-1 ring-white/5"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="border-t border-white/5 px-6 py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <Eyebrow>Contact</Eyebrow>
              <h2 className="mt-2 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Reach the EverPoint team.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-400">
                We are a small team building EverPoint deliberately. Email is the fastest way to
                reach us — we read everything.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  label: "General",
                  value: "admin@everpoint.ca",
                  href: "mailto:admin@everpoint.ca",
                  external: true,
                },
                {
                  label: "Early Access",
                  value: "Get on the list",
                  href: EARLY_ACCESS_MAILTO,
                  external: true,
                },
                ...(SHOW_APP_ACCESS
                  ? [
                      {
                        label: "Existing Customers",
                        value: "Open the portal",
                        href: PORTAL_LOGIN_URL,
                        external: true,
                      },
                    ]
                  : []),
              ].map((c) => (
                <article
                  key={c.label}
                  className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/5 transition-all hover:-translate-y-0.5 hover:bg-white/[0.04] hover:ring-emerald-400/25"
                >
                  <p className="mb-1.5 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                    {c.label}
                  </p>
                  {c.external ? (
                    <a
                      href={c.href}
                      className="text-base font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <Link
                      to={c.to}
                      className="text-base font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
                    >
                      {c.value}
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-950 ring-1 ring-emerald-400/20">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-500/30 blur-[120px]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]"
              />
              <img
                src={logoStackedSrc}
                alt=""
                aria-hidden
                className="pointer-events-none absolute right-8 top-1/2 hidden h-72 w-auto -translate-y-1/2 opacity-[0.08] lg:block"
              />
              <div className="relative z-10 grid grid-cols-1 gap-8 p-10 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:p-16">
                <div>
                  <Eyebrow>Ready</Eyebrow>
                  <h2 className="mt-2 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                    Want EverPoint to be the way you run your business?
                  </h2>
                  <p className="mt-4 max-w-[520px] text-balance text-base leading-relaxed text-zinc-400 lg:text-lg">
                    Get on the early-access list and we will reach out as services come online.
                  </p>
                </div>
                <div className="flex flex-col items-start justify-center gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
                  <PrimaryBtn href={EARLY_ACCESS_MAILTO} size="lg" className="w-full sm:w-auto lg:w-full">
                    Request Early Access
                  </PrimaryBtn>
                  {SHOW_APP_ACCESS ? (
                    <GhostBtn href={PORTAL_LOGIN_URL} size="lg" className="w-full sm:w-auto lg:w-full">
                      Open Portal
                    </GhostBtn>
                  ) : (
                    <GhostBtn href="#services" size="lg" className="w-full sm:w-auto lg:w-full">
                      See the Road Map
                    </GhostBtn>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-zinc-950 px-6 pt-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 pb-10 lg:grid-cols-[1.2fr_2fr] lg:gap-14">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/10">
                <img src={logoMarkSrc} alt="" aria-hidden className="h-8 w-8 object-contain drop-shadow-[0_2px_8px_rgba(52,211,153,0.4)]" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-semibold tracking-tight text-zinc-100">EverPoint</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
                  Elevate your business
                </span>
              </span>
            </div>
            <p className="max-w-[320px] text-sm leading-relaxed text-zinc-400">
              Elevate your business. The EverPoint way. — A connected platform for the office, the
              field, and everything around your business.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-7 text-sm" aria-label="Footer">
            <div className="flex flex-col gap-2">
              <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">Platform</p>
              <a href="#services" className="text-zinc-300 transition-colors hover:text-white">Services</a>
              <a href="#capabilities" className="text-zinc-300 transition-colors hover:text-white">What we do</a>
              {SHOW_APP_ACCESS ? (
                <>
                  <a href="#install" className="text-zinc-300 transition-colors hover:text-white">Install Apps</a>
                  <a href={PORTAL_LOGIN_URL} className="text-zinc-300 transition-colors hover:text-white">
                    Portal Login
                  </a>
                </>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">Company</p>
              <a href="#contact" className="text-zinc-300 transition-colors hover:text-white">Contact</a>
              <a href="mailto:admin@everpoint.ca" className="text-zinc-300 transition-colors hover:text-white">
                Email us
              </a>
              <Link to="/terms" className="text-zinc-300 transition-colors hover:text-white">Terms</Link>
              <Link to="/privacy" className="text-zinc-300 transition-colors hover:text-white">Privacy</Link>
            </div>
          </nav>
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-white/5 py-4 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
          <span>© {new Date().getFullYear()} EverPoint. All rights reserved.</span>
          <span>Made in Canada</span>
        </div>
      </footer>
    </div>
  );
}
