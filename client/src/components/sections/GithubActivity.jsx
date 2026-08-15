import { useState, useEffect } from 'react';
import { FiExternalLink } from 'react-icons/fi';

const COLORS = [
  '#dde1e7',  // level 0 — visible neutral gray
  '#a8f0c0',  // level 1 — soft green
  '#3dd68c',  // level 2 — medium green
  '#1a9e52',  // level 3 — strong green
  '#0d5c2e',  // level 4 — deep forest green
];

const getColor = (level) => COLORS[Math.min(level ?? 0, 4)];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const formatDate = (ds) =>
  new Date(ds + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

/* ── Constants ── */
const CELL = 13;   // dot diameter px
const GAP  = 4;    // gap between dots px
const STEP = CELL + GAP;  // total step per column

const GithubActivity = ({ username = 'rumman2004' }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [weeks, setWeeks]               = useState([]);
  const [total, setTotal]               = useState(0);
  const [monthLabels, setMonthLabels]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [tooltip, setTooltip]           = useState(null); // { text, x, y }

  useEffect(() => {
    setLoading(true);
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${selectedYear}`)
      .then(r => r.json())
      .then(data => {
        const raw = data?.contributions ?? [];
        setTotal(raw.reduce((s, d) => s + (d.count || 0), 0));

        // Group into weeks
        const grouped = [];
        let week = [];
        raw.forEach((day, i) => {
          week.push(day);
          if (week.length === 7 || i === raw.length - 1) {
            grouped.push([...week]);
            week = [];
          }
        });
        setWeeks(grouped);

        // Build month labels pinned to the FIRST week of that month
        const labels = [];
        let lastMonth = -1;
        grouped.forEach((w, wi) => {
          if (!w.length) return;
          const m = new Date(w[0].date + 'T00:00:00').getMonth();
          if (m !== lastMonth) {
            labels.push({ label: MONTHS[m], wi, px: wi * STEP });
            lastMonth = m;
          }
        });
        setMonthLabels(labels);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username, selectedYear]);

  const gridWidth = weeks.length * STEP - GAP;

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 font-inter">

      {/* ── Editorial heading ── */}
      <div className="relative mb-14 text-center flex flex-col items-center">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
          <span className="font-script text-[20vw] sm:text-[160px] lg:text-[11rem] text-[#d3d0d0] leading-none whitespace-nowrap -rotate-2 block">
            Contributions
          </span>
        </div>
        <h2 className="font-headline text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] uppercase leading-[0.92] relative z-10 flex flex-col items-center">
          <span className="font-script text-5xl md:text-6xl text-[#216e39] -rotate-6 translate-y-5 md:translate-y-7 drop-shadow-sm lowercase z-20">
            open
          </span>
          <span className="flex items-baseline">
            SOURCE<span className="text-[#216e39]">.</span>
          </span>
        </h2>
        <p className="text-[#595959] text-base md:text-lg font-medium max-w-xl mt-6 relative z-10 leading-relaxed">
          A live snapshot of my GitHub activity and open-source contributions.
        </p>
      </div>

      {/* ── Card ── */}
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-gray-200/80 rounded-3xl shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 tracking-tight">GitHub Activity</h3>
            <p className="text-xs text-gray-400 mt-0.5">{username}</p>
          </div>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-[#216e39] hover:opacity-70 transition-opacity"
          >
            View Profile <FiExternalLink size={11} />
          </a>
        </div>

        {/* Card Body */}
        <div className="px-7 pt-5 pb-6">
          {loading ? (
            <div className="h-36 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-[#216e39] border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="flex gap-6 items-start">

              {/* ── Heatmap ── */}
              <div className="flex-1 min-w-0 overflow-x-auto">
                <div style={{ minWidth: `${gridWidth}px`, position: 'relative' }}>

                  {/* Month labels — pixel-perfect positioned */}
                  <div style={{ position: 'relative', height: '18px', marginBottom: '6px' }}>
                    {monthLabels.map((m, i) => (
                      <span
                        key={i}
                        style={{
                          position:  'absolute',
                          left:      `${m.px}px`,
                          top:       0,
                          fontSize:  '10px',
                          fontWeight: 500,
                          color:     '#9ca3af',
                          letterSpacing: '0.04em',
                          userSelect: 'none',
                        }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>

                  {/* Dot columns */}
                  <div
                    style={{
                      display:            'flex',
                      gap:                `${GAP}px`,
                      position:           'relative',
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {weeks.map((week, wi) => (
                      <div
                        key={wi}
                        style={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}
                      >
                        {week.map((day, di) => (
                          <div
                            key={di}
                            style={{
                              width:           `${CELL}px`,
                              height:          `${CELL}px`,
                              borderRadius:    '50%',
                              backgroundColor: getColor(day.level),
                              cursor:          'default',
                              flexShrink:      0,
                              transition:      'transform 0.12s, opacity 0.12s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'scale(1.5)';
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTooltip({
                                text: `${day.count} contribution${day.count !== 1 ? 's' : ''} · ${formatDate(day.date)}`,
                                // use relative positioning in tooltip portaling via state
                              });
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            title={`${day.count} contribution${day.count !== 1 ? 's' : ''} — ${formatDate(day.date)}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{total.toLocaleString()}</span>
                      {' '}contributions in {selectedYear}
                    </span>

                    {/* Legend */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#9ca3af' }}>
                      <span>Less</span>
                      {[0,1,2,3,4].map(l => (
                        <div
                          key={l}
                          style={{
                            width:           10,
                            height:          10,
                            borderRadius:    '50%',
                            backgroundColor: getColor(l),
                          }}
                        />
                      ))}
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Year pills ── */}
              <div className="flex flex-col gap-2 flex-shrink-0 pt-5">
                {years.map(y => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    style={{
                      padding:       '6px 18px',
                      borderRadius:  '999px',
                      fontSize:      '12px',
                      fontWeight:    600,
                      cursor:        'pointer',
                      transition:    'all 0.2s ease',
                      border:        selectedYear === y ? 'none' : '1px solid #e5e7eb',
                      background:    selectedYear === y ? '#216e39' : 'transparent',
                      color:         selectedYear === y ? '#fff'    : '#6b7280',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GithubActivity;