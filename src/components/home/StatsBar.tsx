import { useEffect, useState } from 'react';
import { Users, Award, Globe, Briefcase } from 'lucide-react';
import { CountUp } from '../ui';
import { COLORS } from '../../theme';
import dataService from '../../services/dataService';

export function StatsBar() {
  const [statsData, setStatsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const staticStats = [
    { icon: Users, suffix: '+', color: '#d4a017' },
    { icon: Award, suffix: '+', color: '#1a5fb4' },
    { icon: Globe, suffix: '+', color: '#d4a017' },
    { icon: Briefcase, suffix: '+', color: '#1a5fb4' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dataService.getStats();

        if (res.success && res.data) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.error('Stats API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || statsData.length === 0) return null;

  const mergedStats = staticStats.map((s, i) => ({
    ...s,
    value: statsData[i]?.value || 0,
    label: statsData[i]?.label || '',
  }));

  return (
    <section
      className="relative py-8 lg:py-10"
      style={{
        background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.statsGradientMid}, ${COLORS.primary})`,
        borderTop: `1px solid ${COLORS.border}`,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-0 gap-y-0">
          {mergedStats.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-4 py-4 lg:py-6 group border-b md:border-b-0 md:border-r last:md:border-r-0"
              style={{
                borderColor: COLORS.dividerGold,
              }}
            >
              {/* ICON */}
              <div
                className="w-12 h-12 xl:w-14 xl:h-14 rounded-xl flex items-center justify-center
                           flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: COLORS.cardGoldSoft,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <s.icon
                  className="w-5 h-5 xl:w-6 xl:h-6"
                  style={{ color: COLORS.accent }}
                />
              </div>

              {/* TEXT */}
              <div>
                <div
                  className="text-2xl xl:text-3xl 2xl:text-4xl font-bold font-rajdhani"
                  style={{ color: COLORS.accent }}
                >
                  <CountUp end={s.value} suffix={s.suffix} />
                </div>
                <div
                  className="text-xs xl:text-sm uppercase tracking-wider"
                  style={{ color: COLORS.textMuted }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}