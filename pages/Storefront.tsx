
import React from 'react';
import { LandingPage } from '../types';

interface StorefrontProps {
  pages: LandingPage[];
  onNavigate: (path: string) => void;
}

const Storefront: React.FC<StorefrontProps> = ({ pages, onNavigate }) => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-['Plus_Jakarta_Sans'] antialiased">
      {/* Mini Nav */}
      <nav className="h-20 bg-white border-b border-gray-100 sticky top-0 z-[100] px-8 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg">S</div>
            <span className="text-lg font-black tracking-tight">SaaS<span className="text-blue-600">Mod</span></span>
         </div>
         <button 
           onClick={() => onNavigate('admin')}
           className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
         >
           Accedi al Backend
         </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-20 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none italic uppercase">I Nostri <span className="text-blue-600">Prodotti</span></h1>
          <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto">
            Esplora le landing page create con il nostro generatore AI. Ogni pagina è progettata per massimizzare il ROI.
          </p>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-[3rem] bg-white space-y-6 shadow-sm">
            <div className="text-6xl">🔍</div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Nessun prodotto disponibile in vetrina.</p>
            <button 
              onClick={() => onNavigate('admin')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
            >
              Crea il primo Prodotto &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {pages.map(page => (
              <div key={page.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                  <img 
                    src={page.imageUrl} 
                    alt={page.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                       onClick={() => onNavigate(`view?id=${page.id}`)}
                       className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-110 transition-all shadow-2xl"
                     >
                       Vedi Landing ✨
                     </button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">{page.productName}</h3>
                    <div className="flex gap-1">
                      {Object.keys(page.translations).map(lang => (
                        <span key={lang} className="w-5 h-5 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center text-[8px] font-black uppercase text-gray-400">
                          {lang.slice(0, 2)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed mb-6 italic">
                    {page.translations[page.baseLanguage]?.description || "Nessuna descrizione disponibile."}
                  </p>
                  <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                     <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Prezzo: <span className="text-blue-600">{page.translations[page.baseLanguage]?.price}</span></span>
                     <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic opacity-50">/{page.slug}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-gray-100 bg-white text-center">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">SaaSMod Showcase Gallery &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Storefront;
