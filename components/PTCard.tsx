import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Star, ChevronDown, ChevronUp, Instagram, Linkedin, Facebook, Loader, Play, Pause } from 'lucide-react';
import { COLORS } from '../constants';
import { TrainerProfile } from '../types';
import { Tag } from './Shared';
import { generateSpeech } from '../services/geminiService';

interface PTCardProps {
  data: TrainerProfile;
  expanded: boolean;
  onToggle: () => void;
  onOpenBio: (data: TrainerProfile) => void;
  onOpenBooking: (data: TrainerProfile) => void;
  isHighlighted: boolean;
  onPreview: (content: any, type: string, color: any, rect: any) => void;
}

export const PTCard: React.FC<PTCardProps> = ({ data, expanded, onToggle, onOpenBio, onOpenBooking, isHighlighted, onPreview }) => {
  const logoRotation = useMemo(() => Math.random() * 10 - 5, []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (!expanded && audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; setIsPlaying(false); } }, [expanded]);

  const handlePlayIntro = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); return; }
    
    // PRIORITIZE UPLOADED AUDIO
    if (data.audioUrl && (!audioRef.current || !audioRef.current.src.includes(data.audioUrl))) {
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = data.audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
        return;
    }

    if (audioRef.current && audioRef.current.src) { audioRef.current.play(); setIsPlaying(true); return; }
    
    setAudioLoading(true);
    const introText = `Hi! I'm ${data.name} from ${data.businessName}. ${data.bio}`;
    const wavUrl = await generateSpeech(introText, data.voice || "Kore");
    
    if (wavUrl) {
      if (!audioRef.current) { audioRef.current = new Audio(); audioRef.current.onended = () => setIsPlaying(false); }
      audioRef.current.src = wavUrl; audioRef.current.play(); setIsPlaying(true);
    }
    setAudioLoading(false);
  };
   
  const highlightStyle = isHighlighted ? 'ring-4 ring-offset-4 ring-[#F3C257]' : '';
  const isUrl = (str: string) => str && (str.startsWith('http') || str.startsWith('data:'));
   
  return (
    <div 
      className={`group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col ${expanded ? 'shadow-2xl scale-[1.02] z-10' : 'shadow-sm hover:shadow-xl hover:-translate-y-1'} ${highlightStyle} break-inside-avoid mb-6`}
    >
      <div className="p-6 cursor-pointer flex-grow flex-col" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0 mr-2">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner bg-gray-100 cursor-zoom-in hover:opacity-90 transition-opacity" onClick={(e) => { e.stopPropagation(); const rect = e.currentTarget.getBoundingClientRect(); onPreview(data.image, isUrl(data.image) ? 'image' : 'text', null, rect); }}>
                {isUrl(data.image) ? (
                    <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xl font-bold" style={{ color: COLORS.darkPurple }}>{data.image}</div>
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md border-4 border-white overflow-hidden cursor-zoom-in hover:scale-110 transition-transform" style={{ backgroundColor: data.logoColor || COLORS.blue, transform: `rotate(${logoRotation}deg)` }} onClick={(e) => { e.stopPropagation(); const content = data.customLogo || data.logoImage || data.logo; const rect = e.currentTarget.getBoundingClientRect(); onPreview(content, 'logo', data.logoColor || COLORS.blue, rect); }}>
                {data.customLogo ? data.customLogo : data.logoImage ? <img src={data.logoImage} alt="Logo" className="w-full h-full object-cover" /> : data.logo}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold truncate pr-2" style={{ color: COLORS.darkPurple }}>{data.name}</h3>
              <p className="text-sm font-medium opacity-60 flex items-center gap-1 truncate" style={{ color: COLORS.darkGrey }}>{data.businessName}</p>
              <div className="flex items-start mt-1 text-xs font-medium text-[#FF3366]"><MapPin size={12} className="mr-1 shrink-0 mt-0.5 text-[#FF3366]" /><span className="leading-tight line-clamp-2 text-gray-500">{data.location}</span></div>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0 pl-2">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg"><Star size={14} fill={COLORS.yellow} stroke={COLORS.yellow} /><span className="ml-1 text-sm font-bold" style={{ color: COLORS.darkGrey }}>{data.rating.toFixed(1)}</span></div>
            <span className="text-xs font-semibold text-gray-400 mt-1 tracking-tight">{data.reviews} reviews</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-y-1">
          {data.specialisms.slice(0, 7).map((tag, i) => (<Tag key={i} text={tag} color={COLORS.teal} />))}
        </div>
        
        {!expanded && (
           <div className="relative w-full flex justify-center mt-3">
             <button className="text-gray-400 hover:text-gray-600 transition-colors">
               <ChevronDown size={20} />
             </button>
           </div>
        )}
      </div>

      <div className={`bg-gray-50 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-2 border-t border-gray-100">
           <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1"><h4 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-50" style={{ color: COLORS.darkPurple }}>About</h4><div className="relative"><p className="text-sm leading-relaxed text-gray-600 line-clamp-6">{data.bio}</p><button onClick={(e) => { e.stopPropagation(); onOpenBio(data); }} className="text-xs font-bold text-pink-500 mt-1 hover:underline focus:outline-none">Read more</button></div></div>
              <div className="flex flex-row sm:flex-col gap-3 shrink-0">
                 <div className="flex-1 sm:flex-initial text-center p-2 rounded-xl bg-white shadow-sm border border-gray-100 min-w-[90px]"><div className="text-xs text-gray-400 mb-1">Rate</div><div className="font-bold text-lg" style={{ color: COLORS.pink }}>{data.price}</div><div className="text-[10px] text-gray-400">/ hour</div></div>
                 <div className="flex-1 sm:flex-initial text-center p-2 rounded-xl bg-white shadow-sm border border-gray-100 min-w-[90px]"><div className="text-xs text-gray-400 mb-1">Availability</div><div className="font-bold text-xs py-2" style={{ color: COLORS.blue }}>{data.availability}</div></div>
              </div>
           </div>
           <div className="mt-6 p-4 bg-white rounded-xl border border-teal-50 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                   <button onClick={handlePlayIntro} disabled={audioLoading} className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: COLORS.teal }}>{audioLoading ? <Loader size={18} className="animate-spin" /> : isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-1"/>}</button>
                   <div><div className="text-xs font-bold uppercase tracking-wider text-gray-400">Intro</div><div className="text-sm font-bold text-gray-700">Hear from {data.name.split(' ')[0]}</div></div>
                </div>
                <div className="flex items-end gap-1 h-8">{[...Array(5)].map((_, i) => (<div key={i} className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`} style={{ backgroundColor: isPlaying ? COLORS.pink : '#e5e7eb', height: isPlaying ? `${Math.random() * 100}%` : '20%', animationDelay: `${i * 0.1}s` }} />))}</div>
             </div>
           </div>
           <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
                 <button className="p-2 rounded-full bg-white border hover:bg-gray-50 transition-colors text-gray-400 hover:text-[#E1306C]"><Instagram size={18} /></button>
                 <button className="p-2 rounded-full bg-white border hover:bg-gray-50 transition-colors text-gray-400 hover:text-[#0077B5]"><Linkedin size={18} /></button>
                 <button className="p-2 rounded-full bg-white border hover:bg-gray-50 transition-colors text-gray-400 hover:text-[#1877F2]"><Facebook size={18} /></button>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onOpenBooking(data); }} className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-pink-200 transform hover:-translate-y-0.5 transition-all text-center" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }}>Request a Chat</button>
           </div>
           <div className="flex justify-center pt-4">
               <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400"><ChevronUp size={20} /></button>
           </div>
        </div>
      </div>
    </div>
  );
};
