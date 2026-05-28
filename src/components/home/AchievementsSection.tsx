import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import dataService from '../../services/dataService';
import * as Icons from 'lucide-react';

export function AchievementsSection() {

  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await dataService.getAchievements();

        if (res.success && res.data) {
          // ✅ oldest first
          const sorted = res.data.sort(
            (a: any, b: any) => Number(a.year) - Number(b.year)
          );

          setAchievements(sorted);
        }
      } catch (err) {
        console.error('Achievements API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading || achievements.length === 0) return null;

  return (
    <section
      id="achievements"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: COLORS.primary }}
    >
      {/* Center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[520px] h-[520px] sm:w-[600px] sm:h-[600px] xl:w-[760px] xl:h-[760px]
                   2xl:w-[900px] 2xl:h-[900px] rounded-full opacity-5 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${COLORS.accent}, transparent)` }}
      />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12 lg:mb-16">
            <div className="section-label mx-auto w-fit mb-4">Milestones</div>

            <h2
              className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4"
              style={{ color: COLORS.white }}
            >
              Our <span className="grad-gold">Achievements</span>
            </h2>

            <div className="divider-gold w-24 mx-auto" />

            <p
              className="mt-5 text-base sm:text-lg xl:text-xl max-w-2xl xl:max-w-3xl mx-auto"
              style={{ color: COLORS.textHalf }}
            >
              Key milestones that reflect our growth, trust, and delivery excellence.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 2xl:gap-7">
          {achievements.map((a, i) => {

            // ✅ dynamic icon (NO structure change)
            const IconComponent =
              (Icons as any)[a.icon] || Icons.Target;

            return (
              <AnimatedSection key={a._id ?? i} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="flex gap-5 xl:gap-6 p-5 sm:p-7 xl:p-8 rounded-2xl xl:rounded-3xl
                             transition-all duration-300 group h-full"
                  style={{
                    background: COLORS.cardBgMedium,
                    border: `1px solid ${COLORS.dividerGold}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = COLORS.goldBorderStrong;
                    (e.currentTarget as HTMLElement).style.boxShadow = COLORS.achievementShadowHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = COLORS.dividerGold;
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  {/* LEFT (unchanged) */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 xl:w-[72px] xl:h-[72px] rounded-2xl
                                 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: COLORS.dividerGold,
                        border: `1px solid ${COLORS.goldSoftBg}`,
                      }}
                    >
                      <IconComponent
                        className="w-6 h-6 xl:w-7 xl:h-7"
                        style={{ color: COLORS.accent }}
                      />
                    </div>

                    <div
                      className="text-center mt-2 text-[11px] xl:text-xs font-mono"
                      style={{ color: COLORS.goldIconSoft }}
                    >
                      {a.year}
                    </div>
                  </div>

                  {/* RIGHT (unchanged) */}
                  <div className="min-w-0">
                    <h3
                      className="font-playfair text-lg sm:text-xl xl:text-2xl font-bold mb-2 leading-snug"
                      style={{ color: COLORS.white }}
                    >
                      {a.title}
                    </h3>

                    <p
                      className="text-sm xl:text-base leading-relaxed"
                      style={{ color: COLORS.textHalf }}
                    >
                      {a.desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}