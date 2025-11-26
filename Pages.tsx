import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles, Volume2, Wand2, MapPin, Star, Bot, Search, PlusCircle, CheckCircle2, Check, Upload, Mic, Info, Save, Mail, User, Users, AlertTriangle, Settings, AtSign, Loader, ExternalLink } from 'lucide-react';
import { COLORS, PT_DATA } from '../constants';
import { TrainerProfile, Lead } from '../types';
import { Tag, Tooltip } from './Shared';
import { PTCard } from './PTCard';
import { SpecialismModal } from './Modals';
import { generateContent } from '../services/geminiService';

// --- How It Works ---
export const HowItWorks: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'trainers'>('members');
  
  const features = activeTab === 'members' ? [
    { title: "Tell us your goal", desc: "Don't just search by location. Use our AI Matchmaker to find a trainer who specializes in exactly what you need.", icon: <Sparkles size={28} className="text-white" />, color: COLORS.teal, image: "https://picsum.photos/600/600" },
    { title: "Hear their vibe", desc: "Photos only say so much. Listen to 30-second Voice Intros to see if a trainer's personality clicks with yours.", icon: <Volume2 size={28} className="text-white" />, color: COLORS.pink, image: "https://picsum.photos/601/601" },
    { title: "Break the ice instantly", desc: "Struggling with what to say? Our 'Auto-Write' feature drafts the perfect inquiry message for you.", icon: <Wand2 size={28} className="text-white" />, color: COLORS.yellow, image: "https://picsum.photos/602/602" }
  ] : [
    { title: "Claim your digital real estate", desc: "Your profile might already exist. Search for it, verify you're you, and instantly gain control.", icon: <MapPin size={28} className="text-white" />, color: COLORS.blue, image: "https://picsum.photos/603/603" },
    { title: "Stand out with Smart Tags", desc: "Select up to 7 niche specialisms (like 'Menopause Support') to get matched with high-intent leads.", icon: <Star size={28} className="text-white" />, color: COLORS.teal, image: "https://picsum.photos/604/604" },
    { title: "Let AI handle the admin", desc: "Set your 'Tone of Voice' in the dashboard, and let our AI Auto-Responder handle new inquiries.", icon: <Bot size={28} className="text-white" />, color: COLORS.darkPurple, image: "https://picsum.photos/605/605" }
  ];

  return (
    <div className="py-12 max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#2E294E]">Fitness, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">Simplified.</span></h2>
        <div className="inline-flex bg-white p-1.5 rounded-full shadow-md border border-gray-100 relative mt-8">
           <div className={`absolute top-1.5 bottom-1.5 w-[50%] bg-[#2E294E] rounded-full shadow-sm transition-all duration-300 ease-out ${activeTab === 'members' ? 'left-1.5' : 'left-[calc(50%-6px)] translate-x-1.5'}`}></div>
           <button onClick={() => setActiveTab('members')} className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors w-40 ${activeTab === 'members' ? 'text-white' : 'text-[#2E294E] hover:opacity-80'}`}>For Members</button>
           <button onClick={() => setActiveTab('trainers')} className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors w-40 ${activeTab === 'trainers' ? 'text-white' : 'text-[#2E294E] hover:opacity-80'}`}>For Trainers</button>
        </div>
      </div>
      <div className="space-y-24">
        {features.map((feature, i) => (
          <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
             <div className="flex-1 space-y-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 mb-6" style={{ backgroundColor: feature.color }}>{feature.icon}</div>
                <h3 className="text-3xl font-bold text-[#2E294E]">{feature.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{feature.desc}</p>
             </div>
             <div className="flex-1 relative group cursor-default">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                   <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                </div>
             </div>
          </div>
        ))}
      </div>
      <div className="mt-24 bg-[#2E294E] rounded-3xl p-12 text-center relative overflow-hidden">
         <div className="relative z-10">
           <h3 className="text-3xl font-bold text-white mb-6">Ready to get started?</h3>
           <button onClick={() => setView(activeTab === 'members' ? 'home' : 'claim')} className="px-12 py-5 rounded-xl font-bold text-[#2E294E] shadow-xl text-lg transform hover:scale-105 transition-all" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.yellow}, ${COLORS.pink})` }}>{activeTab === 'members' ? "Find Your Trainer" : "Claim Your Profile"}</button>
         </div>
      </div>
    </div>
  );
};

// --- Claim Profile ---
export const ClaimProfilePage = ({ onClaimSuccess }: any) => {
    const [search, setSearch] = useState('');
    const [selectedProfile, setSelectedProfile] = useState<TrainerProfile | null>(null);
    const [showSpecialismModal, setShowSpecialismModal] = useState(false);
    const [editData, setEditData] = useState<TrainerProfile | null>(null);

    useEffect(() => { if (selectedProfile) setEditData({ ...selectedProfile }); }, [selectedProfile]);

    const handleUpdateField = (field: string, value: any) => setEditData(prev => prev ? ({ ...prev, [field]: value }) : null);
    
    const handleFileUpload = (field: string, file: File) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        if (field === 'image') setEditData(prev => prev ? ({ ...prev, image: url }) : null);
        else if (field === 'logo') setEditData(prev => prev ? ({ ...prev, logoImage: url, customLogo: null }) : null);
        else if (field === 'audio') setEditData(prev => prev ? ({ ...prev, audioUrl: url }) : null);
    };

    const handleToggleSpecialism = (tag: string) => {
        setEditData(prev => {
            if (!prev) return null;
            if (prev.specialisms.includes(tag)) return { ...prev, specialisms: prev.specialisms.filter(t => t !== tag) };
            if (prev.specialisms.length >= 7) return prev;
            return { ...prev, specialisms: [...prev.specialisms, tag] };
        });
    };

    const filtered = PT_DATA.filter(pt => pt.name.toLowerCase().includes(search.toLowerCase()) || pt.businessName.toLowerCase().includes(search.toLowerCase()));

    if (!selectedProfile || !editData) {
        return (
            <div className="min-h-screen bg-white flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-start border-r border-gray-100 pt-20">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-4xl font-extrabold text-[#2E294E] mb-4">Claim Your Profile</h2>
                        <div className="relative mb-6">
                            <Search size={20} className="absolute left-4 top-4 text-gray-400" />
                            <input type="text" placeholder="Search your name or business..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none shadow-sm text-lg" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <button onClick={() => { const newPt: TrainerProfile = { id: 999, name: "New Trainer", businessName: "My Business", location: "Location", rating: 5.0, reviews: 0, specialisms: [], image: "https://picsum.photos/200/200", bio: "Tell us about yourself...", price: "£0", availability: "Mon-Fri" }; setEditData(newPt); setSelectedProfile(newPt); }} className="w-full py-4 rounded-2xl border-2 border-dashed border-pink-200 text-pink-500 font-bold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2 mb-8">
                            <PlusCircle size={20} /> Create New Profile
                        </button>
                        {search && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                {filtered.map(pt => (
                                    <div key={pt.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:shadow-md transition-all bg-white group cursor-pointer" onClick={() => { setEditData({...pt}); setSelectedProfile(pt); }}>
                                        <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden"><img src={pt.image} className="w-full h-full object-cover" /></div><div><h4 className="font-bold text-[#2E294E]">{pt.name}</h4><p className="text-xs text-gray-500">{pt.businessName}</p></div></div>
                                        <button className="text-xs font-bold text-white bg-pink-500 px-6 py-2 rounded-lg group-hover:bg-pink-600 transition-colors">Claim</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12 relative overflow-hidden">
                    <div className="max-w-md w-full relative z-10 text-center">
                        <h4 className="font-bold text-[#2E294E] flex items-center gap-2 justify-center mb-4"><Bot size={18} className="text-teal-500"/> What happens next?</h4>
                        <div className="mt-4 space-y-3 text-sm text-gray-600 bg-white p-6 rounded-2xl shadow-sm">
                            <div className="flex gap-2"><Check size={16} className="text-green-500 shrink-0"/><span>Access your <strong>Trainer Dashboard</strong>.</span></div>
                            <div className="flex gap-2"><Check size={16} className="text-green-500 shrink-0"/><span>Assign <strong>@trainlocal.chat</strong> alias.</span></div>
                            <div className="flex gap-2"><Check size={16} className="text-green-500 shrink-0"/><span>Enable <strong>AI Auto-Responder</strong>.</span></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-6">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-6">
                    <button onClick={() => setSelectedProfile(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold text-sm mb-4"><ArrowRight size={16} className="rotate-180"/> Back to Search</button>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 text-[#2E294E]">Edit Profile Details</h2>
                        <div className="space-y-5">
                            <input type="text" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Full Name" value={editData.name} onChange={e => handleUpdateField('name', e.target.value)} />
                            <input type="text" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Business Name" value={editData.businessName} onChange={e => handleUpdateField('businessName', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition-colors">
                                    <Upload size={20} className="text-gray-400 mb-1" /><span className="text-[10px] text-gray-500 font-bold">Profile Photo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload('image', e.target.files![0])} />
                                </label>
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition-colors">
                                    <Upload size={20} className="text-gray-400 mb-1" /><span className="text-[10px] text-gray-500 font-bold">Logo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload('logo', e.target.files![0])} />
                                </label>
                            </div>
                            <label className="flex items-center gap-3 w-full p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500"><Mic size={16} /></div>
                                <span className="text-xs text-gray-500 font-bold flex-1">Upload Audio Intro</span>
                                <input type="file" className="hidden" accept="audio/*" onChange={(e) => handleFileUpload('audio', e.target.files![0])} />
                            </label>
                            <input type="text" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Location" value={editData.location} onChange={e => handleUpdateField('location', e.target.value)} />
                            <input type="text" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Hourly Rate" value={editData.price} onChange={e => handleUpdateField('price', e.target.value)} />
                            <div>
                                <button onClick={() => setShowSpecialismModal(true)} className="w-full py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-pink-300 mb-2"><PlusCircle size={16} className="inline mr-2"/> Select Specialisms</button>
                                <div className="flex flex-wrap gap-1">
                                    {editData.specialisms.map(t => <Tag key={t} text={t} color={COLORS.teal} onRemove={() => handleToggleSpecialism(t)} />)}
                                </div>
                            </div>
                            <textarea rows={5} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm" placeholder="Bio" value={editData.bio} onChange={e => handleUpdateField('bio', e.target.value)} />
                        </div>
                    </div>
                    <button className="w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }} onClick={() => onClaimSuccess(editData)}>
                        <CheckCircle2 size={20}/> Save & Claim Profile
                    </button>
                </div>
                <div className="lg:col-span-7 relative hidden lg:block">
                    <div className="sticky top-10 transform scale-105 origin-top p-4">
                        <PTCard data={editData} expanded={true} onToggle={() => {}} onOpenBio={() => {}} onOpenBooking={() => {}} isHighlighted={false} onPreview={() => {}} />
                        <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-800 text-sm">
                            <h4 className="font-bold mb-2 flex items-center gap-2"><Info size={16}/> Why claim?</h4>
                            <p>Claiming gives you control. Once you save, you'll instantly access your dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>
            <SpecialismModal isOpen={showSpecialismModal} onClose={() => setShowSpecialismModal(false)} activeTags={editData.specialisms} onToggleTag={handleToggleSpecialism} />
        </div>
    );
};

// --- Dashboard ---
export const DashboardPage = ({ user, onLogout }: { user: TrainerProfile, onLogout: () => void }) => {
    const [activeTab, setActiveTab] = useState('brand');
    const [tone, setTone] = useState('Friendly & Encouraging');
    const [autoReply, setAutoReply] = useState(true);
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [leads, setLeads] = useState<Lead[]>([
      { id: 1, name: "Sarah Jenkins", date: "2023-10-24", interest: "Weight Loss", attended: true, signedUp: true, rating: 5, review: "Great session!" },
      { id: 2, name: "Mike Ross", date: "2023-10-25", interest: "Muscle Gain", attended: false, signedUp: false, rating: null, review: null },
    ]);
    
    // Email generation logic
    useEffect(() => {
        const fetchEmail = async () => {
            setIsEmailLoading(true);
            const prompt = `Write a short (max 40 words) auto-response email for a personal trainer. Name: ${user.name}. Tone: ${tone}. Context: Replying to a new lead.`;
            const text = await generateContent(prompt);
            if (text) setGeneratedEmail(text);
            setIsEmailLoading(false);
        };
        const timer = setTimeout(fetchEmail, 500);
        return () => clearTimeout(timer);
    }, [tone, user]);

    const averageRating = useMemo(() => {
      const ratedLeads = leads.filter(l => l.rating);
      if (ratedLeads.length === 0) return 0;
      return (ratedLeads.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedLeads.length).toFixed(1);
    }, [leads]);

    const toggleLeadStatus = (id: number, field: keyof Lead) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, [field]: !l[field] } : l));
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">{user.name.split(' ').map(n => n[0]).join('')}</div>
                    <div><h2 className="font-bold text-gray-800">{user.name}'s Dashboard</h2><p className="text-xs text-gray-500">{user.businessName}</p></div>
                </div>
                <button onClick={onLogout} className="text-sm font-bold text-gray-500 hover:text-red-500">Log Out</button>
            </header>
            <div className="max-w-6xl mx-auto p-8 grid grid-cols-12 gap-8">
                <div className="col-span-3 space-y-2">
                    <button onClick={() => setActiveTab('brand')} className={`w-full text-left p-4 rounded-xl font-bold flex items-center gap-3 transition-colors ${activeTab === 'brand' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:bg-white/50'}`}><Wand2 size={20}/> Brand & AI</button>
                    <button onClick={() => setActiveTab('inbox')} className={`w-full text-left p-4 rounded-xl font-bold flex items-center gap-3 transition-colors ${activeTab === 'inbox' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:bg-white/50'}`}><Mail size={20}/> Inbox</button>
                    <button onClick={() => setActiveTab('tracker')} className={`w-full text-left p-4 rounded-xl font-bold flex items-center gap-3 transition-colors ${activeTab === 'tracker' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:bg-white/50'}`}><Users size={20}/> Client Tracker</button>
                </div>
                <div className="col-span-9">
                    {activeTab === 'brand' && (
                        <div className="bg-white rounded-3xl shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-2xl font-bold text-[#2E294E] mb-2">Brand Voice & Automation</h3>
                            <div className="grid md:grid-cols-2 gap-8 items-start mt-8">
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl border border-pink-100 bg-pink-50/50">
                                        <label className="text-base font-bold text-gray-700 block mb-3">Tone of Voice</label>
                                        <div className="space-y-2">
                                            {["Friendly & Encouraging", "High Energy", "Professional"].map(opt => (
                                                <button key={opt} onClick={() => setTone(opt)} className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center ${tone === opt ? 'border-pink-500 bg-white ring-2 ring-pink-100' : 'border-transparent hover:bg-white'}`}><span className="text-sm font-medium">{opt}</span>{tone === opt && <CheckCircle2 size={16} className="text-pink-500"/>}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-2xl border border-gray-100">
                                        <div className="flex items-center justify-between"><div><div className="text-base font-bold text-gray-800">Auto-Responder</div><div className="text-xs text-gray-500">AI drafts first reply</div></div><button onClick={() => setAutoReply(!autoReply)} className={`w-12 h-6 rounded-full transition-colors relative ${autoReply ? 'bg-teal-500' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoReply ? 'left-7' : 'left-1'}`}></div></button></div>
                                        {autoReply && <div className="mt-4 flex items-start gap-2 p-3 bg-orange-50 text-orange-700 text-xs rounded-xl border border-orange-100"><AlertTriangle size={16} className="shrink-0" /><p>AI is active and will reply instantly.</p></div>}
                                    </div>
                                </div>
                                <div className="bg-gray-900 text-white p-6 rounded-2xl relative overflow-hidden h-fit">
                                     <div className="absolute top-0 right-0 p-3 opacity-20"><Sparkles size={48}/></div>
                                     <h4 className="font-bold mb-4 flex items-center gap-2"><Settings size={16}/> Communication Settings</h4>
                                     <div className="space-y-4">
                                         <div><label className="text-xs text-gray-400 uppercase font-bold">Email Alias</label><div className="flex items-center gap-2 mt-1 text-teal-400 font-mono text-sm bg-white/10 p-2 rounded-lg break-all"><AtSign size={14} className="shrink-0"/><span>{user.name.split(' ')[0].toLowerCase()}@trainlocal.chat</span></div></div>
                                         <div className="pt-4 border-t border-white/10"><p className="text-xs text-gray-400 mb-2">Example Auto-Response:</p><div className="bg-white/5 p-3 rounded-lg text-xs italic text-gray-300 leading-relaxed min-h-[80px]">{isEmailLoading ? <Loader size={12} className="animate-spin"/> : `"${generatedEmail}"`}</div></div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'inbox' && (
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                             <h3 className="text-2xl font-bold text-[#2E294E] mb-6">Recent Inquiries</h3>
                             <div className="space-y-4">
                                 {[{ id: 1, name: "Sarah Jenkins", interest: "Weight Loss", time: "2h ago" }].map(i => (
                                     <div key={i.id} className="p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 flex justify-between items-center gap-4">
                                         <div><div className="flex items-center gap-2 mb-1"><span className="font-bold text-gray-800 text-lg">{i.name}</span><span className="text-xs text-gray-400">{i.time}</span></div><p className="text-sm text-gray-600">Interested in: <span className="font-bold text-teal-600">{i.interest}</span></p><div className="mt-2 flex items-center gap-2 text-xs text-gray-500"><CheckCircle2 size={14} className="text-green-500"/><span>Auto-reply sent</span></div></div>
                                         <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:text-pink-500 flex items-center gap-2"><ExternalLink size={16}/> Reveal</button>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}
                    {activeTab === 'tracker' && (
                        <div className="bg-white rounded-3xl shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center mb-8 gap-4">
                                <div><h3 className="text-2xl font-bold text-[#2E294E]">Client Tracker</h3><p className="text-gray-500 text-sm">Track leads and reputation.</p></div>
                                <div className="flex items-center gap-4 bg-yellow-50 px-4 py-3 rounded-2xl border border-yellow-100"><div className="text-center"><div className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Score</div><div className="flex items-center gap-1 justify-center"><span className="text-3xl font-extrabold text-gray-800">{averageRating}</span><Star size={24} fill={COLORS.yellow} stroke={COLORS.yellow} /></div></div></div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead><tr className="text-xs font-bold text-gray-400 uppercase border-b border-gray-100"><th className="pb-4 pl-2">Lead</th><th className="pb-4 text-center">Attended?</th><th className="pb-4 text-center">Signed Up?</th><th className="pb-4">Review</th></tr></thead>
                                    <tbody className="text-sm">
                                        {leads.map(lead => (
                                            <tr key={lead.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                                <td className="py-4 pl-2 font-bold text-gray-800">{lead.name}</td>
                                                <td className="py-4 text-center"><button onClick={() => toggleLeadStatus(lead.id, 'attended')} className={`w-12 h-6 rounded-full relative ${lead.attended ? 'bg-green-500' : 'bg-gray-200'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${lead.attended ? 'left-7' : 'left-1'}`}></div></button></td>
                                                <td className="py-4 text-center"><button onClick={() => toggleLeadStatus(lead.id, 'signedUp')} className={`w-12 h-6 rounded-full relative ${lead.signedUp ? 'bg-blue-500' : 'bg-gray-200'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${lead.signedUp ? 'left-7' : 'left-1'}`}></div></button></td>
                                                <td className="py-4">{lead.review ? <span className="text-xs text-gray-600 italic">"{lead.review}"</span> : <span className="text-xs text-gray-400">N/A</span>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Login Page ---
export const LoginPage = ({ onLoginSuccess }: { onLoginSuccess: (u: any) => void }) => {
    const [email, setEmail] = useState('lynda@allfit.com');
    const [password, setPassword] = useState('trainlocal');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.toLowerCase().includes('lynda') && password === 'trainlocal') {
            onLoginSuccess(PT_DATA.find(p => p.name === "Lynda Nash") || { name: "Lynda Nash", businessName: "All Fit" });
        } else {
            alert("Demo: lynda@allfit.com / trainlocal");
        }
    };

    return (
        <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-4 text-3xl font-bold shadow-sm"><span style={{ color: COLORS.darkPurple }}>T</span><span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}>L</span></div>
                <h2 className="text-3xl font-extrabold mb-8">Welcome back</h2>
                <form onSubmit={handleLogin} className="space-y-5">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200" />
                    <button type="submit" className="w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}>Log In</button>
                </form>
            </div>
        </div>
    );
};
