
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LandingPage, Language, VideoItem, TimelineConfig } from '../types';

interface PublicLandingPageProps {
  page: LandingPage;
  onNavigate: (path: string) => void;
}

const LOCALIZED_DATA: Record<string, { 
  names: string[], 
  cities: string[], 
  suffix: string, 
  stockText: string, 
  verifiedText: string, 
  secureText: string, 
  returnText: string, 
  loadMoreText: string,
  socialProofPurchased: string,
  timeline: { ordered: string, ready: string, delivered: string }
}> = {
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
    timeline: { ordered: "Ordinato", ready: "Ordine Pronto", delivered: "Consegnato" }
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
    timeline: { ordered: "Ordered", ready: "Order Ready", delivered: "Delivered" }
  },
  'en-GB': {
    names: ["Oliver", "George", "Harry", "Noah", "Jack", "Amelia", "Isla", "Olivia"],
    cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Sheffield", "Bristol"],
    suffix: "just purchased from",
    stockText: "Hurry up! Only {x} units left in stock",
    verifiedText: "Verified Purchase",
    secureText: "Secure UK Payments",
    returnText: "Free UK Returns",
    loadMoreText: "Load more reviews",
    socialProofPurchased: "and {count} others purchased",
    timeline: { ordered: "Ordered", ready: "Order Ready", delivered: "Delivered" }
  },
  'en-US': {
    names: ["Liam", "Olivia", "Noah", "Emma", "James", "Charlotte", "William", "Sophia"],
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"],
    suffix: "just purchased from",
    stockText: "Hurry! Only {x} items left in stock",
    verifiedText: "Verified Purchase",
    secureText: "Secure US Payments",
    returnText: "Free US Returns",
    loadMoreText: "Load more reviews",
    socialProofPurchased: "and {count} others purchased",
    timeline: { ordered: "Ordered", ready: "Order Ready", delivered: "Delivered" }
  },
  'es': {
    names: ["Carlos", "Maria", "Juan", "Elena", "Diego", "Carmen", "Javier", "Lucia"],
    cities: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia"],
    suffix: "acaba de comprar en",
    stockText: "¡Date prisa! Solo quedan {x} piezas en stock",
    verifiedText: "Compra Verificada",
    secureText: "Pagos Seguros y Encriptados",
    returnText: "Devoluciones Gratuitas",
    loadMoreText: "Cargar más reseñas",
    socialProofPurchased: "y {count} personas più compraron",
    timeline: { ordered: "Pedido", ready: "Pedido Preparado", delivered: "Entregado" }
  }
};

const ShippingTimeline: React.FC<{ 
  lang: string, 
  config?: TimelineConfig 
}> = ({ lang, config }) => {
  const loc = LOCALIZED_DATA[lang]?.timeline || LOCALIZED_DATA.it.timeline;
  
  const getOrdinal = (day: number) => {
    if (lang.startsWith('en')) {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
    return '';
  };

  const formatWithOrdinal = (date: Date) => {
    const day = date.getDate();
    const monthStr = date.toLocaleDateString(lang, { month: 'short' });
    if (lang.startsWith('en')) {
      return `${monthStr} ${day}${getOrdinal(day)}`;
    }
    return `${day} ${monthStr}`;
  };

  const now = new Date();
  
  const readyMin = new Date(now);
  readyMin.setDate(now.getDate() + (config?.readyDaysMin ?? 1));
  const readyMax = new Date(now);
  readyMax.setDate(now.getDate() + (config?.readyDaysMax ?? 2));

  const delivMin = new Date(now);
  delivMin.setDate(now.getDate() + (config?.deliveryDaysMin ?? 7));
  const delivMax = new Date(now);
  delivMax.setDate(now.getDate() + (config?.deliveryDaysMax ?? 12));

  const isSameReady = (config?.readyDaysMin ?? 1) === (config?.readyDaysMax ?? 2);
  const isSameDeliv = (config?.deliveryDaysMin ?? 7) === (config?.deliveryDaysMax ?? 12);

  return (
    <div className="py-8 px-2">
      <div className="relative flex justify-between items-start max-w-[400px] mx-auto">
        <div className="absolute top-[22px] left-[15%] right-[15%] h-[2px] bg-gray-100 z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center w-1/3">
          <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center text-white mb-3 shadow-lg">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{formatWithOrdinal(now)}</span>
          <span className="text-[9px] font-bold text-gray-400 mt-1">{loc.ordered}</span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center w-1/3">
          <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center text-white mb-3 shadow-lg">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-4 0a1 1 0 001 1h1" /></svg>
          </div>
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">
            {isSameReady ? formatWithOrdinal(readyMin) : `${formatWithOrdinal(readyMin)} - ${formatWithOrdinal(readyMax)}`}
          </span>
          <span className="text-[9px] font-bold text-gray-400 mt-1">{loc.ready}</span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center w-1/3">
          <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center text-white mb-3 shadow-lg">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">
            {isSameDeliv ? formatWithOrdinal(delivMin) : `${formatWithOrdinal(delivMin)} - ${formatWithOrdinal(delivMax)}`}
          </span>
          <span className="text-[9px] font-bold text-gray-400 mt-1">{loc.delivered}</span>
        </div>
      </div>
    </div>
  );
};

const TikTokSliderItem: React.FC<{ video: VideoItem }> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPauseHint, setShowPauseHint] = useState(false);
  const hintTimeout = useRef<number | null>(null);

  const isAutoPlay = video.autoPlay ?? true;
  const isLoop = video.loop ?? true;
  const isMuted = video.muted ?? true;

  const togglePlay = () => {
    if (!videoRef.current || isAutoPlay) return;

    if (videoRef.current.paused) {
      document.querySelectorAll('video').forEach(v => {
        if (v !== videoRef.current) v.pause();
      });
      videoRef.current.play();
      setIsPlaying(true);
      triggerHint();
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const triggerHint = () => {
    if (isAutoPlay) return;
    setShowPauseHint(true);
    if (hintTimeout.current) window.clearTimeout(hintTimeout.current);
    hintTimeout.current = window.setTimeout(() => setShowPauseHint(false), 1500);
  };

  return (
    <div className="flex-none w-[60%] md:w-[260px] snap-center flex justify-center items-center relative group">
      <div 
        className="p-[4px] rounded-[10px] w-full"
        style={{ background: video.borderColor || 'linear-gradient(0deg, #fe2d52, #28ffff)' }}
      >
        <video 
          ref={videoRef}
          className={`w-full aspect-[9/16] rounded-[10px] block object-cover bg-black ${!isAutoPlay ? 'cursor-pointer' : ''}`}
          autoPlay={isAutoPlay}
          muted={isMuted}
          loop={isLoop}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          onMouseEnter={isPlaying ? triggerHint : undefined}
        >
          <source src={video.url} type="video/mp4" />
        </video>
      </div>

      {!isAutoPlay && (
        <>
          {!isPlaying && (
            <button 
              onClick={togglePlay}
              className="absolute w-12 h-12 bg-black/60 text-white rounded-full flex items-center justify-center text-xl z-10 hover:scale-110 transition-transform shadow-lg"
            >
              ▷
            </button>
          )}

          {isPlaying && (
            <button 
              onClick={togglePlay}
              className={`absolute w-12 h-12 bg-black/60 text-white rounded-full flex items-center justify-center text-xl z-10 transition-opacity duration-300 ${showPauseHint ? 'opacity-100' : 'opacity-0'}`}
            >
              ❚❚
            </button>
          )}
        </>
      )}
    </div>
  );
};

const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ page, onNavigate }) => {
  const [currentLang, setCurrentLang] = useState<Language>(page.baseLanguage);
  const [mainImage, setMainImage] = useState(page.imageUrl);
  
  useEffect(() => {
    const availableLangs = Object.keys(page.translations) as Language[];
    if (!page.translations[currentLang] && availableLangs.length > 0) {
      setCurrentLang(availableLangs[0]);
    } else if (page.baseLanguage !== currentLang && page.translations[page.baseLanguage]) {
      setCurrentLang(page.baseLanguage);
    }
    setMainImage(page.imageUrl);
  }, [page.translations, page.baseLanguage, page.imageUrl]);

  const content = page.translations[currentLang] || Object.values(page.translations)[0];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(50);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  
  const [displayStock, setDisplayStock] = useState(content?.stockCount ?? 13);
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const [popupsShownCount, setPopupsShownCount] = useState(0);
  const [currentPopupData, setCurrentPopupData] = useState({ name: '', city: '' });
  
  const localization = useMemo(() => {
    if (LOCALIZED_DATA[currentLang]) return LOCALIZED_DATA[currentLang];
    if (currentLang.startsWith('en')) return LOCALIZED_DATA.en;
    return LOCALIZED_DATA.it;
  }, [currentLang]);
  
  const thumbnails = [page.imageUrl, ...(page.additionalImages || [])];
  const reviewsToDisplay = content?.reviews.slice(0, visibleReviews) || [];

  const videoItems = useMemo(() => {
    if (content?.videoItems && content.videoItems.length > 0) return content.videoItems;
    return [];
  }, [content]);

  useEffect(() => {
    if (!content?.announcements || content.announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex(prev => (prev + 1) % content.announcements!.length);
    }, (content.announcementInterval || 5) * 1000);
    return () => clearInterval(timer);
  }, [content?.announcements, content?.announcementInterval]);

  useEffect(() => {
    const maxPopups = content?.popupCount ?? 9;
    const intervalSeconds = content?.popupInterval ?? 10;

    const showPopup = () => {
      setPopupsShownCount(prev => {
        if (prev >= maxPopups) return prev;
        const name = localization.names[Math.floor(Math.random() * localization.names.length)];
        const city = localization.cities[Math.floor(Math.random() * localization.cities.length)];
        setCurrentPopupData({ name, city });
        setShowPurchasePopup(true);
        setDisplayStock(s => Math.max(1, s - 1));
        setTimeout(() => setShowPurchasePopup(false), 5000);
        return prev + 1;
      });
    };

    if (popupsShownCount < maxPopups) {
      const popupInterval = setInterval(showPopup, intervalSeconds * 1000);
      return () => clearInterval(popupInterval);
    }
  }, [localization, content?.popupCount, content?.popupInterval, popupsShownCount]);

  if (!content) return (
    <div className="flex items-center justify-center h-full p-20 text-gray-400 font-bold uppercase tracking-widest bg-white">
      Caricamento Anteprima...
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-['Plus_Jakarta_Sans'] text-[#1a1a1a] selection:bg-blue-100 antialiased overflow-x-hidden relative">
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
      `}</style>

      {showPurchasePopup && (
        <div className="fixed bottom-6 left-6 z-[2000] bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 flex items-center gap-4 animate-slide-up max-w-[320px] md:max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
            <img src={page.imageUrl} className="w-full h-full object-cover rounded-xl" alt="" />
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-gray-900 leading-tight">
              <span className="font-black">{currentPopupData.name}</span> {localization.suffix} <span className="font-black">{currentPopupData.city}</span>
            </p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Acquisto Verificato ✅</p>
          </div>
          <button onClick={() => setShowPurchasePopup(false)} className="absolute -top-2 -right-2 bg-white border border-gray-100 text-gray-400 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md">✕</button>
        </div>
      )}

      {content.announcements && content.announcements.length > 0 && (
        <div 
          className="sticky top-0 z-[1200] w-full py-2.5 transition-colors duration-500 overflow-hidden"
          style={{ 
            backgroundColor: content.announcements[currentAnnouncementIndex].backgroundColor,
            color: content.announcements[currentAnnouncementIndex].textColor 
          }}
        >
          <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-2">
            <span className="text-sm md:text-base">{content.announcements[currentAnnouncementIndex].icon}</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-center">
              {content.announcements[currentAnnouncementIndex].text}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          <div className="space-y-4 sticky lg:top-24">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <img src={mainImage} alt={page.productName} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-5 gap-2 md:gap-3">
              {thumbnails.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-blue-500 scale-95' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.15] text-gray-900 tracking-tight">{content.title}</h1>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                <span className="text-xs font-semibold text-gray-500 border-b border-gray-100 pb-0.5">
                  4.9/5 - {content.reviews.length} Recensioni Verificate
                </span>
              </div>
              <div className="happy-customersV2 flex items-center bg-white rounded-lg px-4 py-1.5 text-[#000] shadow-[0px_4px_6px_rgba(0,0,0,0.1)] font-['Roboto',sans-serif] w-fit">
                <div className="avatarsV2 flex mr-2.5">
                  <img src="https://img.freepik.com/free-photo/stylish-african-american-woman-smiling_23-2148770405.jpg" alt="Customer 1" className="avatarV2 w-[22px] h-[22px] rounded-full border-2 border-white -ml-0 object-cover" />
                  <img src="https://thumbs.dreamstime.com/b/beautiful-african-american-woman-relaxing-outside-happy-middle-aged-smiling-46298787.jpg" alt="Customer 2" className="avatarV2 w-[22px] h-[22px] rounded-full border-2 border-white -ml-[7px] object-cover" />
                  <img src="https://media.istockphoto.com/id/1320651997/photo/young-woman-close-up-isolated-studio-portrait.jpg?s=612x612&w=0&k=20&c=lV6pxz-DknISGT2jjiSvUmSaw0hpMDf-dBpT8HTSAUI=" alt="Customer 3" className="avatarV2 w-[22px] h-[22px] rounded-full border-2 border-white -ml-[7px] object-cover" />
                </div>
                <div className="textV2 text-[12px] flex items-center gap-[3px] leading-none">
                  <span className="font-[900]">{content.socialProofName || 'Michelle'}</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/800px-Twitter_Verified_Badge.svg.png" alt="verified badge" className="verifiedV2 h-[13px] w-[13px] inline-block align-middle" />
                  <span className="font-normal">
                    {localization.socialProofPurchased.split('{count}')[0]}
                    <strong className="font-[800]">{content.socialProofCount || 758}</strong>
                    {localization.socialProofPurchased.split('{count}')[1]}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#f8fafc] rounded-[2rem] border border-gray-100 p-6 md:p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-lg">OFFERTA LIMITATA</div>
                <div className="text-center">
                  <p className="inline-block px-4 py-1 bg-red-50 text-red-600 rounded-full text-[11px] font-black uppercase tracking-wider animate-pulse">
                    {localization.stockText.replace('{x}', displayStock.toString())}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <span className="text-5xl md:text-6xl font-black text-gray-900">{content.price}</span>
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-gray-400 line-through text-xl font-bold">{content.oldPrice}</span>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-lg mt-2">{content.discountLabel}</span>
                  </div>
                </div>
                {content.sellingPoints && content.sellingPoints.length > 0 && (
                  <div className="py-2 border-y border-gray-200/50">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                      {content.sellingPoints.map((point, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                          <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px]">✓</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="space-y-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg md:text-xl shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                  >
                    {content.ctaText.toUpperCase()}
                    <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                  
                  <div className="text-center space-y-4 py-2">
                    <p className='font-bold text-gray-400 uppercase tracking-widest text-[10px]'>Pagamento sicuro sul nostro sito</p>
                    <div className="flex justify-center flex-wrap items-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 md:h-5 object-contain" alt="visa" />
                       <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 md:h-8 object-contain" alt="master" />
                       <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5 md:h-6 object-contain" alt="paypal" />
                       <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" className="h-6 md:h-8 object-contain" alt="applepay" />
                       <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-5 md:h-6 object-contain" alt="googlepay" />
                    </div>
                  </div>

                  <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-sm mt-4">
                    <ShippingTimeline lang={currentLang} config={content.timelineConfig} />
                  </div>
                </div>
                <div className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{localization.secureText}</div>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-lg font-normal">
              {content.description}
            </p>
          </div>
        </div>

        {videoItems && videoItems.length > 0 && (
          <div className="mt-20 w-full">
            <div className="slider-containerv8 flex items-center overflow-x-auto snap-x snap-mandatory gap-3 py-4 hide-scrollbar max-w-7xl mx-auto px-4">
               {videoItems.map((video, idx) => (
                 <TikTokSliderItem key={idx} video={video} />
               ))}
            </div>
            <div className="text-center mt-4">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Scorri per vedere altri video testimoniale</span>
            </div>
          </div>
        )}

        <div className="mt-32 space-y-24">
          {content.features.map((feature, i) => {
            const [title, desc] = feature.split(':');
            return (
              <section key={i} className={`flex flex-col lg:flex-row items-center gap-12 md:gap-20 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2">
                  <img 
                    src={page.additionalImages?.[i % (page.additionalImages?.length || 1)] || page.imageUrl} 
                    alt="" 
                    className="w-full rounded-3xl shadow-xl border border-gray-100 object-cover aspect-[4/3] hover:scale-[1.01] transition-transform duration-500" 
                  />
                </div>
                <div className="w-full lg:w-1/2 space-y-5 text-center lg:text-left">
                  <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                    {title}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 font-normal leading-relaxed">
                    {desc}
                  </p>
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-40 bg-gray-50 rounded-[3rem] p-8 md:p-16 border border-gray-100">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Recensioni dei Clienti</h2>
             <p className="text-gray-500 font-bold uppercase tracking-[0.2em] mt-3 text-xs">Basate su {content.reviews.length} acquisti verificati</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
             {reviewsToDisplay.map((review, idx) => (
               <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                 <div className="flex justify-between items-center mb-4">
                   <div className="flex text-yellow-400 gap-0.5">
                     {Array.from({ length: 5 }).map((_, i) => (
                       <span key={i} className={`text-base ${i < review.rating ? 'text-yellow-400' : 'text-gray-100'}`}>★</span>
                     ))}
                   </div>
                   <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{review.date}</span>
                 </div>
                 {review.comment ? (
                   <p className="text-gray-700 font-medium leading-relaxed text-base mb-6">{review.comment}</p>
                 ) : (
                   <div className="mb-6 py-3 px-4 bg-gray-50 rounded-xl text-[10px] font-bold uppercase text-gray-400 tracking-widest">Ottimo prodotto, consigliato!</div>
                 )}
                 <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
                   <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-sm">{review.author?.[0]}</div>
                   <div className="flex flex-col">
                      <p className="font-bold text-gray-900 text-sm">{review.author}</p>
                      <span className="text-[9px] text-emerald-500 font-bold uppercase">{localization.verifiedText}</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
           {visibleReviews < content.reviews.length && (
             <div className="mt-12 text-center">
                <button onClick={() => setVisibleReviews(v => v + 100)} className="bg-white border border-gray-200 text-gray-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-gray-900 transition-all">
                  {localization.loadMoreText}
                </button>
             </div>
           )}
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto">📦</div>
              <h3 className="text-2xl font-black text-gray-900">Completa il tuo Ordine</h3>
              <p className="text-gray-500 text-sm font-normal">Stai ordinando <strong>{page.productName}</strong> al prezzo di <strong>{content.price}</strong>. La spedizione è gratuita!</p>
              <div className="space-y-3 pt-4">
                <a 
                  href={page.buyLink || '#'} 
                  target="_blank" 
                  className="block w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                >
                  Acquista Ora
                </a>
                <button onClick={() => setIsModalOpen(false)} className="block w-full text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-gray-900">Annulla e continua a leggere</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicLandingPage;
