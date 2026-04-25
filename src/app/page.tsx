import Link from 'next/link';

export default async function HomePage(props: {
    params: Promise<any>;
    searchParams: Promise<any>;
}) {
    // Next.js 15 Async Rule: We must await these even if we don't use them directly
    await props.params;
    await props.searchParams;

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans">
            <nav className="p-10 flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-4xl font-black tracking-tighter italic">POST<span className="text-blue-600">JET</span></h1>
                <Link href="/api/auth/login" className="bg-black text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all">Launch Mission</Link>
            </nav>

            <main className="max-w-4xl mx-auto text-center pt-32 pb-20 px-6">
                <div className="inline-block bg-blue-50 text-blue-600 px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-10 border border-blue-100 shadow-sm">AI Powered Social Engine</div>
                <h2 className="text-7xl md:text-[8rem] font-black tracking-tighter leading-[0.85] text-black mb-12 uppercase italic">One Click.<br/><span className="text-blue-600">Global.</span></h2>
                <p className="text-xl text-slate-400 font-bold uppercase tracking-tight mb-16 max-w-xl mx-auto">The cleanest way to dominate social media universe.</p>
                <Link href="/api/auth/register" className="bg-blue-600 text-white px-16 py-8 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all inline-block uppercase italic tracking-tighter">Start For Free</Link>
            </main>
        </div>
    );
}