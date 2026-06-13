import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AnimatedSection from '../AnimatedSection';
import { COLORS } from '../../theme';
import { TeamMember } from '../../types';
import dataService from '../../services/dataService'; // adjust path if needed


export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await dataService.getTeam();

        if (res.success && res.data) {
          const sortedData = res.data.sort(
            (a: any, b: any) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          setTeam(sortedData);
        }
      } catch (err) {
        console.error('Team API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // Scroll to hash member once team data is loaded
  useEffect(() => {
    if (!loading && team.length > 0 && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [loading, team, location.hash]);

  // Prevent empty render / animation glitch
  if (loading || team.length === 0) return null;

  return (
    <section
      id="team"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: COLORS.darkAlt }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.gridGold} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.blueAccent}, transparent)`,
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
          transform: 'translate(-30%, 30%)',
        }}
      />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">

        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-12 lg:mb-16 2xl:mb-20">
            <div className="section-label mx-auto w-fit mb-4">Leadership</div>

            <h2
              className="font-playfair text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4"
              style={{ color: COLORS.white }}
            >
              Meet Our <span className="grad-gold">Team</span>
            </h2>

            <div className="divider-gold w-24 mx-auto mb-6" />

            <p
              className="text-base sm:text-lg xl:text-xl max-w-2xl xl:max-w-3xl mx-auto"
              style={{ color: COLORS.textHalf }}
            >
              Our leadership team brings decades of experience in industrial services,
              driving innovation and excellence across all operations.
            </p>
          </div>
        </AnimatedSection>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-6 2xl:gap-8">
          {team.map((member, i) => (
            <AnimatedSection key={member._id ?? i} delay={i * 0.1}>
              <motion.div
                id={member.name.toLowerCase().replace(/\s+/g, '-')}
                whileHover={{ y: -8 }}
                className="rounded-3xl overflow-hidden group cursor-pointer relative h-full flex flex-col"
                style={{
                  background: COLORS.cardBgMedium,
                  border: `1px solid ${COLORS.dividerGold}`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = COLORS.goldBorderStrong;
                  el.style.boxShadow = COLORS.teamCardShadowHover;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = COLORS.dividerGold;
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Image */}
                <div className="relative w-full aspect-square overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />

                  <div
                    className="absolute inset-0"
                    style={{ background: COLORS.teamImageOverlay }}
                  />

                  {/* Role badge */}
                  <div className="absolute bottom-4 left-4 sm:left-5">
                    <div
                      className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        background: COLORS.border,
                        border: `1px solid ${COLORS.goldBorderStrong}`,
                        color: COLORS.accent,
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {member.role}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 xl:p-7 flex flex-col flex-1">
                  <h3
                    className="font-playfair text-lg sm:text-xl xl:text-2xl font-bold mb-1"
                    style={{ color: COLORS.white }}
                  >
                    {member.name}
                  </h3>

                  <div
                    className="h-[1px] mb-3 sm:mb-4"
                    style={{ background: COLORS.bottomLineGradient }}
                  />

                  <p
                    className="text-sm xl:text-base leading-relaxed flex-1"
                    style={{ color: COLORS.textMuted45 }}
                  >
                    {member.desc}
                  </p>
                </div>

                {/* Hover top line */}
                <div
                  className="absolute top-0 left-0 w-0 h-[3px] group-hover:w-full transition-all duration-500"
                  style={{ background: COLORS.goldBlueLineGradient }}
                />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}