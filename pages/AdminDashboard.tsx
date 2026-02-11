
import React, { useState, useRef } from 'react';
import { LandingPage, Language } from '../types';
import { generateLandingContent, generateProductImagesFromReference } from '../services/geminiService';

interface AdminDashboardProps {
  pages: LandingPage[];
  onDelete: (id: string) => void;
  onNavigate: (path: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ pages, onDelete, onNavigate }) => {
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    niche: '',
    target: '',
    tone: 'Professional',
    language: Language.ITALIAN,
    localImages: [] as string[],
    remoteImageUrl: '',
    imageStyles: ['human'] as ('human' | 'tech' | 'info')[] ,
    paragraphCount: 4,
    textDensity: 'medium' as 'short' | 'medium' | 'long',
    reviewCount: 350,
    imageCount: 4
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, localImages: [...prev.localImages, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      localImages: prev.localImages.filter((_, i) => i !== index)
    }));
  };

  const toggleStyle = (style: 'human' | 'tech' | 'info') => {
    setFormData(prev => {
      const isSelected = prev.imageStyles.includes(style);
      if (isSelected && prev.imageStyles.length > 1) {
        return { ...prev, imageStyles: prev.imageStyles.filter(s => s !== style) };
      } else if (!isSelected) {
        return { ...prev, imageStyles: [...prev.imageStyles, style] };
      }
      return prev;
    });
  };

  const startGeneration = async () => {
    if (!formData.name || !formData.description) {
      return alert("Compila Nome e Descrizione per permettere all'AI di lavorare.");
    }
    
    setIsAiGenerating(true);
    setGenerationProgress('Scrittura testi persuasivi...');

    try {
      const textsPromise = generateLandingContent({
        productName: formData.name,
        description: formData.description,
        niche: formData.niche,
        target: formData.target,
        tone: formData.tone,
        language: formData.language,
        featureCount: formData.paragraphCount,
        textDensity: formData.textDensity,
        reviewCount: formData.reviewCount
      });

      let allGeneratedImages: string[] = [];
      const baseImageForAi = formData.localImages[0] || formData.remoteImageUrl;
      
      let imagesPromise: Promise<string[]> = Promise.resolve([]);
      
      if (formData.imageCount > 0 && baseImageForAi && formData.imageStyles.length > 0) {
        setGenerationProgress('Generazione immagini e testi in corso...');
        const imagesPerStyle = Math.ceil(formData.imageCount / formData.imageStyles.length);
        const stylePromises = formData.imageStyles.map(style => 
          generateProductImagesFromReference(formData.name, baseImageForAi, style, imagesPerStyle)
            .catch(err => {
              console.error(`Errore stile ${style}:`, err);
              return [];
            })
        );
        imagesPromise = Promise.all(stylePromises).then(results => results.flat().slice(0, formData.imageCount));
      } else {
        setGenerationProgress('Generazione testi in corso...');
      }

      const [translations, generatedImages] = await Promise.all([textsPromise, imagesPromise]);
      allGeneratedImages = generatedImages;

      const mainImageUrl = allGeneratedImages[0] || formData.localImages[0] || formData.remoteImageUrl || 'https://picsum.photos/seed/product/800/800';
      const galleryImages = allGeneratedImages.length > 0 
        ? allGeneratedImages.slice(1) 
        : formData.localImages.slice(1);

      const tempId = crypto.randomUUID();
      const tempLanding: LandingPage = {
        id: tempId,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        productName: formData.name,
        imageUrl: mainImageUrl,
        additionalImages: galleryImages,
        buyLink: '',
        baseLanguage: formData.language,
        translations: translations,
        createdAt: new Date().toISOString()
      };

      (window as any).__PENDING_AI_DATA__ = tempLanding;
      setGenerationProgress('Reindirizzamento all\'editor...');
      onNavigate(`generate?name=${encodeURIComponent(formData.name)}&lang=${formData.language}&temp=true`);

    } catch (e) {
      console.error("ERRORE GENERAZIONE:", e);
      alert("Si è verificato un errore durante la generazione. Controlla la console.");
    } finally {
      setIsAiGenerating(false);
      setGenerationProgress('');
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      onDelete(deleteConfirmation.id);
      setDeleteConfirmation(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Plus_Jakarta_Sans'] antialiased">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0 sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100">A</div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">AI <span className="text-emerald-500">Generator</span></h1>
        </div>
        <button onClick={() => onNavigate('home')} className="text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest bg-gray-50 px-6 py-2.5 rounded-full border border-gray-100 transition-all">Torna allo Store</button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-[520px] bg-white border-r border-gray-100 p-8 overflow-y-auto custom-scrollbar shrink-0 shadow-2xl relative z-10">
          <div className="space-y-10 pb-20">
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Info Prodotto</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Nome del Prodotto"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-400 transition-all shadow-sm"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <textarea 
                  placeholder="Descrizione: cosa vende, benefici principali, perché comprarlo..."
                  rows={4}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-medium outline-none focus:border-emerald-400 transition-all shadow-sm"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </section>

            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Lingua Landing Page</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: Language.ITALIAN, label: "Italiano 🇮🇹" },
                  { value: Language.ENGLISH_UK, label: "Inglese (Regno Unito) 🇬🇧" },
                  { value: Language.ENGLISH_US, label: "Inglese (America) 🇺🇸" }
                ].map(lang => (
                  <button 
                    key={lang.value}
                    onClick={() => setFormData({...formData, language: lang.value})}
                    className={`p-4 rounded-xl border-2 font-bold text-sm transition-all text-left flex justify-between items-center ${formData.language === lang.value ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md' : 'border-gray-100 hover:border-emerald-200'}`}
                  >
                    {lang.label}
                    {formData.language === lang.value && <span className="text-emerald-500">✓</span>}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Immagini Sorgente (Reference)</label>
              <div className="grid grid-cols-4 gap-2">
                 {formData.localImages.map((img, idx) => (
                   <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 shadow-sm">
                     <img src={img} className="w-full h-full object-cover" alt="" />
                     <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
                     </button>
                   </div>
                 ))}
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-300 hover:border-emerald-400 hover:text-emerald-500 transition-all bg-gray-50/50"
                 >
                   <span className="text-2xl font-light">+</span>
                   <span className="text-[8px] font-black uppercase mt-1">Carica</span>
                 </button>
              </div>
              <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              <input 
                type="text" 
                placeholder="O incolla URL immagine..."
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-xs font-bold outline-none focus:border-emerald-400 shadow-sm"
                value={formData.remoteImageUrl}
                onChange={e => setFormData({...formData, remoteImageUrl: e.target.value})}
              />
            </section>

            <section className="space-y-6 bg-gray-950 p-7 rounded-[2.5rem] shadow-2xl">
              <label className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Parametri AI Cockpit
              </label>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stili Immagine AI</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['human', 'tech', 'info'] as const).map(style => (
                      <button 
                        key={style}
                        onClick={() => toggleStyle(style)}
                        disabled={formData.imageCount === 0}
                        className={`py-3 text-[10px] font-black uppercase rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${formData.imageCount === 0 ? 'opacity-30' : ''} ${formData.imageStyles.includes(style) ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
                      >
                        {style === 'human' && <span className="text-sm">🧑‍💼</span>}
                        {style === 'tech' && <span className="text-sm">🔬</span>}
                        {style === 'info' && <span className="text-sm">📊</span>}
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Immagini Totali AI</span>
                    <span className="text-lg font-black text-emerald-400">{formData.imageCount}</span>
                  </div>
                  <input 
                    type="range" min="0" max="15" step="1"
                    value={formData.imageCount} 
                    onChange={e => setFormData({...formData, imageCount: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  {formData.imageCount === 0 && <p className="text-[9px] text-gray-500 font-bold uppercase">Usa solo le tue foto originali</p>}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paragrafi Benefici</span>
                    <span className="text-lg font-black text-emerald-400">{formData.paragraphCount}</span>
                  </div>
                  <input 
                    type="range" min="2" max="12" step="1"
                    value={formData.paragraphCount} 
                    onChange={e => setFormData({...formData, paragraphCount: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volume Recensioni</span>
                    <span className="text-lg font-black text-blue-400">{formData.reviewCount}</span>
                  </div>
                  <input 
                    type="range" min="10" max="3000" step="10"
                    value={formData.reviewCount} 
                    onChange={e => setFormData({...formData, reviewCount: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dettaglio Testi</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['short', 'medium', 'long'].map(d => (
                      <button 
                        key={d}
                        onClick={() => setFormData({...formData, textDensity: d as any})}
                        className={`py-2.5 text-[10px] font-black uppercase rounded-xl border-2 transition-all ${formData.textDensity === d ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={startGeneration}
                disabled={isAiGenerating}
                className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
              >
                {isAiGenerating ? (
                  <div className="flex flex-col items-center">
                    <span className="animate-pulse flex items-center gap-2">
                       <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       {generationProgress}
                    </span>
                  </div>
                ) : 'Crea Landing Page ✨'}
              </button>
            </section>
          </div>
        </aside>

        <section className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-gray-50/50">
           <div className="max-w-6xl mx-auto">
             <div className="flex justify-between items-center mb-12">
               <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Dashboard Landing</h2>
               <div className="px-5 py-2.5 bg-white border border-gray-100 text-gray-400 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">Pubblicate: {pages.length}</div>
             </div>

             {pages.length === 0 ? (
               <div className="h-64 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-300 font-bold uppercase tracking-widest bg-white gap-4 shadow-sm">
                  <span className="text-5xl">🚀</span>
                  Nessuna landing creata. Inizia ora!
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {pages.map(page => (
                   <div key={page.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                     <div className="aspect-video relative overflow-hidden bg-gray-100">
                       <img src={page.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                          <button onClick={() => onNavigate(`view?id=${page.id}`)} className="w-32 py-2.5 bg-white rounded-xl text-gray-900 font-black text-[10px] uppercase shadow-xl hover:scale-110 transition-all">Anteprima</button>
                          <button onClick={() => onNavigate(`edit?id=${page.id}`)} className="w-32 py-2.5 bg-blue-600 rounded-xl text-white font-black text-[10px] uppercase shadow-xl hover:scale-110 transition-all">Modifica</button>
                          <button onClick={() => setDeleteConfirmation({ id: page.id, name: page.productName })} className="w-32 py-2.5 bg-red-500 rounded-xl text-white font-black text-[10px] uppercase shadow-xl hover:scale-110 transition-all">Elimina</button>
                       </div>
                     </div>
                     <div className="p-6">
                       <h3 className="font-black text-gray-900 mb-1 truncate">{page.productName}</h3>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">/{page.slug}</p>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmation(null)}></div>
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden p-10 text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto">⚠️</div>
              <h3 className="text-2xl font-black text-gray-900">Sei sicuro?</h3>
              <p className="text-gray-500 text-sm font-normal">Stai per eliminare definitivamente la landing page di <strong>{deleteConfirmation.name}</strong>. Questa azione non può essere annullata.</p>
              
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button 
                  onClick={() => setDeleteConfirmation(null)}
                  className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Annulla
                </button>
                <button 
                  onClick={confirmDelete}
                  className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 transition-colors"
                >
                  Elimina
                </button>
              </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
