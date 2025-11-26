import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Loader, Wand2, Phone, Mail, MessageSquare, User, Check, ArrowRight, Sparkles, Trophy } from 'lucide-react';
import { COLORS, SPECIALISM_CATEGORIES, PT_DATA } from '../constants';
import { TrainerProfile, BookingFormData } from '../types';
import { generateContent, generateMatchmakingQuestions, generateFinalMatch } from '../services/geminiService';

// --- Filter Modal ---
export const FilterModal = ({ isOpen, onClose, activeFilters, onToggleFilter }: any) => {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;
  const filteredCategories = Object.entries(SPECIALISM_CATEGORIES).reduce((acc, [category, tags]) => {
    const matchingTags = tags.filter(t => t.toLowerCase().includes(search.toLowerCase()));
    if (matchingTags.length > 0) { acc[category] = matchingTags; }
    return acc;
  }, {} as Record<string, string[]>);
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div><h3 className="text-xl font-bold text-gray-900">Filter by Specialism</h3><p className="text-sm text-gray-500">{activeFilters.length} selected</p></div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-500" /></button>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100"><div className="relative"><Search size={18} className="absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Find a niche..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pink-200 focus:outline-none" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {Object.keys(filteredCategories).length > 0 ? (Object.entries(filteredCategories).map(([category, tags]) => (<div key={category}><h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 ml-1">{category}</h4><div className="flex flex-wrap gap-2">{tags.map(tag => (<button key={tag} onClick={() => onToggleFilter(tag)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${activeFilters.includes(tag) ? 'bg-pink-50 border-pink-200 text-pink-600 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>{tag}</button>))}</div></div>))) : (<div className="text-center py-10 text-gray-400"><p>No tags found.</p></div>)}
        </div>
        <div className="p-6 border-t border-gray-100 bg-white"><button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}>Show Results</button></div>
      </div>
    </div>
  )
};

// --- Specialism Modal ---
export const SpecialismModal = ({ isOpen, onClose, activeTags, onToggleTag }: any) => {
    const [search, setSearch] = useState('');
    if (!isOpen) return null;
    const filteredCategories = Object.entries(SPECIALISM_CATEGORIES).reduce((acc, [category, tags]) => {
      const matchingTags = tags.filter(t => t.toLowerCase().includes(search.toLowerCase()));
      if (matchingTags.length > 0) { acc[category] = matchingTags; }
      return acc;
    }, {} as Record<string, string[]>);
    
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 max-h-[80vh] overflow-hidden m-4">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
            <div><h3 className="text-xl font-bold text-gray-900">Select Specialisms</h3><p className="text-sm text-gray-500">{activeTags.length}/7 selected</p></div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-500" /></button>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100"><div className="relative"><Search size={18} className="absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pink-200 focus:outline-none" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {Object.keys(filteredCategories).length > 0 ? (Object.entries(filteredCategories).map(([category, tags]) => (<div key={category}><h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 ml-1">{category}</h4><div className="flex flex-wrap gap-2">{tags.map(tag => (<button key={tag} onClick={() => onToggleTag(tag)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${activeTags.includes(tag) ? 'bg-pink-50 border-pink-200 text-pink-600 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'} ${activeTags.length >= 7 && !activeTags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={activeTags.length >= 7 && !activeTags.includes(tag)}>{tag}</button>))}</div></div>))) : (<div className="text-center py-10 text-gray-400"><p>No tags found.</p></div>)}
          </div>
          <div className="p-6 border-t border-gray-100 bg-white"><button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}>Done</button></div>
        </div>
      </div>
    );
};

// --- Booking Modal ---
export const BookingModal = ({ isOpen, onClose, trainerData }: { isOpen: boolean, onClose: () => void, trainerData: TrainerProfile | null }) => {
    const { name: trainerName, id: trainerId, specialisms } = trainerData || {};
    const [formData, setFormData] = useState<BookingFormData>({
        name: '', email: '', mobile: '', interests: [], otherInterest: '', availability: [], message: '', trainer: trainerName || '', trainerId: trainerId || ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showOtherInput, setShowOtherInput] = useState(false);

    const INTERESTS = useMemo(() => specialisms ? [...Array.from(new Set([...specialisms, "Other"]))] : ["General Fitness", "Other"], [specialisms]);
    const AVAILABILITIES = ["Weekday Mornings", "Weekday Days", "Weekday Evenings", "Weekends"];

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, trainer: trainerName || '', trainerId: trainerId || '', interests: [], otherInterest: '', availability: [], message: '', name: '', email: '', mobile: '' }));
            setShowOtherInput(false);
            setStatus('idle');
        }
    }, [isOpen, trainerName, trainerId]);

    const toggleSelection = (field: 'interests' | 'availability', value: string) => {
        if (value === 'Other') setShowOtherInput(!showOtherInput);
        setFormData(prev => {
            const current = prev[field];
            const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
            if (value === 'Other' && current.includes('Other')) return { ...prev, [field]: updated, otherInterest: '' };
            return { ...prev, [field]: updated };
        });
    };

    const handleAutoWrite = async () => {
        if (!formData.name) { alert("Please enter your name first so we can sign the message!"); return; }
        setIsGenerating(true);
        let selectedInterests = [...formData.interests];
        if (selectedInterests.includes("Other") && formData.otherInterest) { selectedInterests = selectedInterests.filter(i => i !== "Other"); selectedInterests.push(formData.otherInterest); }
        const interestsText = selectedInterests.length > 0 ? selectedInterests.join(', ') : "general fitness";
        const availText = formData.availability.length > 0 ? formData.availability.join(', ') : "flexible times";
        const prompt = `Draft a friendly, short inquiry message to a Personal Trainer named ${trainerName}. My name is ${formData.name}. I am interested in: ${interestsText}. I am available: ${availText}. Keep it professional but casual. Max 50 words.`;
        const generatedText = await generateContent(prompt);
        if (generatedText) setFormData(prev => ({ ...prev, message: generatedText })); else alert("Could not generate message. Please try again.");
        setIsGenerating(false);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email) { alert("Please fill in your name and email."); return; }
        setStatus('submitting');
        setTimeout(() => { setStatus('success'); setTimeout(() => { onClose(); setStatus('idle'); }, 2000); }, 1500);
    };

    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 overflow-hidden max-h-[95vh] overflow-y-auto">
          {status === 'success' ? (
             <div className="p-16 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 animate-bounce"><Check size={40} /></div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Sent!</h3>
                 <p className="text-gray-500">We've notified {trainerName}.<br/>They usually reply within 2 hours.</p>
             </div>
          ) : (
            <>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-pink-50 to-transparent sticky top-0 bg-white z-10">
                    <div><h3 className="text-xl font-bold" style={{ color: COLORS.darkPurple }}>Request a Chat</h3><p className="text-xs text-gray-500 mt-1">with <span className="font-bold text-pink-500">{trainerName}</span></p></div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative"><User size={18} className="absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all text-sm" /></div>
                        <div className="relative"><Mail size={18} className="absolute left-3 top-3 text-gray-400" /><input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all text-sm" /></div>
                    </div>
                    <div className="relative"><Phone size={18} className="absolute left-3 top-3 text-gray-400" /><input type="tel" placeholder="Mobile Number (Optional)" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all text-sm" /></div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wide">I'm Interested In...</label>
                        <div className="flex flex-wrap gap-2">
                            {INTERESTS.map(tag => (
                                <button key={tag} onClick={() => toggleSelection('interests', tag)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${formData.interests.includes(tag) ? 'bg-pink-50 border-pink-200 text-pink-500' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}>{tag}</button>
                            ))}
                        </div>
                        {showOtherInput && (
                            <div className="relative mt-2 animate-in fade-in slide-in-from-top-1"><input type="text" placeholder="Please specify other interest..." value={formData.otherInterest} onChange={e => setFormData({...formData, otherInterest: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-pink-50/50 border border-pink-100 focus:ring-2 focus:ring-pink-200 focus:outline-none text-sm text-gray-700" autoFocus /></div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wide">Preferred Times</label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABILITIES.map(a => (
                                <button key={a} onClick={() => toggleSelection('availability', a)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${formData.availability.includes(a) ? 'bg-teal-50 border-teal-200 text-teal-600' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}>{a}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-end"><label className="text-xs font-bold uppercase text-gray-400 tracking-wide">Message</label><button onClick={handleAutoWrite} disabled={isGenerating} className="text-[10px] font-bold text-pink-500 flex items-center gap-1 hover:underline disabled:opacity-50">{isGenerating ? <Loader size={10} className="animate-spin"/> : <Wand2 size={10} />} Auto-write</button></div>
                        <div className="relative"><MessageSquare size={18} className="absolute left-3 top-3 text-gray-400" /><textarea rows={3} placeholder="Anything else you'd like to ask?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all resize-none text-sm" /></div>
                    </div>
                    <button className="w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-pink-200 transform active:scale-95 transition-all mt-4 flex justify-center items-center gap-2" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }} onClick={handleSubmit} disabled={status === 'submitting'}>{status === 'submitting' ? <><Loader className="animate-spin" size={20} /> Sending...</> : "Send Request"}</button>
                </div>
            </>
          )}
        </div>
      </div>
    );
};

// --- AI Matchmaker Modal ---
export const AIMatchmakerModal = ({ onClose, onMatchFound }: { onClose: () => void, onMatchFound: (ids: any[]) => void }) => {
  const [step, setStep] = useState<'input' | 'questions' | 'results'>('input');
  const [userGoal, setUserGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matches, setMatches] = useState<any[]>([]);
  const [matchSummary, setMatchSummary] = useState('');

  const handleGenerateQuestions = async () => {
    if (!userGoal.trim()) return;
    setIsLoading(true);
    const questions = await generateMatchmakingQuestions(userGoal);
    setFollowUpQuestions(Array.isArray(questions) ? questions.slice(0, 1) : ["What is your main priority?"]);
    setStep('questions');
    setIsLoading(false);
  };

  const handleFinalMatch = async () => {
    setIsLoading(true);
    const result = await generateFinalMatch(userGoal, answers);
    setMatchSummary(result.summary);
    setMatches(result.matches || []);
    setStep('results');
    setIsLoading(false);
  };

  const handleShowMatches = () => { onMatchFound(matches.map(m => m.id)); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-white/50 animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-gradient-to-r from-pink-500 to-yellow-400 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"><X size={24} /></button>
          <div className="flex items-center gap-2 text-white mb-2"><Sparkles size={20} /></div> 
          <h3 className="text-2xl font-bold text-white">Find your perfect match</h3>
          <p className="text-white/90 text-sm mt-1">{step === 'input' ? "Tell us your goals." : step === 'questions' ? "Let's refine that." : "Here are your top matches!"}</p>
        </div>
        <div className="p-6">
          {step === 'input' && (<><textarea value={userGoal} onChange={(e) => setUserGoal(e.target.value)} placeholder="e.g., 'I want to run a marathon...'" className="w-full h-32 p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-pink-200 resize-none mb-4" /><button onClick={handleGenerateQuestions} disabled={isLoading || !userGoal} className="w-full py-4 rounded-xl font-bold text-white shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}>{isLoading ? <Loader className="animate-spin" /> : <><ArrowRight size={18} /> Next</>}</button></>)}
          
          {step === 'questions' && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
                {followUpQuestions.map((q, idx) => (
                    <div key={idx} className="animate-in fade-in slide-in-from-bottom-2">
                        <label className="block text-lg font-bold text-gray-800 mb-2">{q}</label>
                        <input type="text" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none text-lg" placeholder="Your answer..." onChange={(e) => setAnswers(prev => ({...prev, [q]: e.target.value}))} autoFocus />
                    </div>
                ))}
                <button onClick={handleFinalMatch} disabled={isLoading} className="w-full py-4 rounded-xl font-bold text-white shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 mt-4" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}>{isLoading ? <Loader className="animate-spin" /> : <><Sparkles size={18} /> Find My Match</>}</button>
            </div>
          )}

          {step === 'results' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="mb-4 bg-pink-50 p-4 rounded-xl border border-pink-100 text-center">
                 <h4 className="font-bold text-pink-600 text-lg">{matches.length} Matches Found</h4>
                 <p className="text-sm text-gray-600 mt-1">{matchSummary}</p>
              </div>
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {matches.map((m, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow ${m.grade.includes('Perfect') ? 'border-l-4 border-l-teal-500' : 'border-l-4 border-l-pink-500'}`}>
                      <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">{m.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.grade.includes('Perfect') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{m.grade}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{m.reason}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                          <Trophy size={24} className={m.grade.includes('Perfect') ? 'text-yellow-500' : 'text-gray-300'} />
                      </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3"><button onClick={() => { setStep('input'); setMatchSummary(''); setMatches([]); setUserGoal(''); }} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Search Again</button><button onClick={handleShowMatches} className="flex-1 py-3 rounded-xl font-bold text-white shadow-md transform active:scale-95 transition-all" style={{ backgroundColor: COLORS.teal }}>Show Matches</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Bio Modal ---
export const BioModal = ({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: TrainerProfile | null }) => {
  if (!isOpen || !data) return null;
  const isUrl = (str: string) => str && (str.startsWith('http') || str.startsWith('data:'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/50 rounded-full hover:bg-gray-100 transition-colors z-10"><X size={20} className="text-gray-600" /></button>
        <div className="h-32 w-full relative bg-gray-200">
            {isUrl(data.image) ? (
                <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-300 select-none">{data.image}</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>
        <div className="px-8 pb-8 pt-2 relative">
          <div className="w-16 h-16 rounded-2xl absolute -top-10 left-8 shadow-lg border-4 border-white overflow-hidden bg-gray-100">
             {isUrl(data.image) ? (
                 <img src={data.image} className="w-full h-full object-cover"/>
             ) : (
                 <div className="w-full h-full flex items-center justify-center text-xl font-bold" style={{ color: COLORS.darkPurple }}>{data.image}</div>
             )}
          </div>
          <div className="mt-8"><h3 className="text-2xl font-bold" style={{ color: COLORS.darkPurple }}>{data.name}</h3><p className="text-sm text-gray-500 font-medium mb-4">{data.businessName}</p><div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{data.bio}</div><div className="mt-6 pt-6 border-t border-gray-100 flex justify-end"><button onClick={onClose} className="px-6 py-2 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Close</button></div></div>
        </div>
      </div>
    </div>
  );
};

// --- Lightbox ---
export const Lightbox = ({ content, type, logoColor, initialRect, onClose }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => { if (initialRect) { const timer = setTimeout(() => setIsExpanded(true), 10); return () => clearTimeout(timer); } }, [initialRect]);
  if (!content || !initialRect) return null;
  const baseStyle: React.CSSProperties = { top: initialRect.top, left: initialRect.left, width: initialRect.width, height: initialRect.height, transform: 'translate(0, 0)', borderRadius: type === 'logo' ? '9999px' : '1rem' };
  const expandedStyle: React.CSSProperties = { top: '50%', left: '50%', width: type === 'logo' ? '300px' : 'min(90vw, 600px)', height: type === 'logo' ? '300px' : 'auto', transform: 'translate(-50%, -50%)', borderRadius: type === 'logo' ? '9999px' : '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' };
  
  const bgColor = logoColor || (type === 'text' ? '#E5E7EB' : 'transparent');
  const textColor = type === 'text' ? COLORS.darkPurple : 'white';

  return (
    <div className={`fixed inset-0 z-[70] flex items-center justify-center transition-all duration-500 ease-out ${isExpanded ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'}`} onClick={() => { setIsExpanded(false); setTimeout(onClose, 300); }}>
       <div className="fixed overflow-hidden flex items-center justify-center z-[80] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)" style={isExpanded ? expandedStyle : baseStyle} onClick={e => e.stopPropagation()}>
        {type === 'image' ? (
            <img src={content} className="w-full h-full object-cover" alt="Preview" />
        ) : (
            <div className="w-full h-full flex items-center justify-center border-8 border-white text-[8rem] font-bold" style={{ backgroundColor: bgColor, fontSize: isExpanded ? '8rem' : '1rem', color: textColor }}>
                <div className="w-full h-full flex items-center justify-center transition-all duration-500">{typeof content === 'object' ? content : content}</div>
            </div>
        )}
       </div>
       <button className={`absolute top-6 right-6 text-white/80 hover:text-white transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} onClick={(e) => { e.stopPropagation(); setIsExpanded(false); setTimeout(onClose, 300); }}><X size={32} /></button>
    </div>
  )
};
