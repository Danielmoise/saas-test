
import React, { useState, useRef, useEffect } from 'react';
import { LandingPage, Language, LandingPageContent, Announcement, Review, VideoItem, TimelineConfig } from '../types';
import PublicLandingPage from './PublicLandingPage';

interface LandingPageGeneratorProps {
  onSave: (page: LandingPage) => void;
  onUpdate: (page: LandingPage) => void;
  onNavigate: (path: string) => void;
  initialData?: LandingPage;
}

interface AccordionSectionProps {
  index: number;
  title: string;
  icon: string;
  children: React.ReactNode;
  openSection: number | null;
  setOpenSection: (index: number | null) => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ index, title, icon, children, openSection, setOpenSection }) => (
  <div className="border-b border-gray-100 last:border-0">
    <button 
      onClick={() => setOpenSection(openSection === index ? null : index)}
      className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all group"
    >
      <div className="flex items-center gap-5">
        <span className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-[11px] font-black text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
          {index}
        </span>
        <span className="text-2xl">{icon}</span>
        <span className="font-extrabold text-gray-800 text-base">{title}</span>
      </div>
      <svg className={`w-6 h-6 text-gray-300 transition-transform duration-300 ${openSection === index ? 'rotate-180 text-blue-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
    </button>
    {openSection === index && (
      <div className="p-6 pt-0 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
        {children}
      </div>
    )}
  </div>
);

const LandingPageGenerator: React.FC<LandingPageGeneratorProps> = ({ onSave, onUpdate, onNavigate, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'landing' | 'thankyou'>('landing');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [openSection, setOpenSection] = useState<number | null>(0);
  
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    buyLink: '',
    language: Language.ITALIAN,
    additionalImages: [] as string[]
  });

  const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
    { id: '1', text: 'Spedizione Gratuita in tutta Italia', icon: '🚚', backgroundColor: '#2563eb', textColor: '#ffffff' },
    { id: '2', text: 'Sconto 50% solo per oggi', icon: '🔥', backgroundColor: '#dc2626', textColor: '#ffffff' }
  ];

  const DEFAULT_VIDEOS: VideoItem[] = [
    { url: "https://cdn.shopify.com/videos/c/o/v/0e7bd7ed6340476b9b94ab12a8e5ab12.mp4", borderColor: 'linear-gradient(0deg, #fe2d52, #28ffff)', autoPlay: true, loop: true, muted: true },
    { url: "https://cdn.shopify.com/videos/c/o/v/d4dfdd955f2840b1b63b223ecc77cafd.mp4", borderColor: 'linear-gradient(0deg, #fe2d52, #28ffff)', autoPlay: true, loop: true, muted: true },
    { url: "https://cdn.shopify.com/videos/c/o/v/171162a47d1b44f1a042656ad7f85d02.mp4", borderColor: 'linear-gradient(0deg, #fe2d52, #28ffff)', autoPlay: true, loop: true, muted: true }
  ];

  const DEFAULT_TIMELINE: TimelineConfig = {
    readyDaysMin: 1,
    readyDaysMax: 2,
    deliveryDaysMin: 7,
    deliveryDaysMax: 12
  };

  const [content, setContent] = useState<LandingPageContent>({
    title: 'Nuova Landing Page',
    description: '',
    ctaText: 'ORDINA ORA',
    features: [],
    sellingPoints: [],
    videoItems: DEFAULT_VIDEOS,
    reviews: [],
    announcements: DEFAULT_ANNOUNCEMENTS,
    announcementInterval: 5,
    urgencyText: 'Solo pochi pezzi rimasti',
    price: '€ 39,90',
    oldPrice: '€ 79,80',
    discountLabel: '-50% SCONTO',
    stockCount: 13,
    popupCount: 9,
    popupInterval: 10,
    socialProofName: 'Michelle',
    socialProofCount: 758,
    timelineConfig: DEFAULT_TIMELINE
  });

  useEffect(() => {
    const symbolMap: Record<string, string> = {
      [Language.ITALIAN]: "€",
      [Language.ENGLISH_UK]: "£",
      [Language.ENGLISH_US]: "$",
      [Language.FRENCH]: "€",
      [Language.SPANISH]: "€",
      [Language.ENGLISH]: "$"
    };
    const symbol = symbolMap[formData.language] || "€";
    
    setContent(prev => {
      const currentPrice = prev.price || "";
      const swapSymbol = (val: string) => {
        if (!val) return val;
        return val.replace(/[€£$]/g, symbol);
      };

      return {
        ...prev,
        price: swapSymbol(currentPrice) || `${symbol} 39,90`,
        oldPrice: swapSymbol(prev.oldPrice || "") || `${symbol} 79,80`
      };
    });
  }, [formData.language]);

  useEffect(() => {
    const pendingData = (window as any).__PENDING_AI_DATA__ as LandingPage | undefined;
    
    if (pendingData) {
      setFormData({
        name: pendingData.productName,
        imageUrl: pendingData.imageUrl,
        buyLink: pendingData.buyLink || '',
        language: pendingData.baseLanguage,
        additionalImages: pendingData.additionalImages || []
      });
      const aiContent = pendingData.translations[pendingData.baseLanguage];
      
      let initialVideos = aiContent.videoItems || [];
      if (initialVideos.length === 0 && aiContent.videoUrls) {
        initialVideos = aiContent.videoUrls.map(url => ({
          url,
          borderColor: aiContent.videoBorderColor || 'linear-gradient(0deg, #fe2d52, #28ffff)',
          autoPlay: true,
          loop: true,
          muted: true
        }));
      }

      setContent({
        ...aiContent,
        announcements: aiContent.announcements && aiContent.announcements.length > 0 
          ? aiContent.announcements 
          : DEFAULT_ANNOUNCEMENTS,
        sellingPoints: aiContent.sellingPoints || [],
        videoItems: initialVideos.length > 0 ? initialVideos : DEFAULT_VIDEOS,
        stockCount: aiContent.stockCount ?? 13,
        popupCount: aiContent.popupCount ?? 9,
        popupInterval: aiContent.popupInterval ?? 10,
        socialProofName: aiContent.socialProofName || 'Michelle',
        socialProofCount: aiContent.socialProofCount || 758,
        timelineConfig: aiContent.timelineConfig || DEFAULT_TIMELINE
      });
      delete (window as any).__PENDING_AI_DATA__;
    } else if (initialData) {
      setFormData({
        name: initialData.productName,
        imageUrl: initialData.imageUrl,
        buyLink: initialData.buyLink || '',
        language: initialData.baseLanguage,
        additionalImages: initialData.additionalImages || []
      });
      const savedContent = initialData.translations[initialData.baseLanguage];
      
      let initialVideos = savedContent.videoItems || [];
      if (initialVideos.length === 0 && savedContent.videoUrls) {
        initialVideos = savedContent.videoUrls.map(url => ({
          url,
          borderColor: savedContent.videoBorderColor || 'linear-gradient(0deg, #fe2d52, #28ffff)',
          autoPlay: true,
          loop: true,
          muted: true
        }));
      }

      setContent({
        ...savedContent,
        announcements: savedContent.announcements && savedContent.announcements.length > 0 
          ? savedContent.announcements 
          : DEFAULT_ANNOUNCEMENTS,
        sellingPoints: savedContent.sellingPoints || [],
        videoItems: initialVideos.length > 0 ? initialVideos : DEFAULT_VIDEOS,
        stockCount: savedContent.stockCount ?? 13,
        popupCount: savedContent.popupCount ?? 9,
        popupInterval: savedContent.popupInterval ?? 10,
        socialProofName: savedContent.socialProofName || 'Michelle',
        socialProofCount: savedContent.socialProofCount || 758,
        timelineConfig: savedContent.timelineConfig || DEFAULT_TIMELINE
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const pageData: LandingPage = {
        id: initialData?.id || crypto.randomUUID(),
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        productName: formData.name,
        imageUrl: formData.imageUrl,
        additionalImages: formData.additionalImages,
        buyLink: formData.buyLink,
        baseLanguage: formData.language,
        translations: { [formData.language]: content },
        createdAt: initialData?.createdAt || new Date().toISOString()
      };
      if (isEditing) await onUpdate(pageData);
      else await onSave(pageData);
    } finally {
      setLoading(false);
    }
  };

  const updateAnnouncement = (id: string, field: keyof Announcement, value: string) => {
    setContent(prev => ({
      ...prev,
      announcements: prev.announcements?.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const updateReview = (index: number, field: keyof Review, value: any) => {
    const newReviews = [...content.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setContent({ ...content, reviews: newReviews });
  };

  const updateSellingPoint = (index: number, value: string) => {
    const newPoints = [...(content.sellingPoints || [])];
    newPoints[index] = value;
    setContent({ ...content, sellingPoints: newPoints });
  };

  const updateVideoItem = (index: number, field: keyof VideoItem, value: any) => {
    const newItems = [...(content.videoItems || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, videoItems: newItems });
  };

  const updateTimeline = (field: keyof TimelineConfig, value: number) => {
    setContent(prev => ({
      ...prev,
      timelineConfig: { ...(prev.timelineConfig || DEFAULT_TIMELINE), [field]: value }
    }));
  };

  const addVideoItem = () => {
    const newItem: VideoItem = { url: "", borderColor: 'linear-gradient(0deg, #fe2d52, #28ffff)', autoPlay: true, loop: true, muted: true };
    setContent({ ...content, videoItems: [...(content.videoItems || []), newItem] });
  };

  const removeVideoItem = (index: number) => {
    setContent({ ...content, videoItems: content.videoItems?.filter((_, i) => i !== index) });
  };

  return (
    <div className="h-screen flex flex-col bg-[#F4F7FA] overflow-hidden font-['Plus_Jakarta_Sans']">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 shadow-sm sticky top-0 z-[100]">
        <div className="flex items-center gap-8">
          <button onClick={() => onNavigate('admin')} className="text-gray-400 hover:text-gray-900 flex items-center gap-3 text-sm font-black uppercase tracking-widest">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            Indietro
          </button>
          <div className="h-8 w-px bg-gray-100"></div>
          <h1 className="text-lg font-black text-gray-900 leading-none">{isEditing ? 'Modifica Landing Page' : 'Crea Landing Page'}</h1>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
          <button onClick={() => setActiveTab('landing')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'landing' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400'}`}>Design Landing</button>
          <button onClick={() => setActiveTab('thankyou')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'thankyou' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400'}`}>Checkout & Grazie</button>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-10 py-3.5 rounded-[1.2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50">
            {loading ? 'Salvataggio...' : (isEditing ? 'Aggiorna Pagina' : 'Pubblica Pagina')}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[520px] bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar shadow-2xl relative z-10">
          <div className="flex flex-col p-6 space-y-6">
            
            <AccordionSection index={1} title="Annunci (Barra in cima)" icon="📢" openSection={openSection} setOpenSection={setOpenSection}>
              <div className="space-y-4">
                {content.announcements?.map((ann, idx) => (
                  <div key={ann.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Annuncio #{idx + 1}</span>
                      <div className="flex gap-1">
                        <input type="color" value={ann.backgroundColor} onChange={e => updateAnnouncement(ann.id, 'backgroundColor', e.target.value)} className="w-6 h-6 rounded-md cursor-pointer border-0 p-0" />
                        <input type="color" value={ann.textColor} onChange={e => updateAnnouncement(ann.id, 'textColor', e.target.value)} className="w-6 h-6 rounded-md cursor-pointer border-0 p-0" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <input type="text" className="w-12 bg-white border border-gray-200 rounded-lg p-2 text-center" value={ann.icon} onChange={e => updateAnnouncement(ann.id, 'icon', e.target.value)} placeholder="Icona" />
                       <input type="text" className="flex-1 bg-white border border-gray-200 rounded-lg p-2 text-sm font-bold" value={ann.text} onChange={e => updateAnnouncement(ann.id, 'text', e.target.value)} placeholder="Testo annuncio" />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection index={2} title="Offerta & Prezzi" icon="💰" openSection={openSection} setOpenSection={setOpenSection}>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Prezzo Attuale</label>
                    <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-sm font-black text-blue-600" value={content.price} onChange={e => setContent({...content, price: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Prezzo Barrato</label>
                    <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-sm font-bold text-gray-400" value={content.oldPrice} onChange={e => setContent({...content, oldPrice: e.target.value})} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Testo Pulsante (CTA)</label>
                    <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-sm font-black" value={content.ctaText} onChange={e => setContent({...content, ctaText: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Nome Social Proof</label>
                    <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-sm font-bold" value={content.socialProofName} onChange={e => setContent({...content, socialProofName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Scorte Iniziali (Magazzino)</label>
                    <input type="number" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-sm font-bold text-red-500" value={content.stockCount} onChange={e => setContent({...content, stockCount: parseInt(e.target.value) || 0})} />
                  </div>
               </div>
            </AccordionSection>

            <AccordionSection index={8} title="Timeline Spedizione" icon="🗓️" openSection={openSection} setOpenSection={setOpenSection}>
              <div className="space-y-6">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Personalizza i giorni di attesa per ogni fase della spedizione.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Pronto (Min Giorni)</label>
                    <input type="number" min="0" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold" value={content.timelineConfig?.readyDaysMin ?? 1} onChange={e => updateTimeline('readyDaysMin', parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Pronto (Max Giorni)</label>
                    <input type="number" min="0" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold" value={content.timelineConfig?.readyDaysMax ?? 2} onChange={e => updateTimeline('readyDaysMax', parseInt(e.target.value) || 0)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Consegna (Min Giorni)</label>
                    <input type="number" min="0" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold" value={content.timelineConfig?.deliveryDaysMin ?? 7} onChange={e => updateTimeline('deliveryDaysMin', parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Consegna (Max Giorni)</label>
                    <input type="number" min="0" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold" value={content.timelineConfig?.deliveryDaysMax ?? 12} onChange={e => updateTimeline('deliveryDaysMax', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection index={7} title="Video Testimonianze (TikTok)" icon="🎬" openSection={openSection} setOpenSection={setOpenSection}>
               <div className="space-y-6">
                 {(content.videoItems || []).map((video, idx) => (
                   <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-4 relative">
                      <button 
                        onClick={() => removeVideoItem(idx)}
                        className="absolute top-2 right-2 text-red-400 p-1 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
                      </button>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Video URL (.mp4)</label>
                        <input 
                          type="text" 
                          className="w-full bg-white border border-gray-100 rounded-xl p-2.5 text-xs font-medium" 
                          value={video.url} 
                          onChange={e => updateVideoItem(idx, 'url', e.target.value)} 
                          placeholder="https://...video.mp4"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Colore Bordo / Gradient</label>
                          <input 
                            type="text" 
                            className="w-full bg-white border border-gray-100 rounded-xl p-2.5 text-[10px] font-bold" 
                            value={video.borderColor} 
                            onChange={e => updateVideoItem(idx, 'borderColor', e.target.value)}
                            placeholder="#ff0000 o gradient"
                          />
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                           <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={video.autoPlay} onChange={e => updateVideoItem(idx, 'autoPlay', e.target.checked)} className="w-3 h-3 rounded text-blue-600" />
                              <span className="text-[9px] font-black uppercase text-gray-500">Autoplay</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={video.loop} onChange={e => updateVideoItem(idx, 'loop', e.target.checked)} className="w-3 h-3 rounded text-blue-600" />
                              <span className="text-[9px] font-black uppercase text-gray-500">Loop</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={video.muted} onChange={e => updateVideoItem(idx, 'muted', e.target.checked)} className="w-3 h-3 rounded text-blue-600" />
                              <span className="text-[9px] font-black uppercase text-gray-500">Muto</span>
                           </label>
                        </div>
                      </div>
                   </div>
                 ))}
                 <button 
                  onClick={addVideoItem}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-black text-gray-400 uppercase hover:border-blue-400 hover:text-blue-500 transition-all"
                 >
                   + Aggiungi Nuovo Video
                 </button>
               </div>
            </AccordionSection>

            <AccordionSection index={6} title="Punti di Forza" icon="⚡" openSection={openSection} setOpenSection={setOpenSection}>
               <div className="space-y-3">
                 <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Questi punti appaiono sotto il prezzo per convincere il cliente.</p>
                 {(content.sellingPoints || []).map((point, idx) => (
                   <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-400" 
                        value={point} 
                        onChange={e => updateSellingPoint(idx, e.target.value)} 
                        placeholder="Esempio: Spedizione Gratuita"
                      />
                      <button 
                        onClick={() => setContent({...content, sellingPoints: content.sellingPoints?.filter((_, i) => i !== idx)})}
                        className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
                      </button>
                   </div>
                 ))}
                 <button 
                  onClick={() => setContent({...content, sellingPoints: [...(content.sellingPoints || []), "Nuovo Punto di Forza"]})}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-black text-gray-400 uppercase hover:border-blue-400 hover:text-blue-500 transition-all"
                 >
                   + Aggiungi Punto
                 </button>
               </div>
            </AccordionSection>

            <AccordionSection index={3} title="Titoli & Testi AI" icon="✍️" openSection={openSection} setOpenSection={setOpenSection}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Titolo Principale (Hero)</label>
                  <textarea rows={3} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-400" value={content.title} onChange={e => setContent({...content, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Testo Urgenza (CTA)</label>
                  <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-sm font-bold text-red-500" value={content.urgencyText} onChange={e => setContent({...content, urgencyText: e.target.value})} />
                </div>
              </div>
            </AccordionSection>

            <AccordionSection index={4} title="Modifica Benefici" icon="💎" openSection={openSection} setOpenSection={setOpenSection}>
               <div className="space-y-4">
                 {content.features.map((feature, idx) => (
                   <div key={idx} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-2">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-gray-300 uppercase">Modulo #{idx + 1}</span>
                        <button onClick={() => setContent({...content, features: content.features.filter((_, i) => i !== idx)})} className="text-red-400 text-[10px] font-bold">Rimuovi</button>
                     </div>
                     <textarea 
                        rows={3} 
                        className="w-full bg-white border border-gray-100 rounded-xl p-3 text-xs font-medium outline-none focus:border-blue-400" 
                        value={feature} 
                        onChange={e => {
                          const newFeatures = [...content.features];
                          newFeatures[idx] = e.target.value;
                          setContent({...content, features: newFeatures});
                        }} 
                      />
                   </div>
                 ))}
                 <button onClick={() => setContent({...content, features: [...content.features, 'Titolo: Descrizione beneficio']})} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-black text-gray-400 uppercase hover:border-blue-400 hover:text-blue-500 transition-all">+ Aggiungi Beneficio</button>
               </div>
            </AccordionSection>

            <AccordionSection index={5} title="Editor Recensioni" icon="⭐" openSection={openSection} setOpenSection={setOpenSection}>
              <div className="space-y-4">
                {content.reviews.slice(0, 15).map((rev, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <input type="text" className="bg-transparent font-black text-xs text-gray-900 border-b border-gray-200 outline-none" value={rev.author} onChange={e => updateReview(i, 'author', e.target.value)} />
                      <select className="text-[10px] font-bold bg-transparent outline-none" value={rev.rating} onChange={e => updateReview(i, 'rating', parseInt(e.target.value))}>
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stelle</option>)}
                      </select>
                    </div>
                    <textarea rows={2} className="w-full bg-white border border-gray-100 rounded-xl p-2 text-[11px] font-normal" value={rev.comment} onChange={e => updateReview(i, 'comment', e.target.value)} placeholder="Commento recensione..." />
                  </div>
                ))}
              </div>
            </AccordionSection>
          </div>
        </aside>

        <main className="flex-1 flex flex-col p-12 items-center justify-center relative overflow-hidden bg-[#F4F7FA]">
          <div className="w-full max-w-6xl bg-gray-950 h-14 rounded-t-[2.5rem] flex items-center justify-between px-8 shrink-0">
            <div className="flex gap-2"><div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div><div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div><div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div></div>
            <div className="flex bg-white/10 px-8 py-1 rounded-full text-[9px] text-gray-400 font-black uppercase tracking-[0.4em]">LIVE PREVIEW EDITOR</div>
            <div className="flex gap-4">
              <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-white/20 text-white shadow-inner' : 'text-gray-600'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></button>
              <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-white/20 text-white shadow-inner' : 'text-gray-600'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></button>
            </div>
          </div>
          <div className={`flex-1 w-full flex justify-center bg-gray-200 rounded-b-[2.5rem] overflow-hidden border-x-[12px] border-b-[12px] border-gray-950 shadow-2xl`}>
             <div className={`h-full overflow-y-auto bg-white custom-scrollbar transition-all duration-500 ${previewMode === 'mobile' ? 'w-[420px]' : 'w-full'}`}>
                <PublicLandingPage 
                  page={{
                    id: 'preview',
                    slug: 'preview',
                    productName: formData.name,
                    imageUrl: formData.imageUrl,
                    additionalImages: formData.additionalImages,
                    baseLanguage: formData.language,
                    translations: { [formData.language]: content },
                    buyLink: formData.buyLink,
                    createdAt: new Date().toISOString()
                  }} 
                  onNavigate={() => {}} 
                />
             </div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LandingPageGenerator;
