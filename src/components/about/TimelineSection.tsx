import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedSection from '../AnimatedSection';
import { TimelineCard } from './TimelineCard';
import { COLORS } from '../../theme';
import dataService from '../../services/dataService';
import * as Icons from 'lucide-react';

export function TimelineSection() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch timeline from API
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await dataService.getTimeline();

        if (res.success && res.data) {
          // ✅ Oldest first (based on year)
          const sorted = res.data.sort(
            (a: any, b: any) => Number(a.year) - Number(b.year)
          );

          setTimeline(sorted);
        }
      } catch (err) {
        console.error('Timeline API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  // Prevent empty render
  if (loading || timeline.length === 0) return null;

  return (
    <section
      id="timeline"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: COLORS.primary }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

        {/* Heading */}
        <AnimatedSection>
          <div className="text-center mb-16 lg:mb-20 2xl:mb-24">
            <div className="section-label mx-auto w-fit mb-4">Our Journey</div>

            <h2
              className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4"
              style={{ color: COLORS.white }}
            >
              The CVS <span className="grad-gold">Timeline</span>
            </h2>

            <div className="divider-gold w-24 mx-auto" />
          </div>
        </AnimatedSection>

        {/* Timeline */}
        <div className="relative max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">

          {/* Vertical line */}
          <div
            className="absolute left-[23px] lg:left-1/2 top-0 bottom-0 w-[2px] lg:-translate-x-[1px]"
            style={{ background: COLORS.timelineRailGradient }}
          />

          {/* Events */}
          {timeline.map((event, index) => {
            const isEven = index % 2 === 0;

            // ✅ Dynamic icon from DB string
            const IconComponent =
              (Icons as any)[event.icon] || Icons.Briefcase;

            return (
              <div
                key={event._id ?? index}
                className="relative mb-12 xl:mb-16 2xl:mb-20"
              >
                {/* ── DESKTOP ── */}
                <div className="hidden lg:flex items-start">

                  {/* Left side */}
                  <div className="w-[calc(50%-44px)]">
                    {isEven && (
                      <AnimatedSection direction="left" delay={index * 0.08}>
                        <TimelineCard event={event} align="right" />
                      </AnimatedSection>
                    )}
                  </div>

                  {/* Center node */}
                  <div className="w-[88px] flex flex-col items-center relative z-10 pt-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15, type: 'spring' }}
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: event.featured
                          ? COLORS.goldGradientDark
                          : COLORS.timelineNodeBg,
                        border: `3px solid ${
                          event.featured ? COLORS.accent : COLORS.goldBorder35
                        }`,
                        boxShadow: event.featured
                          ? COLORS.timelineFeaturedShadow
                          : COLORS.timelineNodeShadow,
                      }}
                    >
                      <IconComponent
                        className="w-6 h-6"
                        style={{
                          color: event.featured
                            ? COLORS.primary
                            : COLORS.accent,
                        }}
                      />
                    </motion.div>

                    {/* Year */}
                    <div
                      className="mt-2 font-mono text-xs font-bold tracking-widest text-center"
                      style={{
                        color: event.featured
                          ? COLORS.accent
                          : COLORS.goldIconSoft,
                      }}
                    >
                      {event.year}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="w-[calc(50%-44px)]">
                    {!isEven && (
                      <AnimatedSection direction="right" delay={index * 0.08}>
                        <TimelineCard event={event} align="left" />
                      </AnimatedSection>
                    )}
                  </div>
                </div>

                {/* ── MOBILE ── */}
                <div className="lg:hidden flex items-start gap-4">
                  {/* Node */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: event.featured
                          ? COLORS.goldGradientDark
                          : COLORS.timelineNodeBg,
                        border: `2px solid ${
                          event.featured ? COLORS.accent : COLORS.goldBorder35
                        }`,
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div
                      className="text-xs font-bold mb-2"
                      style={{
                        color: event.featured
                          ? COLORS.accent
                          : COLORS.goldIconSoft,
                      }}
                    >
                      {event.year}
                    </div>

                    <AnimatedSection direction="right" delay={index * 0.06}>
                      <TimelineCard event={event} align="left" />
                    </AnimatedSection>
                  </div>
                </div>
              </div>
            );
          })}

          {/* End dot */}
          <div className="hidden lg:block relative z-10 mt-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-5 h-5 rounded-full mx-auto"
              style={{
                background: COLORS.accent,
                boxShadow: COLORS.timelineEndDotShadow,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}