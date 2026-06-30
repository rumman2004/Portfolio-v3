import { useState, useEffect, useRef } from 'react';
import { FaGithub, FaChevronDown } from 'react-icons/fa6';
import { FiExternalLink } from 'react-icons/fi';

/*
 * Fonts: Syne (display/headings) + DM Mono (labels/mono)
 * — same pair used across Hero.jsx and Skills.jsx
 */

const GithubActivity = ({ username = "rumman2004" }) => {
    const isDark = false;

    const [contributions, setContributions]       = useState([]);
    const [totalContributions, setTotalContributions] = useState(0);
    const [loading, setLoading]                   = useState(true);
    const [error, setError]                       = useState(null);
    const [selectedYear, setSelectedYear]         = useState('last');
    const [availableYears, setAvailableYears]     = useState(['last']);
    const [monthLabels, setMonthLabels]           = useState([]);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    /* refs */
    const sectionRef  = useRef(null);
    const tagRef      = useRef(null);
    const rulerRef    = useRef(null);
    const headingRef  = useRef(null);
    const subRef      = useRef(null);
    const cardRef     = useRef(null);

    /* ── Available years ── */
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = ['last'];
        for (let i = 0; i <= 5; i++) years.push((currentYear - i).toString());
        setAvailableYears(years);
    }, []);

    /* ── Fetch contributions ── */
    useEffect(() => {
        const fetchContributions = async () => {
            if (username === "YOUR_GITHUB_USERNAME") { setLoading(false); return; }
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${username}?y=${selectedYear}`
                );
                if (!response.ok) throw new Error('Failed to fetch');
                processContributions(await response.json());
            } catch (err) {
                console.error('GitHub API Error:', err);
                setError('Failed to load GitHub data');
                generateFallbackData();
            } finally {
                setLoading(false);
            }
        };
        fetchContributions();
    }, [username, selectedYear]);

    const processContributions = (data) => {
        const weeks = []; let total = 0;
        const months = []; let lastMonth = null;
        if (data.contributions) {
            let currentWeek = [];
            data.contributions.forEach((c, i) => {
                total += c.count || 0;
                currentWeek.push({ date: c.date, count: c.count || 0, level: c.level });
                if (currentWeek.length === 7 || i === data.contributions.length - 1) {
                    weeks.push([...currentWeek]);
                    currentWeek = [];
                }
            });
            weeks.forEach((week, wi) => {
                if (!week.length) return;
                const d = new Date(week[0].date);
                const m = d.getMonth();
                if ((m !== lastMonth && wi > 0) || wi === 0) {
                    months.push({ name: d.toLocaleString('en', { month: 'short' }), weekIndex: wi });
                }
                lastMonth = m;
            });
        }
        setContributions(weeks); setTotalContributions(total); setMonthLabels(months);
    };

    const generateFallbackData = () => {
        const weeks = []; const today = new Date(); let total = 0;
        let currentWeek = []; const months = []; let lastMonth = null;
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today); date.setDate(date.getDate() - i);
            const count = Math.floor(Math.random() * 5); total += count;
            currentWeek.push({ date: date.toISOString().split('T')[0], count, level: count === 0 ? 0 : Math.min(count, 4) });
            if (currentWeek.length === 7) { weeks.push([...currentWeek]); currentWeek = []; }
        }
        if (currentWeek.length) weeks.push(currentWeek);
        weeks.forEach((week, wi) => {
            if (!week.length) return;
            const d = new Date(week[0].date); const m = d.getMonth();
            if ((m !== lastMonth && wi > 0) || wi === 0)
                months.push({ name: d.toLocaleString('en', { month: 'short' }), weekIndex: wi });
            lastMonth = m;
        });
        setContributions(weeks); setTotalContributions(total); setMonthLabels(months);
    };

    const getContributionColor = (level) => {
        return ['rgba(33,110,57,0.05)','#9be9a8','#40c463','#30a14e','#216e39'][level] ?? 'rgba(33,110,57,0.05)';
    };

    const formatDate = (ds) =>
        new Date(ds).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });



    return (
        <>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                .contribution-grid { min-width: max-content; padding-right: 1rem; }

                /* Cell hover ring */
                .cell-wrap:hover { ring: 2px; }
            `}</style>

            <section className="font-inter py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">

                <div className="relative w-full mb-14 md:mb-20 text-center flex flex-col items-center">
                    
                    {/* Background Script Typography */}
                    <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
                        <span className="font-script text-[20vw] sm:text-[22vw] md:text-[160px] lg:text-9xl text-[#d3d0d0] leading-none whitespace-nowrap drop-shadow-sm -rotate-2">
                            Contributions
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h2 className="font-headline text-5xl md:text-6xl lg:text-8xl text-[#1A1A1A] uppercase leading-[0.92] relative z-10 flex flex-col items-center">
                        <span className="font-script text-5xl md:text-5xl lg:text-6xl text-[#216e39] -rotate-6 translate-y-5 md:translate-y-7 drop-shadow-sm z-20 lowercase">
                            open
                        </span>
                        <span className="relative z-10 flex items-baseline">
                            SOURCE
                            <span className="text-[#216e39]">.</span>
                        </span>
                    </h2>

                    <p className="font-inter text-[#6B7280] text-base md:text-lg font-medium max-w-2xl mt-6 relative z-10 leading-relaxed">
                        A live view of my commit history and open-source contributions across repositories.
                    </p>

                </div>

                {/* ── Graph Card ── */}
                <div
                    className={`
                        rounded-[32px] p-6 md:p-10 relative transition-all duration-500
                        bg-white/[0.45] backdrop-blur-[20px] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]
                        max-w-6xl mx-auto
                    `}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 rounded-[32px] pointer-events-none" />
                    <div className="absolute top-0 left-6 w-12 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
                    <div className="relative z-10">
                    {loading ? (
                        <div className="h-40 flex items-center justify-center">
                            <div
                                style={{
                                    width: '2rem', height: '2rem',
                                    border: `3px solid #216e39`,
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite',
                                }}
                                />
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p
                                    className="font-inter"
                                    style={{ color: '#f87171', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}
                                >
                                    ⚠ Failed to load data
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="font-inter"
                                    style={{
                                        fontSize: '0.65rem', letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'underline',
                                        color: `rgb(var(--text-secondary))`,
                                        cursor: 'pointer',
                                        background: 'none', border: 'none',
                                    }}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div>
                                {/* Card top bar */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                                    <span
                                        className="font-inter"
                                        style={{
                                            fontWeight: 300,
                                            fontSize: '0.7rem',
                                            letterSpacing: '0.14em',
                                            color: '#4b5563',
                                        }}
                                    >
                                        <span style={{ color: '#2B2B2B', fontWeight: 500 }}>
                                            {totalContributions}
                                        </span>
                                        {' '}contributions in{' '}
                                        {selectedYear === 'last' ? 'the last year' : selectedYear}
                                    </span>

                                    <div className="flex items-center gap-3">
                                        {/* Year selector */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowYearDropdown(!showYearDropdown)}
                                                className="font-inter"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.68rem',
                                                    fontWeight: 400,
                                                    letterSpacing: '0.08em',
                                                    border: '1px solid rgba(255,255,255,0.6)',
                                                    background: 'rgba(255,255,255,0.4)',
                                                    backdropFilter: 'blur(10px)',
                                                    color: '#2B2B2B',
                                                    cursor: 'pointer',
                                                    transition: 'border-color 0.2s ease',
                                                }}
                                            >
                                                {selectedYear === 'last' ? 'Last Year' : selectedYear}
                                                <FaChevronDown
                                                    style={{
                                                        width: '0.75rem', height: '0.75rem',
                                                        transition: 'transform 0.2s ease',
                                                        transform: showYearDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    }}
                                                />
                                            </button>

                                            {showYearDropdown && (
                                                <div
                                                    style={{
                                                        position: 'absolute', right: 0, marginTop: '0.5rem',
                                                        padding: '0.25rem 0',
                                                        borderRadius: '0.6rem',
                                                        zIndex: 50,
                                                        minWidth: '8rem',
                                                        border: '1px solid rgba(255,255,255,0.6)',
                                                        background: 'rgba(255,255,255,0.7)',
                                                        backdropFilter: 'blur(20px)',
                                                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                                                    }}
                                                >
                                                    {availableYears.map((year) => (
                                                        <button
                                                            key={year}
                                                            onClick={() => { setSelectedYear(year); setShowYearDropdown(false); }}
                                                            className="font-inter"
                                                            style={{
                                                                display: 'block',
                                                                width: '100%',
                                                                textAlign: 'left',
                                                                padding: '0.45rem 1rem',
                                                                fontSize: '0.68rem',
                                                                letterSpacing: '0.08em',
                                                                fontWeight: selectedYear === year ? 500 : 300,
                                                                color: selectedYear === year ? '#216e39' : '#4b5563',
                                                                background: selectedYear === year
                                                                    ? 'rgba(33,110,57,0.1)'
                                                                    : 'transparent',
                                                                cursor: 'pointer',
                                                                border: 'none',
                                                                transition: 'background 0.15s ease',
                                                            }}
                                                        >
                                                            {year === 'last' ? 'Last Year' : year}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <a
                                            href={`https://github.com/${username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-inter"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                                fontSize: '0.68rem', letterSpacing: '0.08em',
                                                color: '#216e39',
                                                textDecoration: 'none',
                                                transition: 'opacity 0.2s ease',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                        >
                                            View Profile
                                            <FiExternalLink style={{ width: '0.6rem', height: '0.6rem' }} />
                                        </a>
                                    </div>
                                </div>

                                {/* Contribution Graph */}
                                <div className="overflow-x-auto no-scrollbar">
                                    <div className="contribution-grid inline-block">
                                        {/* Month labels */}
                                        <div className="relative h-5 mb-1 ml-[30px]">
                                            {monthLabels.map((month, idx) => (
                                                <span
                                                    key={idx}
                                                    className="font-inter"
                                                    style={{
                                                        position: 'absolute',
                                                        left: `${month.weekIndex * 13}px`,
                                                        fontSize: '0.6rem',
                                                        fontWeight: 300,
                                                        letterSpacing: '0.08em',
                                                        color: '#4b5563',
                                                    }}
                                                >
                                                    {month.name}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Grid + day labels */}
                                        <div style={{ display: 'flex', gap: '3px' }}>
                                            {/* Day labels */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingRight: '4px' }}>
                                                {['Mon', '', 'Wed', '', 'Fri', '', ''].map((label, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{ width: '22px', height: '11px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                                                    >
                                                        <span
                                                            className="font-inter"
                                                            style={{
                                                                fontSize: '0.52rem', fontWeight: 300,
                                                                letterSpacing: '0.06em',
                                                                color: '#4b5563',
                                                            }}
                                                        >
                                                            {label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Cells */}
                                            <div style={{ display: 'flex', gap: '3px' }}>
                                                {contributions.map((week, wIdx) => (
                                                    <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                        {week.map((day, dIdx) => (
                                                            <div
                                                                key={dIdx}
                                                                className="group relative cell-wrap"
                                                                style={{
                                                                    width: '10px', height: '10px',
                                                                    borderRadius: '2px',
                                                                    backgroundColor: getContributionColor(day.level),
                                                                    cursor: 'pointer',
                                                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                                                }}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.transform = 'scale(1.35)';
                                                                    e.currentTarget.style.boxShadow = `0 0 0 1.5px rgb(var(--accent))`;
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.transform = 'scale(1)';
                                                                    e.currentTarget.style.boxShadow = 'none';
                                                                }}
                                                            >
                                                                {/* Tooltip */}
                                                                <div
                                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none"
                                                                >
                                                                    <div
                                                                        className="font-inter"
                                                                        style={{
                                                                            fontSize: '0.6rem',
                                                                            fontWeight: 400,
                                                                            whiteSpace: 'nowrap',
                                                                            padding: '0.45rem 0.75rem',
                                                                            borderRadius: '0.5rem',
                                                                            background: 'rgba(255,255,255,0.85)',
                                                                            backdropFilter: 'blur(10px)',
                                                                            color: '#111',
                                                                            border: '1px solid rgba(0,0,0,0.05)',
                                                                            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                                                                            letterSpacing: '0.06em',
                                                                        }}
                                                                    >
                                                                        <div style={{ fontWeight: 400, marginBottom: '1px' }}>
                                                                            {day.count} contribution{day.count !== 1 ? 's' : ''}
                                                                        </div>
                                                                        <div style={{ opacity: 0.55, fontSize: '0.55rem' }}>
                                                                            {formatDate(day.date)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: '1rem',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid rgba(0,0,0,0.06)',
                                    }}
                                >
                                    <a
                                        href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-inter"
                                        style={{
                                            fontSize: '0.6rem', fontWeight: 400,
                                            letterSpacing: '0.06em',
                                            color: '#6b7280',
                                            transition: 'color 0.2s ease',
                                            textDecoration: 'none',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#216e39'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                                    >
                                        Learn how contributions are counted
                                    </a>

                                    <div
                                        className="font-inter"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            fontSize: '0.6rem', fontWeight: 400, letterSpacing: '0.1em',
                                            color: '#6b7280',
                                        }}
                                    >
                                        <span>Less</span>
                                        <div style={{ display: 'flex', gap: '3px' }}>
                                            {[0,1,2,3,4].map((level) => (
                                                <div
                                                    key={level}
                                                    style={{
                                                        width: '10px', height: '10px',
                                                        borderRadius: '2px',
                                                        backgroundColor: getContributionColor(level),
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span>More</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
            </section>
        </>
    );
};

export default GithubActivity;