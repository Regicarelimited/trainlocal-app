import { useState } from 'react';
import { Loader2, ChevronRight, FileText } from 'lucide-react';
import { InputStep } from './components/InputStep';
import { AuditStep } from './components/AuditStep';
import { PreviewStep } from './components/PreviewStep';
import { generateBlogContent } from './services/geminiService';
import { BlogConfig, AppStep, GeneratedPostData } from './types';

export default function App() {
  const [step, setStep] = useState<AppStep>('input');
  const [config, setConfig] = useState<BlogConfig>({ topic: '', keyword: '', tone: 'Professional & Authoritative' });
  const [generatedData, setGeneratedData] = useState<GeneratedPostData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushComplete, setPushComplete] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateBlogContent(config);
      setGeneratedData(data);
      setStep('audit');
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Ensure your API Key is valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePushWebhook = async (payload: any) => {
    setIsPushing(true);
    const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/ewk18rlru22ttl4pu07k0akg5ax1rkv6";
    
    try {
      // Sending full payload to Make.com
      await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      setPushComplete(true);
    } catch (error) {
      console.error("Webhook push failed", error);
      alert("Failed to push to Make.com. Check console for details.");
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden flex flex-col">
      
      {/* Top Navigation Bar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
            {/* RegiCare Logo Approximation */}
            <div className="flex items-center tracking-tighter text-xl">
              <span className="font-bold text-slate-900">Regi</span>
              <span className="font-bold text-[#E6399B]">Care</span>
            </div>
            <div className="h-6 w-px bg-slate-300 mx-1"></div>
            <span className="font-medium text-slate-500 text-sm flex items-center gap-2">
               <FileText size={16} /> Blog Generator
            </span>
        </div>
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm font-medium">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${step === 'input' || isGenerating ? 'bg-[#E6399B]/10 text-[#E6399B]' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-xs">1</span>
                Input
            </div>
            <ChevronRight size={14} className="text-slate-300" />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${step === 'audit' ? 'bg-[#E6399B]/10 text-[#E6399B]' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-xs">2</span>
                Audit
            </div>
            <ChevronRight size={14} className="text-slate-300" />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${['preview', 'pushing', 'done'].includes(step) ? 'bg-[#E6399B]/10 text-[#E6399B]' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-xs">3</span>
                Export
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        
        {/* Loading Overlay */}
        {isGenerating && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-[#E6399B]">
                <div className="relative">
                  <div className="absolute inset-0 bg-pink-200 rounded-full animate-ping opacity-25"></div>
                  <Loader2 size={64} className="animate-spin relative z-10" />
                </div>
                <p className="font-bold text-xl mt-6 text-slate-800">Constructing Content Strategy</p>
                <p className="text-slate-500 mt-2">Analyzing Keywords • Structuring HTML • Optimising Tone</p>
            </div>
        )}

        {step === 'input' && (
            <InputStep 
                config={config} 
                setConfig={setConfig} 
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
            />
        )}

        {step === 'audit' && generatedData && (
            <AuditStep 
                data={generatedData} 
                keyword={config.keyword}
                onApprove={() => setStep('preview')}
                onEdit={() => setStep('input')}
            />
        )}

        {step === 'preview' && generatedData && (
            <PreviewStep 
                data={generatedData}
                keyword={config.keyword}
                onPush={handlePushWebhook}
                isPushing={isPushing}
                pushComplete={pushComplete}
            />
        )}

      </div>
    </div>
  );
}