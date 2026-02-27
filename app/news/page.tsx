import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
      <Header />
      <main className="flex-1 p-6 md:p-12 lg:p-24">
      </main>
      <Footer />
    </div>
  );
}
