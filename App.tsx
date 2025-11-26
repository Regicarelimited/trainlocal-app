import React, { useState, useMemo } from 'react';
import { Home, Crosshair, RotateCcw, Sparkles, ChevronDown, Dumbbell } from 'lucide-react';
import { COLORS, PT_DATA, POPULAR_FILTERS } from './constants';
import { TrainerProfile, ViewState } from './types';
import { PTCard } from './components/PTCard';
import { FilterModal, AIMatchmakerModal, BioModal, BookingModal, Lightbox } from './components/Modals';
import { FilterToggle } from './components/Shared';
import { HowItWorks, ClaimProfilePage, DashboardPage, LoginPage } from './components/Pages';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [user, setUser] = useState<TrainerProfile | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['All']);
  const [locationSearch, setLocationSearch] = useState(''); 
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false); 
  const [bioModalData, setBioModalData] = useState<TrainerProfile | null>(null);
  const [bookingModalData, setBookingModalData] = useState<TrainerProfile | null>(null);
  const [matchedProfileIds, setMatchedProfileIds] = useState<any[]>([]);
  const [lightboxData, setLightboxData] = useState<any>(null);
  const [sortBy, setSortBy] = useState('Relevance'); 

  const handleFilterToggle = (filter: string) => {
    if (filter === 'All') { setActiveFilters(['All']); return; }
    setActiveFilters(prev => {
      let newFilters = [...prev];
      if (newFilters.includes('All')) newFilters = [];
      if (newFilters.includes(filter)) newFilters = newFilters.filter(f => f !== filter); else newFilters.push(filter);
      if (newFilters.length === 0) return ['All'];
      return newFilters;
    });
  };

  const handleMatchFound = (ids: any[]) => { setMatchedProfileIds(ids); setActiveFilters(['All']); };
  const handleClearMatches = () => { setMatchedProfileIds([]); };
  const handleAutoLocate = () => { if (navigator.geolocation) { setTimeout(() => { setLocationSearch("Hastings"); }, 800); } else { alert("Geolocation is not supported."); } };
  const handlePreviewImage = (content: any, type: string, logoColor: any, rect: any) => { setLightboxData({ content, type, logoColor, initialRect: rect }); };

  const displayFilters = useMemo(() => {
    const activeNonPopular = activeFilters.filter(f => f !== 'All' && !POPULAR_FILTERS.includes(f));
    return [...POPULAR_FILTERS, ...activeNonPopular];
  }, [activeFilters]);

  const filteredData = useMemo(() => {
    let data = PT_DATA.filter(pt => {
      const matchesLocation = locationSearch === '' || pt.location.toLowerCase().includes(locationSearch.toLowerCase());
      const matchesFilter = activeFilters.includes('All') || pt.specialisms.some(s => activeFilters.some(f => s.toLowerCase() === f.toLowerCase()));
      return matchesLocation && matchesFilter;
    });
    if (matchedProfileIds.length > 0) {
      data = [...data].sort((a, b) => {
        const aIsMatched = matchedProfileIds.includes(a.id);
        const bIsMatched = matchedProfileIds.includes(b.id);
        if (aIsMatched && !bIsMatched) return -1; if (!aIsMatched && bIsMatched) return 1; return 0;
      });
    } else {
        switch (sortBy) {
            case 'Top Rated': data = [...data].sort((a, b) => b.rating - a.rating); break;
            case 'Most Reviewed': data = [...data].sort((a, b) => b.reviews - a.reviews); break;
            case 'Closest': if (locationSearch) { data = [...data].sort((a, b) => { const aLoc = a.location.toLowerCase(); const bLoc = b.location.toLowerCase(); const search = locationSearch.toLowerCase(); if (aLoc.includes(search) && !bLoc.includes(search)) return -1; if (!aLoc.includes(search) && bLoc.includes(search)) return 1; return 0; }); } break;
            default: break; 
        }
    }
    return data;
  }, [locationSearch, activeFilters, matchedProfileIds, sortBy]);

  const handleToggle = (id: string | number) => { setExpandedId(expandedId === id ? null : id); };
  
  if (view === 'dashboard' && user) return <DashboardPage user={user} onLogout={() => { setUser(null); setView('home'); }} />;

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ backgroundColor: COLORS.lightGrey, color: COLORS.darkGrey }}>
      {showMatchmaker && <AIMatchmakerModal onClose={() => setShowMatchmaker(false)} onMatchFound={handleMatchFound} />}
      <FilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} activeFilters={activeFilters} onToggleFilter={handleFilterToggle} />
      <BioModal isOpen={!!bioModalData} onClose={() => setBioModalData(null)} data={bioModalData} />
      <BookingModal isOpen={!!bookingModalData} onClose={() => setBookingModalData(null)} trainerData={bookingModalData} />
      <Lightbox content={lightboxData?.content} type={lightboxData?.type} logoColor={lightboxData?.logoColor} initialRect={lightboxData?.initialRect} onClose={() => setLightboxData(null)} />

      <nav className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-gray-100 px-6 py-4 w-full">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="flex items-center justify-center"><svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -translate-y-0.5"><path d="M16 1C10.477 1 6 5.477 6 11C6 18.5 16 29 16 29C16 29 26 18.5 26 11C26 5.477 21.523 1 16 1Z" fill={COLORS.darkPurple} /><circle cx="16" cy="11" r="6" fill="white" /><circle cx="16" cy="11" r="3" fill={COLORS.pink} /></svg></div>
            <h1 className="text-xl font-bold tracking-tight">
                <span style={{ color: COLORS.darkPurple, textShadow: '0px 1px 1px rgba(0,0,0,0.1)' }}>Train</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}>Local</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
              <button onClick={() => setView('home')} className="hover:opacity-80 transition-opacity" style={{ color: view === 'home' ? COLORS.pink : COLORS.darkPurple }} title="Home"><Home size={20} strokeWidth={3} /></button>
              <button onClick={() => setView('how-it-works')} className={`text-sm font-bold transition-colors hover:opacity-80`} style={{ color: view === 'how-it-works' ? COLORS.pink : COLORS.darkPurple }}>How It Works</button>
              <button onClick={() => setView('claim')} className={`text-sm font-bold transition-colors hover:opacity-80`} style={{ color: view === 'claim' ? COLORS.pink : COLORS.darkPurple }}>Claim Profile</button>
              <button onClick={() => setView('login')} className="px-4 py-2 rounded-full text-sm font-bold transition-colors hover:opacity-90" style={{ backgroundColor: COLORS.lightGrey, color: view === 'login' ? COLORS.pink : COLORS.darkPurple }}>Log In</button>
          </div>
        </div>
      </nav>

      {view === 'claim' ? (
        <ClaimProfilePage onClaimSuccess={(u: TrainerProfile) => { setUser(u); setView('dashboard'); }} />
      ) : view === 'login' ? (
        <LoginPage onLoginSuccess={(u: TrainerProfile) => { setUser(u); setView('dashboard'); }} />
      ) : (
        <main className="w-full px-6 py-8">
            {view === 'home' ? (
            <>
                <div className="mb-8 w-full">
                <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight" style={{ color: COLORS.darkPurple }}>
                    <span className="block mb-2" style={{ color: COLORS.darkPurple }}>Match with your ideal</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r pb-2" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}>Personal Trainer.</span>
                </h2>
                <p className="text-gray-500 text-lg max-w-2xl">Skip the generic search. Find local experts tailored to your specific goals, schedule, and personality.</p>
                </div>
                <div className="sticky top-[73px] z-20 py-4 -mx-6 px-6 bg-gradient-to-b from-[#F4F4F4] via-[#F4F4F4] to-transparent w-[calc(100%+3rem)]">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
                    <div className="relative group w-full flex-1 max-w-md">
                        <div className="absolute -inset-[2px] rounded-2xl opacity-70 group-focus-within:opacity-100 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}></div>
                        <div className="relative bg-white rounded-2xl flex items-center overflow-hidden">
                        <div className="pl-5 pr-3 flex items-center justify-center"><svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1C10.477 1 6 5.477 6 11C6 18.5 16 29 16 29C16 29 26 18.5 26 11C26 5.477 21.523 1 16 1Z" fill={COLORS.darkPurple} /><circle cx="16" cy="11" r="6" fill="white" /><circle cx="16" cy="11" r="3" fill={COLORS.pink} /></svg></div>
                        <input type="text" placeholder="Enter your postcode or city..." value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className="w-full py-5 text-sm bg-transparent border-none focus:ring-0 focus:outline-none text-pink-500 placeholder-gray-400 font-medium tracking-wide" />
                        <button onClick={handleAutoLocate} className="absolute right-3 p-2 rounded-full text-gray-400 hover:text-teal-500 hover:bg-teal-50 transition-all" title="Use my current location"><Crosshair size={22} /></button>
                        </div>
                    </div>
                    {matchedProfileIds.length > 0 ? (
                        <button onClick={handleClearMatches} className="relative overflow-hidden px-6 py-4 rounded-2xl font-bold text-white shadow-lg transform transition-all active:scale-95 hover:shadow-xl flex items-center justify-center gap-2 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ backgroundColor: COLORS.darkGrey }}><RotateCcw size={20} /><span>Clear Matches</span></button>
                    ) : (
                        <button onClick={() => setShowMatchmaker(true)} className="relative overflow-hidden px-6 py-4 rounded-2xl font-bold text-white shadow-lg transform transition-all active:scale-95 hover:shadow-xl flex items-center justify-center gap-2 shrink-0" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}><Sparkles className="text-white animate-pulse" size={20} /><span>Find My Match</span></button>
                    )}
                    </div>
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                            <div className="flex items-center gap-3"><FilterToggle label="All Filters" onClick={() => setShowFilterModal(true)} active={false} isMoreButton /><h3 className="text-xs font-bold uppercase tracking-wider opacity-40 hidden sm:block">Quick Filters</h3></div>
                            <div className="relative group"><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-white border border-gray-200 text-gray-600 py-2 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-100 hover:border-teal-200 cursor-pointer transition-all">{['Relevance', 'Closest', 'Top Rated', 'Most Reviewed'].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select><div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDown size={16} /></div></div>
                        </div>
                        <div className="flex flex-wrap gap-2">{displayFilters.map((filter) => (<FilterToggle key={filter} label={filter} active={activeFilters.includes(filter)} onClick={() => handleFilterToggle(filter)} />))}</div>
                    </div>
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 pb-20 items-start">
                {filteredData.length > 0 ? (filteredData.map((pt) => (<PTCard key={pt.id} data={pt} expanded={expandedId === pt.id} onToggle={() => handleToggle(pt.id)} onOpenBio={setBioModalData} onOpenBooking={setBookingModalData} isHighlighted={matchedProfileIds.includes(pt.id)} onPreview={handlePreviewImage} />))) : (<div className="col-span-full text-center py-20 opacity-50"><Dumbbell size={48} className="mx-auto mb-4 text-gray-300" /><p>No trainers found matching your criteria.</p></div>)}
                </div>
            </>
            ) : (
            <HowItWorks setView={setView} />
            )}
        </main>
      )}
    </div>
  );
}