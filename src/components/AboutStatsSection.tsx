'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Package, Clock, CheckCircle2, Sparkles, Award, Zap, TrendingUp } from 'lucide-react';
import { NormalizedAboutStats, DEFAULT_ABOUT_STATS, StatItemData } from '@/lib/content';

function getStatIcon(id: string, index: number) {
  const lower = id.toLowerCase();
  if (lower.includes('product') || lower.includes('item')) return Package;
  if (lower.includes('experience') || lower.includes('year') || lower.includes('decade')) return Clock;
  if (lower.includes('project') || lower.includes('client') || lower.includes('completion')) return CheckCircle2;
  if (lower.includes('award') || lower.includes('certif')) return Award;
  if (lower.includes('grow') || lower.includes('track')) return TrendingUp;
  const icons = [Package, Clock, CheckCircle2, Sparkles, Award, Zap];
  return icons[index % icons.length] || Sparkles;
}

export default function AboutStatsSection({ stats }: { stats?: NormalizedAboutStats }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const activeStats = stats || DEFAULT_ABOUT_STATS;
  const items = activeStats.items && activeStats.items.length > 0 ? activeStats.items : DEFAULT_ABOUT_STATS.items;

  // Initialize counts
  const initialCounts = items.reduce<{ [key: string]: number }>((acc, it) => {
    acc[it.id] = 0;
    return acc;
  }, {});

  const [counts, setCounts] = useState<{ [key: string]: number }>(initialCounts);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      const finalCounts = items.reduce<{ [key: string]: number }>((acc, it) => {
        acc[it.id] = it.target;
        return acc;
      }, {});
      setCounts(finalCounts);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Cubic ease-out curve
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const updated: { [key: string]: number } = {};
            items.forEach((it) => {
              updated[it.id] = Math.floor(easeOut * it.target);
            });
            setCounts(updated);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              const finalCounts = items.reduce<{ [key: string]: number }>((acc, it) => {
                acc[it.id] = it.target;
                return acc;
              }, {});
              setCounts(finalCounts);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      {
        threshold: 0.25,
      }
    );

    const currentElem = sectionRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [hasAnimated, items]);

  return (
    <section
      ref={sectionRef}
      aria-label="Some Cool Facts - Numbers Speak for Themselves"
      className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#020a17] via-[#041633] to-[#020c1d] border border-slate-700/80 shadow-2xl p-8 sm:p-12 lg:p-16 text-white"
    >
      {/* Background Decorative Ambient Radial Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sherman-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Subtle Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 backdrop-blur-md text-amber-400 text-xs font-bold uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeStats.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
            {activeStats.heading}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {activeStats.intro}
          </p>
        </div>

        {/* Animated Statistics Cards */}
        <div
          className={`grid grid-cols-1 ${
            items.length === 1
              ? 'max-w-md mx-auto'
              : items.length === 2
              ? 'md:grid-cols-2 max-w-3xl mx-auto'
              : items.length === 4
              ? 'md:grid-cols-2 lg:grid-cols-4'
              : 'md:grid-cols-3'
          } gap-6 sm:gap-8`}
        >
          {items.map((item, idx) => {
            const Icon = getStatIcon(item.id || item.label, idx);
            const currentCount = counts[item.id] ?? 0;

            return (
              <div
                key={item.id || idx}
                className="relative group p-6 sm:p-8 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between space-y-4 backdrop-blur-xs shadow-lg"
              >
                {/* Top Icon Pill */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-400/30 shadow-xs group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="h-1 w-8 bg-amber-400/40 group-hover:w-12 transition-all duration-300 rounded-full" />
                </div>

                {/* Animated Numeric Value */}
                <div className="space-y-1">
                  <div className="flex items-baseline">
                    <span className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight tabular-nums">
                      {currentCount}
                    </span>
                    {item.suffix && (
                      <span className="font-display text-3xl sm:text-4xl font-extrabold text-amber-400 ml-0.5">
                        {item.suffix}
                      </span>
                    )}
                  </div>

                  {/* Primary Label */}
                  <h3 className="text-base sm:text-lg font-bold text-amber-400 uppercase tracking-wide">
                    {item.label}
                  </h3>
                </div>

                {/* Brief Subtitle Description */}
                <p className="text-xs text-slate-300 font-normal leading-relaxed border-t border-white/10 pt-3">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
