
import React from 'react';
import { LandingPage } from '../types';
import Layout from '../components/Layout';

interface StorefrontProps {
  pages: LandingPage[];
  onNavigate: (path: string) => void;
}

const Storefront: React.FC<StorefrontProps> = ({ pages, onNavigate }) => {
  return (
    <Layout onNavigate={onNavigate}>
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">I Nostri Prodotti</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Scopri le nostre ultime innovazioni. Ogni prodotto ha una landing page dedicata ottimizzata per la conversione.
        </p>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl bg-white">
          <p className="text-gray-400 mb-4">Nessun prodotto disponibile.</p>
          <button 
            onClick={() => onNavigate('admin')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Vai al backend per generarne uno &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pages.map(page => {
            // Protezione accesso traduzioni
            const baseContent = page.translations ? page.translations[page.baseLanguage] : null;
            
            return (
              <div key={page.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="aspect-video relative overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                  <img 
                    src={page.imageUrl || 'https://picsum.photos/seed/product/600/400'} 
                    alt={page.productName}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{page.productName}</h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {baseContent?.description || "Nessuna descrizione disponibile."}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {page.translations && Object.keys(page.translations).map(lang => (
                      <span key={lang} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded uppercase">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => onNavigate(page.slug)}
                    className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors"
                  >
                    Visualizza Landing Page
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Storefront;
