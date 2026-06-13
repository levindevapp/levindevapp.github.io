import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, Github, Mail, Smartphone, Globe } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiAngular,
  SiExpo,
  SiMysql,
  SiOpenjdk,
  SiPhp,
  SiPostgresql,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import tcglogScreenshot from "../assets/ss_tcglog.png";
import lorexisScreenshot from "../assets/ss_lorexis.png";
import pokecaMapScreenshot from "../assets/ss_pokecamap.png";
import profileIcon from "../assets/profile_icon.png";

/* MARKER-MAKE-KIT-INVOKED */

const SECTIONS = ["home", "tcglog", "lorexis", "pokeca", "about", "skills", "contact"] as const;
type Section = typeof SECTIONS[number];

const NAV_LABELS: Record<Section, string> = {
  home: "Home",
  tcglog: "TCGLOG",
  lorexis: "Lorexis",
  pokeca: "Pokeca Event Map",
  about: "About",
  skills: "Skills",
  contact: "Contact",
};

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSectionRef = useRef<Section>("home");
  const scrollLockRef = useRef(false);
  const sectionRefs = useRef<Record<Section, HTMLElement | null>>({
    home: null,
    tcglog: null,
    lorexis: null,
    pokeca: null,
    about: null,
    skills: null,
    contact: null,
  });

  const scrollToSection = (section: Section) => {
    const el = sectionRefs.current[section];
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id as Section;
            activeSectionRef.current = id;
            setActiveSection(id);
          }
        }
      },
      { threshold: 0.5 }
    );
    for (const section of SECTIONS) {
      const el = sectionRefs.current[section];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const releaseScrollLock = () => {
      scrollLockRef.current = false;
    };
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollLockRef.current || Math.abs(e.deltaY) < 8) return;
      const currentIndex = SECTIONS.indexOf(activeSectionRef.current);
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(SECTIONS.length - 1, currentIndex + direction));
      if (nextIndex !== currentIndex) {
        scrollLockRef.current = true;
        scrollToSection(SECTIONS[nextIndex]);
        clearTimeout(timeout);
        timeout = setTimeout(releaseScrollLock, 900);
      }
    };
    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container?.removeEventListener("wheel", handleWheel);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    let startY = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const releaseScrollLock = () => {
      scrollLockRef.current = false;
    };
    const handleTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      if (scrollLockRef.current) return;
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;
      const direction = diff > 0 ? 1 : -1;
      const currentIndex = SECTIONS.indexOf(activeSectionRef.current);
      const nextIndex = Math.max(0, Math.min(SECTIONS.length - 1, currentIndex + direction));
      if (nextIndex !== currentIndex) {
        scrollLockRef.current = true;
        scrollToSection(SECTIONS[nextIndex]);
        clearTimeout(timeout);
        timeout = setTimeout(releaseScrollLock, 900);
      }
    };
    const container = containerRef.current;
    container?.addEventListener("touchstart", handleTouchStart);
    container?.addEventListener("touchend", handleTouchEnd);
    return () => {
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(timeout);
    };
  }, []);

  const sectionIndex = SECTIONS.indexOf(activeSection);

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden bg-background"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
    >
      {/* Dot nav */}
      <nav className="fixed right-3 sm:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => scrollToSection(s)}
            title={NAV_LABELS[s]}
            className="group flex items-center gap-2 justify-end"
          >
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {NAV_LABELS[s]}
            </span>
            <span className="flex w-2.5 items-center justify-center">
              <span
                className={`block rounded-full transition-all duration-300 ${
                  activeSection === s
                    ? "w-2.5 h-2.5 bg-primary"
                    : "w-1.5 h-1.5 bg-muted-foreground/40 group-hover:bg-primary/50"
                }`}
              />
            </span>
          </button>
        ))}
      </nav>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-50 bg-border">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${(sectionIndex / (SECTIONS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="relative w-full h-[100dvh] overflow-y-scroll"
        style={{ scrollSnapType: "y mandatory", scrollBehavior: "smooth" }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: `${SECTIONS.length * 100}dvh`,
            background: [
              "radial-gradient(circle at 88% 7%, rgba(14, 165, 233, 0.18), transparent 18%)",
              "radial-gradient(circle at 12% 20%, rgba(56, 189, 248, 0.12), transparent 16%)",
              "radial-gradient(circle at 82% 34%, rgba(45, 212, 191, 0.13), transparent 17%)",
              "radial-gradient(circle at 16% 49%, rgba(250, 204, 21, 0.11), transparent 15%)",
              "radial-gradient(circle at 86% 66%, rgba(129, 140, 248, 0.12), transparent 17%)",
              "radial-gradient(circle at 18% 82%, rgba(14, 165, 233, 0.13), transparent 16%)",
              "linear-gradient(180deg, var(--background) 0%, #eef9ff 17%, #f8fafc 34%, #eefdf8 50%, #f8fafc 66%, #f5f3ff 83%, #eff6ff 100%)",
            ].join(", "),
          }}
        />
        <PageSection
          id="home"
          sectionRefs={sectionRefs}
          onNext={() => scrollToSection("tcglog")}
          showScrollLabel
        >
          <HeroSection />
        </PageSection>

        <PageSection
          id="tcglog"
          sectionRefs={sectionRefs}
          onPrevious={() => scrollToSection("home")}
          onNext={() => scrollToSection("lorexis")}
        >
          <AppSection
            title="TCGLOG"
            description="トレーディングカードゲーム向けの対戦記録アプリ。デッキ毎の勝率や大会の戦績記録など、TCGプレイヤーの体験を幅広くサポートします。"
            tags={["iOS", "TCG", "対戦記録", "戦績管理"]}
            isPhone
            accentColor="from-sky-400 to-blue-600"
            imageSrc={tcglogScreenshot}
            reverse={false}
          />
        </PageSection>

        <PageSection
          id="lorexis"
          sectionRefs={sectionRefs}
          onPrevious={() => scrollToSection("tcglog")}
          onNext={() => scrollToSection("pokeca")}
        >
          <AppSection
            title="Lorexis"
            description="Disney Lorcana TCG向けのカウンターアプリ。必要最低限の機能に絞り込み、対戦中に迷わず使える操作性と、Lorcanaの世界観に合うデザインを目指しました。"
            tags={["iOS", "TCG", "Counter", "Lorcana"]}
            isPhone
            accentColor="from-emerald-400 to-teal-600"
            imageSrc={lorexisScreenshot}
            reverse
          />
        </PageSection>

        <PageSection
          id="pokeca"
          sectionRefs={sectionRefs}
          onPrevious={() => scrollToSection("lorexis")}
          onNext={() => scrollToSection("about")}
        >
          <AppSection
            title="Pokeca Event Map"
            description="ポケモンカードのイベント情報をマップで可視化するWebアプリ。近くの大会・イベントをかんたんに検索できる。"
            tags={["Web", "React", "Map", "ポケカ"]}
            isPhone={false}
            accentColor="from-yellow-400 to-orange-500"
            imageSrc={pokecaMapScreenshot}
            displayUrl="pokeca-map.com"
            reverse={false}
          />
        </PageSection>

        <PageSection
          id="about"
          sectionRefs={sectionRefs}
          onPrevious={() => scrollToSection("pokeca")}
          onNext={() => scrollToSection("skills")}
        >
          <AboutSection />
        </PageSection>

        <PageSection
          id="skills"
          sectionRefs={sectionRefs}
          onPrevious={() => scrollToSection("about")}
          onNext={() => scrollToSection("contact")}
        >
          <SkillsSection />
        </PageSection>

        <PageSection
          id="contact"
          sectionRefs={sectionRefs}
          onPrevious={() => scrollToSection("skills")}
        >
          <ContactSection />
        </PageSection>
      </div>
    </div>
  );
}

function PageSection({
  id,
  children,
  sectionRefs,
  onPrevious,
  onNext,
  showScrollLabel = false,
}: {
  id: Section;
  children: React.ReactNode;
  sectionRefs: React.MutableRefObject<Record<Section, HTMLElement | null>>;
  onPrevious?: () => void;
  onNext?: () => void;
  showScrollLabel?: boolean;
}) {
  return (
    <section
      id={id}
      ref={(el) => { sectionRefs.current[id] = el; }}
      className="relative z-10 flex h-[100dvh] w-full items-center justify-center overflow-hidden"
      style={{ scrollSnapAlign: "start" }}
    >
      {children}
      {onPrevious && <SectionChevron direction="up" onClick={onPrevious} />}
      {onNext && <SectionChevron direction="down" onClick={onNext} showLabel={showScrollLabel} />}
    </section>
  );
}

function SectionChevron({
  direction,
  onClick,
  showLabel = false,
}: {
  direction: "up" | "down";
  onClick?: () => void;
  showLabel?: boolean;
}) {
  const isUp = direction === "up";
  const content = (
    <>
      {showLabel && <span className="text-xs tracking-widest uppercase">Scroll</span>}
      {isUp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </>
  );

  const className =
    `absolute ${isUp ? "top-[clamp(1rem,4.8dvh,2.5rem)]" : "bottom-[clamp(1rem,4.8dvh,2.5rem)]"} left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors`;

  if (!onClick) {
    return (
      <motion.div
        className={className}
        animate={{ y: isUp ? [0, -6, 0] : [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        aria-hidden="true"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={className}
      animate={{ y: isUp ? [0, -6, 0] : [0, 6, 0] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      aria-label={isUp ? "Previous section" : showLabel ? "Scroll to next section" : "Next section"}
    >
      {content}
    </motion.button>
  );
}

function HeroSection() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6 py-[clamp(5rem,14dvh,7rem)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center"
      >
        <div className="mb-[clamp(1rem,3dvh,1.5rem)] inline-block rounded-full bg-secondary px-3 py-1 text-[clamp(0.75rem,1.8dvh,0.875rem)] tracking-wide text-secondary-foreground">
          Web Engineer &amp; Indie Developer
        </div>
        <h1
          className="mb-4"
          style={{
            fontSize: "clamp(2.5rem, min(8vw, 12dvh), 6rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: 0,
            color: "var(--foreground)",
          }}
        >
          Levin Dev
        </h1>

        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/levindevapp"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <Github size={20} />
          </a>
          <a
            href="https://x.com/levindevapp"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <span className="block h-5 w-5 text-center text-sm font-bold leading-5">X</span>
          </a>
          <a
            href="mailto:levindevapp@gmail.com"
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <Mail size={20} />
          </a>
        </div>
      </motion.div>

    </div>
  );
}

function AppSection({
  title,
  description,
  tags,
  isPhone,
  accentColor,
  imageSrc,
  displayUrl,
  reverse,
}: {
  title: string;
  description: string;
  tags: string[];
  isPhone: boolean;
  accentColor: string;
  imageSrc?: string;
  displayUrl?: string;
  reverse: boolean;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center px-5 py-[clamp(4.75rem,13dvh,6.5rem)] md:px-20 md:py-0">
      <div
        className={`flex max-h-full w-full max-w-5xl flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-[clamp(1.25rem,3.5dvh,2rem)] md:gap-20`}
      >
        <motion.div
          className="min-h-0 flex-1 text-center md:text-left"
          initial={{ opacity: 0, x: reverse ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-[clamp(0.35rem,1.3dvh,1rem)] flex items-center justify-center gap-2 md:mb-4 md:justify-start">
            {isPhone ? (
              <Smartphone size={16} className="text-primary" />
            ) : (
              <Globe size={16} className="text-primary" />
            )}
            <span className="text-[clamp(0.65rem,1.7dvh,0.75rem)] font-semibold uppercase tracking-widest text-primary">
              {isPhone ? "Mobile App" : "Web App"}
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.7rem, min(8.5vw, 7dvh), 4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: 0,
              color: "var(--foreground)",
              marginBottom: "clamp(0.45rem, 1.7dvh, 1rem)",
            }}
          >
            {title}
          </h2>
          <p
            className="mx-auto mb-[clamp(0.55rem,2dvh,1.5rem)] max-w-[30rem] text-muted-foreground md:mx-0"
            style={{
              fontSize: "clamp(0.78rem, 2.2dvh, 1rem)",
              lineHeight: 1.55,
            }}
          >
            {description}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 md:justify-start md:gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-[clamp(0.65rem,1.7dvh,0.75rem)] font-medium text-secondary-foreground md:px-3">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          {isPhone ? (
            <PhoneMockup accentColor={accentColor} title={title} imageSrc={imageSrc} />
          ) : (
            <BrowserMockup
              accentColor={accentColor}
              title={title}
              imageSrc={imageSrc}
              displayUrl={displayUrl}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function PhoneMockup({
  accentColor,
  title,
  imageSrc,
}: {
  accentColor: string;
  title: string;
  imageSrc?: string;
}) {
  return (
    <div className="relative h-[clamp(230px,44dvh,430px)] w-[clamp(108.2px,20.7dvh,202.4px)] md:h-[500px] md:w-[234.3px]">
      <div className="absolute inset-0 overflow-hidden rounded-[clamp(1.25rem,6dvh,2.5rem)] border-4 border-foreground/10 bg-card shadow-2xl md:rounded-[2.5rem]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${title} screenshot`}
            className="h-full w-full object-cover bg-card"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${accentColor} flex flex-col items-center justify-center gap-3`}>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Smartphone size={24} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm">{title}</span>
            <span className="text-white/70 text-xs">スクリーンショットを配置</span>
          </div>
        )}
      </div>
      <div
        className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full bg-gradient-to-r ${accentColor} opacity-20 blur-xl`}
      />
    </div>
  );
}

function BrowserMockup({
  accentColor,
  title,
  imageSrc,
  displayUrl,
}: {
  accentColor: string;
  title: string;
  imageSrc?: string;
  displayUrl?: string;
}) {
  return (
    <div
      className="relative flex h-auto w-[min(330px,calc(100vw-2.5rem))] aspect-[300/204] flex-col overflow-hidden rounded-[clamp(0.45rem,2.2dvh,0.75rem)] border border-border shadow-2xl md:h-[334px] md:w-[540px] md:aspect-auto md:rounded-xl"
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-card px-3 py-1.5 md:gap-2 md:px-4 md:py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70 md:h-3 md:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70 md:h-3 md:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70 md:h-3 md:w-3" />
        <div className="ml-1.5 flex h-4 flex-1 items-center rounded-full bg-muted px-2 md:ml-2 md:h-5 md:px-3">
          <span className="truncate text-[10px] text-muted-foreground md:text-xs">
            {displayUrl ?? `levindev.app/${title.toLowerCase().replace(/ /g, "-")}`}
          </span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${title} screenshot`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${accentColor} flex flex-col items-center justify-center gap-3`}>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Globe size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm">{title}</span>
            <span className="text-white/70 text-xs">スクリーンショットを配置</span>
          </div>
        )}
      </div>
      <div
        className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-44 h-6 rounded-full bg-gradient-to-r ${accentColor} opacity-20 blur-xl`}
      />
    </div>
  );
}

function AboutSection() {
  return (
    <div className="flex h-full w-full items-center justify-center px-5 py-[clamp(4.75rem,13dvh,6.5rem)] md:px-8 md:py-0">
      <div className="max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center"
        >
          <span className="mb-[clamp(0.5rem,1.8dvh,1rem)] block text-xs font-semibold uppercase tracking-widest text-primary">About</span>
          <div className="mb-[clamp(0.8rem,3dvh,2rem)] h-[clamp(72px,18dvh,128px)] w-[clamp(72px,18dvh,128px)] overflow-hidden rounded-full border border-border bg-secondary shadow-lg">
            <img
              src={profileIcon}
              alt="Levin profile icon"
              className="h-full w-full object-cover"
            />
          </div>
          <p
            className="mb-[clamp(0.8rem,3dvh,2rem)] text-muted-foreground"
            style={{ fontSize: "clamp(0.82rem, 2.2dvh, 1.05rem)", lineHeight: 1.65 }}
          >
            Webエンジニア / インディー開発者
            <br />
            アイデアを形にすることが好きで、Web、モバイル問わず開発しています。
            <br />
            「日常を少しだけ便利に」を信条としています。
          </p>
          <dl className="w-full max-w-md rounded-lg border border-border bg-background/70 p-[clamp(0.9rem,3dvh,1.5rem)] text-left shadow-sm">
            {[
              { label: "名前", value: "Levin" },
              { label: "好きな技術", value: "TypeScript、Java" },
              { label: "趣味", value: "カードゲーム、カフェ巡り" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4 border-b border-border py-[clamp(0.45rem,1.6dvh,0.75rem)] first:pt-0 last:border-b-0 last:pb-0">
                <dt className="w-24 flex-shrink-0 text-[clamp(0.78rem,2dvh,0.875rem)] font-semibold text-foreground">{label}</dt>
                <dd className="text-[clamp(0.78rem,2dvh,0.875rem)] text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  );
}

const SKILLS: {
  category: string;
  items: { name: string; icon: IconType; color: string }[];
}[] = [
  {
    category: "Frontend",
    items: [
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Angular", icon: SiAngular, color: "#DD0031" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
    ],
  },
  {
    category: "Mobile",
    items: [
      { name: "React Native", icon: SiReact, color: "#61DAFB" },
      { name: "Expo", icon: SiExpo, color: "#000020" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Java", icon: SiOpenjdk, color: "#EA2D2E" },
      { name: "PHP", icon: SiPhp, color: "#777BB4" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    ],
  },
];

function SkillsSection() {
  return (
    <div className="flex h-full w-full items-center justify-center px-5 py-[clamp(4.75rem,13dvh,6.5rem)] md:px-8 md:py-0">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-[clamp(0.8rem,3dvh,2.5rem)] text-center"
        >
          <span className="mb-[clamp(0.4rem,1.5dvh,1rem)] block text-xs font-semibold uppercase tracking-widest text-primary">Skills</span>
          <h2 style={{ fontSize: "clamp(1.6rem, min(7vw, 6dvh), 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: 0 }}>
            技術スタック
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-[clamp(0.5rem,1.8dvh,1rem)] md:grid-cols-3 md:gap-4">
          {SKILLS.map(({ category, items }, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-[clamp(0.7rem,2.3dvh,1.25rem)] transition-colors hover:border-primary/30"
            >
              <div className="mb-[clamp(0.4rem,1.5dvh,1rem)]">
                <span className="text-[clamp(0.78rem,2dvh,0.875rem)] font-semibold">{category}</span>
              </div>
              <ul className="grid grid-cols-2 gap-1.5 md:grid-cols-1 md:gap-2">
                {items.map(({ name, icon: Icon, color }) => (
                  <li
                    key={name}
                    className="flex min-w-0 items-center gap-2 rounded-lg border border-border/70 bg-secondary/40 px-2 py-[clamp(0.35rem,1.2dvh,0.5rem)] text-[clamp(0.68rem,1.7dvh,0.75rem)] font-medium text-foreground"
                  >
                    <span className="flex h-[clamp(1.4rem,4dvh,1.75rem)] w-[clamp(1.4rem,4dvh,1.75rem)] flex-shrink-0 items-center justify-center rounded-md bg-background">
                      <Icon size={16} color={color} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 break-words">{name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactSection() {
  const contactLinks = [
    {
      icon: <Mail size={20} />,
      label: "Email",
      value: "levindevapp@gmail.com",
      href: "mailto:levindevapp@gmail.com",
    },
    {
      icon: <span className="block h-5 w-5 text-center text-sm font-bold leading-5">X</span>,
      label: "X",
      value: "@levindevapp",
      href: "https://x.com/levindevapp",
    },
    {
      icon: <Github size={20} />,
      label: "GitHub",
      value: "github.com/levindevapp",
      href: "https://github.com/levindevapp",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center px-5 py-[clamp(4.75rem,13dvh,6.5rem)] md:px-8 md:py-0">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-[clamp(0.9rem,3dvh,2rem)] text-center">
            <span className="mb-[clamp(0.4rem,1.5dvh,1rem)] block text-xs font-semibold uppercase tracking-widest text-primary">Contact</span>
            <h2
              style={{
                fontSize: "clamp(1.6rem, min(7vw, 6dvh), 3rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: 0,
                marginBottom: "0.75rem",
              }}
            >
              お問い合わせ
            </h2>
          </div>

          <div className="space-y-[clamp(0.5rem,1.8dvh,0.75rem)]">
            {contactLinks.map(({ icon, label, value, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-[clamp(0.75rem,2.4dvh,1rem)] transition-colors hover:border-primary/40 hover:bg-secondary md:gap-4"
                >
                  <span className="flex h-[clamp(2.25rem,6dvh,2.75rem)] w-[clamp(2.25rem,6dvh,2.75rem)] flex-shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    {icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {label}
                    </span>
                    <span className="block break-all text-[clamp(0.78rem,2dvh,0.875rem)] font-semibold text-foreground">{value}</span>
                  </span>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
