
import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { LandingPage, Language, VideoItem, TimelineConfig, Announcement } from '../types';

interface PublicLandingPageProps {
  page: LandingPage;
  onNavigate: (path: string) => void;
}

const LOCALIZED_DATA: Record<string, any> = {
  it: {
    names: ["Marco", "Giulia", "Luca", "Francesca", "Alessandro", "Elena", "Roberto", "Sara", "Paolo", "Chiara"],
    cities: ["Roma", "Milano", "Napoli", "Torino", "Palermo", "Bologna", "Firenze", "Venezia", "Genova", "Bari"],
    suffix: "ha appena acquistato da",
    stockText: "Affrettati! Restano solo {x} pezzi disponibili in magazzino",
    verifiedText: "Acquisto Verificato",
    secureText: "Pagamenti Sicuri e Crittografati",
    returnText: "Resi Gratuiti entro 14 giorni",
    loadMoreText: "Carica altre recensioni",
    socialProofPurchased: "e altre {count} persone hanno acquistato",
    timeline: { ordered: "Ordinato", ready: "Spedito", delivered: "Consegnato" },
    safePaymentText: "Pagamento sicuro sul nostro sito"
  },
  en: {
    names: ["John", "Sarah", "Michael", "Emma", "David", "Olivia", "James", "Sophia"],
    cities: ["London", "New York", "Chicago", "Manchester", "Los Angeles", "Sydney"],
    suffix: "just purchased from",
    stockText: "Hurry up! Only {x} pieces left in stock",
    verifiedText: "Verified Purchase",
    secureText: "Secure & Encrypted Payments",
    returnText: "Free Returns within 14 days",
    loadMoreText: "Load more reviews",
    socialProofPurchased: "and {count} people purchased",
    timeline: { ordered: "Ordered", ready: "Shipped", delivered: "Delivered" },
    safePaymentText: "Safe payment on our website"
  }
};

// COMPONENTE ISOLATO: Barra Annunci (Per evitare re-render della pagina)
const AnnouncementBanner = memo(({ announcements, interval }: { announcements: Announcement[], interval: number }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!announcements || announcements.length <= 1) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % announcements.length);
    }, interval * 1000);
    return () => clearInterval(timer);
  }, [announcements, interval]);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[index];
  return (
    <div 
      className="sticky top-0 z-[1200] w-full py-2.5 transition-colors duration-500 overflow-hidden"
      style={{ backgroundColor: current.backgroundColor || '#000', color: current.textColor || '#fff' }}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-2">
        <span className="text-sm md:text-base">{current.icon}</span>
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-center">
          {current.text}
        </span>
      </div>
    </div>
  );
});

// COMPONENTE ISOLATO: Popup Social Proof
const PurchasePopups = memo(({ localization, imageUrl, config }: any) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ name: '', city: '' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    const max = config?.popupCount ?? 9;
    const sec = config?.popupInterval ?? 10;

    const trigger = () => {
      setCount(prev => {
        if (prev >= max) return prev;
        const name = localization.names[Math.floor(Math.random() * localization.names.length)];
        const city = localization.cities[Math.floor(Math.random() * localization.cities.length)];
        setData({ name, city });
        setShow(true);
        setTimeout(() => setShow(false), 5000);
        return prev + 1;
      });
    };

    const interval = setInterval(trigger, sec * 1000);
    return () => clearInterval(interval);
  }, [localization, config]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[2000] bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 flex items-center gap-4 animate-slide-up max-w-[320px]">
      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
        <img src={imageUrl} className="w-full h-full object-contain rounded-xl" alt="" />
      </div>
      <div className="flex flex-col">
        <p className="text-xs text-gray-900 leading-tight">
          <span className="font-black">{data.name}</span> {localization.suffix} <span className="font-black">{data.city}</span>
        </p>
        <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Acquisto Verificato ✅</p>
      </div>
      <button onClick={() => setShow(false)} className="absolute -top-2 -right-2 bg-white border border-gray-100 text-gray-400 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md">✕</button>
    </div>
  );
});

const ShippingTimeline: React.FC<{ lang: string, config?: TimelineConfig }> = ({ lang, config }) => {
  const loc = LOCALIZED_DATA[lang]?.timeline || LOCALIZED_DATA.it.timeline;
  const formatWithOrdinal = (date: Date) => {
    const day = date.getDate();
    const monthStr = date.toLocaleDateString(lang, { month: 'short' });
    return `${day} ${monthStr}`;
  };

  const now = new Date();
  const readyMin = new Date(now); readyMin.setDate(now.getDate() + (config?.readyDaysMin ?? 1));
  const delivMin = new Date(now); delivMin.setDate(now.getDate() + (config?.deliveryDaysMin ?? 7));

  return (
    <div className="py-8 px-2">
      <div className="relative flex justify-between items-start max-w-[400px] mx-auto">
        <div className="absolute top-[22px] left-[15%] right-[15%] h-[2px] bg-gray-100 z-0"></div>
        <div className="relative z-10 flex flex-col items-center text-center w-1/3">
          <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center text-white mb-3 shadow-lg">📦</div>
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{formatWithOrdinal(now)}</span>
          <span className="text-[9px] font-bold text-gray-400 mt-1">{loc.ordered}</span>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center w-1/3">
          <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center text-white mb-3 shadow-lg">🚚</div>
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{formatWithOrdinal(readyMin)}</span>
          <span className="text-[9px] font-bold text-gray-400 mt-1">{loc.ready}</span>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center w-1/3">
          <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center text-white mb-3 shadow-lg">🏠</div>
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{formatWithOrdinal(delivMin)}</span>
          <span className="text-[9px] font-bold text-gray-400 mt-1">{loc.delivered}</span>
        </div>
      </div>
    </div>
  );
};

const TikTokSliderItem: React.FC<{ video: VideoItem }> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <div className="flex-none w-[60%] md:w-[260px] snap-center flex justify-center items-center relative group">
      <div className="p-[4px] rounded-[10px] w-full" style={{ background: video.borderColor || '#000' }}>
        <video 
          ref={videoRef}
          className="w-full aspect-[9/16] rounded-[10px] block object-cover bg-black"
          autoPlay={video.autoPlay} muted={video.muted} loop={video.loop} playsInline
        >
          <source src={video.url} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ page, onNavigate }) => {
  const [currentLang, setCurrentLang] = useState<Language>(page.baseLanguage);
  const [mainImage, setMainImage] = useState(page.imageUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(50);
  
  const content = useMemo(() => {
    if (!page.translations) return null;
    return page.translations[currentLang] || Object.values(page.translations)[0] || null;
  }, [page.translations, currentLang]);
  
  const localization = useMemo(() => {
    if (LOCALIZED_DATA[currentLang]) return LOCALIZED_DATA[currentLang];
    return LOCALIZED_DATA.it;
  }, [currentLang]);
  
  const thumbnails = [page.imageUrl, ...(page.additionalImages || [])];

  if (!content) return <div className="p-20 text-center font-bold">Caricamento...</div>;

  return (
    <div className="bg-white min-h-screen font-['Plus_Jakarta_Sans'] text-[#1a1a1a] antialiased overflow-x-hidden relative">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
        .custom-form-container { width: 100%; text-align: left; }
        .custom-form-container iframe { width: 100%; min-height: 500px; border: none; }
      `}</style>

      {/* COMPONENTI DINAMICI ISOLATI: Non causano re-render del padre */}
      <AnnouncementBanner 
        announcements={content.announcements || []} 
        interval={content.announcementInterval || 5} 
      />
      
      <PurchasePopups 
        localization={localization} 
        imageUrl={page.imageUrl} 
        config={{ popupCount: content.popupCount, popupInterval: content.popupInterval }} 
      />

      <button onClick={() => onNavigate('home')} className="fixed top-4 left-4 z-[1500] p-3 bg-white/70 rounded-full shadow-lg text-gray-500 hover:text-gray-900">🏠</button>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4 md:sticky md:top-24">
            <div className="relative w-full bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              <img src={mainImage} alt="" className="w-full h-auto block object-contain" />
            </div>
            <div className="grid grid-cols-5 gap-3">
              {thumbnails.map((img, i) => (
                <button key={i} onClick={() => setMainImage(img)} className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-blue-500 scale-95' : 'border-transparent shadow-sm'}`}>
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900">{content.title}</h1>
            
            <div className="bg-[#f8fafc] rounded-[2rem] border border-gray-100 p-8 space-y-6 relative overflow-hidden">
              <div className="text-center">
                <p className="inline-block px-4 py-1 bg-red-50 text-red-600 rounded-full text-[11px] font-black uppercase">
                  {localization.stockText.replace('{x}', (content.stockCount || 10).toString())}
                </p>
              </div>
              <div className="flex items-center justify-center gap-6">
                <span className="text-5xl md:text-6xl font-black text-gray-900">{content.price}</span>
                <div className="flex flex-col">
                  <span className="text-gray-400 line-through text-xl font-bold">{content.oldPrice}</span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-lg mt-1">{content.discountLabel}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                {content.ctaText?.toUpperCase() || 'ORDINA ORA'}
              </button>

              <div className="bg-white rounded-2xl border border-gray-50 shadow-sm">
                <ShippingTimeline lang={currentLang} config={content.timelineConfig} />
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-lg">{content.description}</p>
          </div>
        </div>

        {/* Video Section */}
        {content.videoItems && content.videoItems.length > 0 && (
          <div className="mt-20 overflow-x-auto flex gap-4 py-4 hide-scrollbar">
            {content.videoItems.map((v, i) => <TikTokSliderItem key={i} video={v} />)}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-32 space-y-24">
          {content.features?.map((f, i) => {
            const [t, d] = f.split(':');
            return (
              <section key={i} className={`flex flex-col lg:flex-row items-center gap-12 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <img src={thumbnails[i % thumbnails.length]} className="w-full lg:w-1/2 rounded-3xl shadow-lg" alt="" />
                <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4">
                  <h2 className="text-3xl font-bold">{t}</h2>
                  <p className="text-lg text-gray-600">{d}</p>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* MODALE DI ACQUISTO: Adesso è protetto dai re-render del padre grazie all'isolamento dei timer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden p-6 md:p-10 text-center max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-xl font-black text-gray-900">Finalizza l'Ordine</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 text-2xl">✕</button>
              </div>

              {content.purchaseFormHtml ? (
                /* Questo blocco non verrà più resettato dai timer perché PublicLandingPage non fa più re-render periodici */
                <div 
                  className="custom-form-container" 
                  dangerouslySetInnerHTML={{ __html: content.purchaseFormHtml }} 
                />
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto">📦</div>
                  <p className="text-gray-500">Stai ordinando <strong>{page.productName}</strong> per <strong>{content.price}</strong>.</p>
                  <a href={page.buyLink} target="_blank" className="block w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg">Acquista Ora</a>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicLandingPage;
