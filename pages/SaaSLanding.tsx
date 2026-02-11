
import React from 'react';

interface SaaSLandingProps {
  onNavigate: (path: string) => void;
  session?: any;
}

const SaaSLanding: React.FC<SaaSLandingProps> = ({ onNavigate, session }) => {
  return (
    <div className="bg-white text-gray-900 font-['Plus_Jakarta_Sans'] antialiased">
      {/* Premium Navbar */}
      <nav className="fixed top-0 w-full z-[1000] bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
              S
            </div>
            <span className="text-xl font-black tracking-tight">SaaS<span className="text-blue-600">Mod</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">Funzionalità</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Prezzi</a>
            <a href="#showcase" className="hover:text-blue-600 transition-colors">Showcase</a>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <button 
                onClick={() => onNavigate('admin')}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
              >
                Dashboard AI
              </button>
            ) : (
              <>
                <button onClick={() => onNavigate('auth')} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Accedi</button>
                <button 
                  onClick={() => onNavigate('auth')}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                >
                  Inizia Gratis
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-20 left-0 w-72 h-72 bg-blue-400/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-20 right-0 w-96 h-96 bg-purple-400/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Generatore Landing Page AI v3.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-gray-900">
            Vendi di più con <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Landing Page Virali</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Genera in pochi secondi pagine ad alta conversione con testimonianze TikTok, copywriting persuasivo e ottimizzazione multi-lingua automatica.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button 
              onClick={() => onNavigate('admin')}
              className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-base uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-blue-200"
            >
              Crea la tua prima Landing ✨
            </button>
            <button 
              onClick={() => onNavigate('store')}
              className="w-full sm:w-auto bg-white border border-gray-200 text-gray-900 px-10 py-5 rounded-2xl font-black text-base uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              Guarda lo Showcase
            </button>
          </div>

          <div className="pt-20">
            <div className="relative mx-auto max-w-5xl group">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
               <div className="relative bg-gray-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" alt="Dashboard Preview" className="w-full opacity-80" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Perché scegliere SaaSMod?</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Modulare, Potente, Scalabile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "AI Copywriting", desc: "Testi ottimizzati per la conversione basati sul tuo prodotto e target audience.", icon: "✍️", color: "blue" },
              { title: "TikTok Social Proof", desc: "Integra video in stile TikTok per massimizzare la fiducia degli acquirenti.", icon: "🎬", color: "indigo" },
              { title: "Multi-Language", desc: "Traduci e adatta i prezzi in qualsiasi valuta con un solo click.", icon: "🌍", color: "emerald" },
              { title: "Design Mobile-First", desc: "Il 90% degli acquisti avviene da mobile. Le nostre pagine sono perfette.", icon: "📱", color: "purple" },
              { title: "Dashboard Modulare", desc: "Gestisci decine di prodotti e landing page da un unico pannello backend.", icon: "⚙️", color: "amber" },
              { title: "Analytics Real-time", desc: "Monitora conversioni e scorte di magazzino in tempo reale.", icon: "📊", color: "rose" }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-extrabold mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tight mb-4">Scegli il tuo piano</h2>
            <p className="text-gray-500 font-medium">Nessun costo nascosto. Paga solo per quello che usi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "€0", features: ["1 Landing Page AI", "Basic Templates", "Hosting Gratuito", "Supporto Community"], cta: "Inizia Gratis", popular: false },
              { name: "Professional", price: "€29", priceSub: "/mese", features: ["10 Landing Page AI", "Video TikTok Illimitati", "A/B Testing", "Dominio Personalizzato", "Supporto Prioritario"], cta: "Scegli Pro", popular: true },
              { name: "Agency", price: "€99", priceSub: "/mese", features: ["Landing Illimitate", "Multi-User Access", "White Label", "API Access", "Account Manager Dedicato"], cta: "Contattaci", popular: false }
            ].map((plan, i) => (
              <div key={i} className={`relative p-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col ${plan.popular ? 'border-blue-600 bg-white shadow-2xl scale-105 z-10' : 'border-gray-100 bg-gray-50'}`}>
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Più Popolare</div>
                )}
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black">{plan.price}</span>
                  {plan.priceSub && <span className="text-gray-400 font-bold">{plan.priceSub}</span>}
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                      <span className="text-blue-600">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => onNavigate('auth')}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${plan.popular ? 'bg-blue-600 text-white shadow-xl hover:bg-blue-700' : 'bg-gray-900 text-white hover:bg-black'}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="space-y-6 max-w-xs">
               <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
                <span className="text-xl font-black tracking-tight">SaaS<span className="text-blue-600">Mod</span></span>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                La piattaforma definitiva per marketer moderni che vogliono scalare i propri prodotti con l'intelligenza artificiale.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
               <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest text-blue-500">Prodotto</h4>
                  <ul className="space-y-2 text-sm text-gray-400 font-bold">
                    <li><a href="#" className="hover:text-white transition-colors">Generatore AI</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Modelli Landing</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Showcase</a></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest text-blue-500">Azienda</h4>
                  <ul className="space-y-2 text-sm text-gray-400 font-bold">
                    <li><a href="#" className="hover:text-white transition-colors">Chi Siamo</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contatti</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest text-blue-500">Legale</h4>
                  <ul className="space-y-2 text-sm text-gray-400 font-bold">
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Termini & Condizioni</a></li>
                  </ul>
               </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} SaaSMod - Modular Landing Page SaaS Tool. Built for High Conversions.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SaaSLanding;
