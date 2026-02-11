
import React, { useState, useEffect } from 'react';
import { LandingPage } from './types';
import Storefront from './pages/Storefront';
import AdminDashboard from './pages/AdminDashboard';
import LandingPageGenerator from './pages/LandingPageGenerator';
import PublicLandingPage from './pages/PublicLandingPage';
import Auth from './pages/Auth';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentParams, setCurrentParams] = useState<any>({});
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchPages();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pages:', error);
    } else if (data) {
      const mappedData: LandingPage[] = data.map((item: any) => {
        // Safe parsing delle traduzioni per prevenire crash se il DB restituisce stringhe
        let translations = item.translations;
        if (typeof translations === 'string') {
          try {
            translations = JSON.parse(translations);
          } catch (e) {
            console.error("Errore parsing traduzioni per", item.id, e);
            translations = {};
          }
        }

        return {
          id: item.id,
          slug: item.slug,
          productName: item.product_name,
          imageUrl: item.image_url,
          additionalImages: item.additional_images || [],
          buyLink: item.buy_link,
          baseLanguage: item.base_language,
          niche: item.niche,
          targetAudience: item.target_audience,
          tone: item.tone,
          translations: translations || {},
          createdAt: item.created_at
        };
      });
      setPages(mappedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const [path, queryString] = hash.split('?');
      const params = new URLSearchParams(queryString);
      
      setCurrentPage(path || 'home');
      setCurrentParams(Object.fromEntries(params.entries()));
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const addPage = async (newPage: LandingPage) => {
    const { error } = await supabase
      .from('landing_pages')
      .insert({
        id: newPage.id,
        user_id: session?.user?.id,
        product_name: newPage.productName,
        slug: newPage.slug,
        image_url: newPage.imageUrl,
        additional_images: newPage.additionalImages,
        buy_link: newPage.buyLink,
        base_language: newPage.baseLanguage,
        niche: newPage.niche,
        target_audience: newPage.targetAudience,
        tone: newPage.tone,
        translations: newPage.translations
      });

    if (error) {
      alert('Errore nel salvataggio: ' + error.message);
    } else {
      setPages(prev => [newPage, ...prev]);
      navigate('admin');
    }
  };

  const updatePage = async (updatedPage: LandingPage) => {
    const { error } = await supabase
      .from('landing_pages')
      .update({
        product_name: updatedPage.productName,
        slug: updatedPage.slug,
        image_url: updatedPage.imageUrl,
        additional_images: updatedPage.additionalImages,
        buy_link: updatedPage.buyLink,
        base_language: updatedPage.baseLanguage,
        niche: updatedPage.niche,
        target_audience: updatedPage.targetAudience,
        tone: updatedPage.tone,
        translations: updatedPage.translations
      })
      .eq('id', updatedPage.id);

    if (error) {
      alert('Errore nell\'aggiornamento: ' + error.message);
    } else {
      setPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
      navigate('admin');
    }
  };

  const deletePage = async (id: string) => {
    const { error } = await supabase
      .from('landing_pages')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Errore nell\'eliminazione: ' + error.message);
    } else {
      setPages(prev => prev.filter(p => p.id !== id));
    }
  };

  if (loading && pages.length === 0) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 font-bold">Caricamento sistema...</div>;
  }

  const renderContent = () => {
    const systemRoutes = ['home', 'admin', 'generate', 'edit', 'auth', 'view'];
    const pageBySlug = pages.find(p => p.slug === currentPage);

    if (pageBySlug && !systemRoutes.includes(currentPage)) {
      return <PublicLandingPage page={pageBySlug} onNavigate={navigate} />;
    }

    switch (currentPage) {
      case 'home':
        return <Storefront pages={pages} onNavigate={navigate} />;
      case 'admin':
        return session ? (
          <AdminDashboard pages={pages} onDelete={deletePage} onNavigate={navigate} />
        ) : (
          <Auth onNavigate={navigate} />
        );
      case 'generate':
      case 'edit':
        const pageToEdit = currentPage === 'edit' ? pages.find(p => p.id === currentParams.id) : undefined;
        return session ? (
          <LandingPageGenerator 
            onSave={addPage} 
            onUpdate={updatePage}
            onNavigate={navigate} 
            initialData={pageToEdit}
          />
        ) : (
          <Auth onNavigate={navigate} />
        );
      case 'view':
        const pageById = pages.find(p => p.id === currentParams.id);
        if (pageById) {
          return <PublicLandingPage page={pageById} onNavigate={navigate} />;
        }
        return (
          <div className="p-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Pagina non trovata</h2>
            <button onClick={() => navigate('home')} className="text-blue-600 underline">Torna alla Home</button>
          </div>
        );
      default:
        return <Storefront pages={pages} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {renderContent()}
    </div>
  );
};

export default App;
