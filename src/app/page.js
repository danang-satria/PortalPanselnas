"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [satdikPage, setSatdikPage] = useState(1);
  const SATDIK_PER_PAGE = 12;

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    fetchStats();
  }, []);

  const handleSearch = async (e, page = 1) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    if (page === 1) setSearchResults(null);

    try {
      const res = await fetch(`/api/search/${encodeURIComponent(searchQuery.trim())}?page=${page}&limit=20`);
      const data = await res.json();
      
      if (res.ok) {
        setSearchResults(data);
        setCurrentPage(page);
      } else {
        throw new Error(data.error || "Gagal mengambil data dari server.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans p-4 md:p-8">
      
      {/* HEADER & SEARCH BAR (Landing Style) */}
      <header className="max-w-5xl mx-auto mb-12 text-center pt-8 pb-8 border-b border-neutral-900">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent mb-6 drop-shadow-sm">
          Hasil Seleksi SDM KDKMP & KNMP PHTC 2026
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg mb-12">
          Masukkan <strong>Nama</strong> atau <strong>Nomor Peserta</strong> Anda untuk melacak status kelulusan dari tahap awal (CAT) hingga penempatan akhir (Layer 3).
        </p>

        {/* SEARCH BAR */}
        <section className="max-w-2xl mx-auto relative z-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-25 transition duration-1000 group-hover:opacity-40"></div>
          <div className="relative bg-neutral-900 border border-neutral-700 rounded-[2rem] p-2 flex items-center shadow-2xl">
            <form onSubmit={handleSearch} className="flex-1 flex items-center">
              <svg className="w-6 h-6 text-indigo-400 ml-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text"
                placeholder="Ketik Nama atau Nomor Peserta..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-white text-lg px-4 py-4 focus:outline-none placeholder-neutral-500 font-medium tracking-wide"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults(null);
                    setError(null);
                  }}
                  className="mr-3 p-2 text-neutral-500 hover:text-white transition-colors rounded-full hover:bg-neutral-800"
                  aria-label="Hapus pencarian"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
              <button 
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-5 sm:px-8 rounded-full transition-all shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 whitespace-nowrap text-sm sm:text-base"
              >
                {loading ? "Mencari..." : "Cari Data"}
              </button>
            </form>
          </div>
        </section>
      </header>


      {/* SEARCH RESULTS */}
      <section className="max-w-5xl mx-auto pb-16" id="search-results">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center backdrop-blur-sm max-w-2xl mx-auto">
            <p className="text-lg font-medium">{error}</p>
          </div>
        )}

        {searchResults && searchResults.results && (
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="mb-8 border-b border-neutral-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl text-neutral-400">
                  Hasil pencarian: <span className="text-white font-bold">"{searchQuery}"</span>
                </h2>
                <p className="text-neutral-500 mt-1">Ditemukan {searchResults.pagination.total_items} peserta.</p>
              </div>
              
              {/* Pagination Controls */}
              {searchResults.pagination.total_pages > 1 && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSearch(null, searchResults.pagination.current_page - 1)}
                    disabled={searchResults.pagination.current_page === 1}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg disabled:opacity-50 hover:bg-neutral-800 transition"
                  >
                    Prev
                  </button>
                  <div className="px-4 py-2 text-neutral-400 flex items-center bg-black/50 border border-neutral-800/50 rounded-lg">
                    Hal {searchResults.pagination.current_page} / {searchResults.pagination.total_pages}
                  </div>
                  <button 
                    onClick={() => handleSearch(null, searchResults.pagination.current_page + 1)}
                    disabled={searchResults.pagination.current_page === searchResults.pagination.total_pages}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg disabled:opacity-50 hover:bg-neutral-800 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {searchResults.results.map((peserta, idx) => {
                let statusColor = "bg-neutral-800 text-neutral-400";
                const ket = (peserta.status_akhir || "").toUpperCase();
                if (ket.includes("P/L") || ket === "L" || ket === "MS") {
                  statusColor = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                } else if (ket.includes("TMS") || ket.includes("TL") || ket === "A") {
                  statusColor = "bg-rose-500/10 border-rose-500/30 text-rose-400";
                } else {
                  statusColor = "bg-amber-500/10 border-amber-500/30 text-amber-400";
                }

                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedPeserta(peserta)}
                    className="bg-neutral-900/40 border border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-900/80 rounded-xl p-4 cursor-pointer transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
                  >
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{peserta.nama}</h3>
                      <div className="text-sm text-neutral-500 font-mono mt-1">{peserta.nomor_peserta}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-1.5 rounded-lg border font-bold text-xs tracking-wide text-center ${statusColor}`}>
                        {peserta.status_akhir}
                      </div>
                      <svg className="w-5 h-5 text-neutral-600 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* DASHBOARD STATS (ANALISA) */}
      <section className="max-w-5xl mx-auto py-16 border-t border-neutral-900">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white flex justify-center items-center">
            <svg className="w-8 h-8 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Analisa Statistik Kelulusan
          </h2>
          <p className="text-neutral-500 mt-2">Ringkasan pergerakan data dari peserta CAT hingga Layer 3</p>
        </div>
        
        {!stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-neutral-900 rounded-3xl border border-neutral-800"></div>)}
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* ROW 1: KELULUSAN UTAMA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-b from-neutral-900 to-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 transition-all hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 shrink-0">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </div>
                    <h3 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest leading-snug">Hasil Seleksi Kompetensi</h3>
                  </div>
                  <div className="text-4xl font-black text-white mb-2">{stats.cat_all_pl_count?.toLocaleString() || stats.cat_pl_count?.toLocaleString()}</div>
                  <p className="text-sm font-medium text-neutral-400 mb-4">Total Lulus Tes (P/L, P1/L, P2/L)</p>
                  
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-neutral-800">
                    <div>
                      <div className="text-sm font-bold text-indigo-300">{stats.cat_pl_count?.toLocaleString() || 0}</div>
                      <div className="text-[10px] text-neutral-500">P/L</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-indigo-300">{stats.cat_p1l_count?.toLocaleString() || 0}</div>
                      <div className="text-[10px] text-neutral-500">P1/L</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-indigo-300">{stats.cat_p2l_count?.toLocaleString() || 0}</div>
                      <div className="text-[10px] text-neutral-500">P2/L</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-neutral-800/50">
                    <p className="text-[10px] font-semibold text-neutral-500 mb-2 uppercase tracking-wider">Status CAT Lainnya:</p>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-neutral-800/30 rounded p-2">
                        <div className="text-sm font-bold text-neutral-300">{stats.cat_tl_count?.toLocaleString() || 0}</div>
                        <div className="text-[10px] text-neutral-500">Tidak Lulus (TL)</div>
                      </div>
                      <div className="bg-neutral-800/30 rounded p-2">
                        <div className="text-sm font-bold text-neutral-300">{stats.cat_th_count?.toLocaleString() || 0}</div>
                        <div className="text-[10px] text-neutral-500">Tidak Hadir (TH)</div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-indigo-500/80 mt-6">Dari total {stats.cat_total.toLocaleString()} Peserta SKD/SKB</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-b from-neutral-900 to-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 transition-all hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shrink-0">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                    </div>
                    <h3 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest leading-snug">Hasil Seleksi Kompetensi Tambahan</h3>
                  </div>
                  <div className="flex gap-4 sm:gap-8 mb-6">
                    <div>
                      <div className="text-4xl font-black text-white mb-1">{stats.lolos_strictly_l_count?.toLocaleString() || 0}</div>
                      <p className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">Lolos Formasi Utama (L)</p>
                    </div>
                    <div className="border-l border-emerald-900/30 pl-4 sm:pl-8">
                      <div className="text-4xl font-black text-white mb-1">{stats.lolos_strictly_ms_count?.toLocaleString() || 0}</div>
                      <p className="text-[10px] sm:text-xs font-bold text-teal-400 uppercase tracking-wider">Peserta Pengganti (MS)</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-neutral-800">
                    <div>
                      <div className="text-sm font-bold text-emerald-400 mb-1">{stats.cat_pl_lolos?.toLocaleString() || 0}</div>
                      <div className="flex flex-col gap-0.5">
                        <div className="text-[10px] font-medium text-emerald-400/80">L : {stats.cat_pl_lolos_l?.toLocaleString() || 0}</div>
                        <div className="text-[10px] font-medium text-emerald-400/80">MS : {stats.cat_pl_lolos_ms?.toLocaleString() || 0}</div>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">P/L</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-400 mb-1">{stats.cat_p1l_lolos?.toLocaleString() || 0}</div>
                      <div className="flex flex-col gap-0.5">
                        <div className="text-[10px] font-medium text-emerald-400/80">L : {stats.cat_p1l_lolos_l?.toLocaleString() || 0}</div>
                        <div className="text-[10px] font-medium text-emerald-400/80">MS : {stats.cat_p1l_lolos_ms?.toLocaleString() || 0}</div>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">P1/L</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-400 mb-1">{stats.cat_p2l_lolos?.toLocaleString() || 0}</div>
                      <div className="flex flex-col gap-0.5">
                        <div className="text-[10px] font-medium text-emerald-400/80">L : {stats.cat_p2l_lolos_l?.toLocaleString() || 0}</div>
                        <div className="text-[10px] font-medium text-emerald-400/80">MS : {stats.cat_p2l_lolos_ms?.toLocaleString() || 0}</div>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">P2/L</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-emerald-500/80 mt-6">Total nama di daftar kelulusan: {stats.lolos_total.toLocaleString()}</p>
              </motion.div>
            </div>

            {/* ROW 2: KEGAGALAN / TIDAK LOLOS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-r from-red-950/20 to-[#0a0a0a] border border-red-900/30 rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className="absolute right-0 top-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full group-hover:bg-red-600/10 transition-colors"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-[11px] font-bold text-red-400 uppercase tracking-widest leading-snug">Statistik Kegagalan (Gugur Formasi)</h3>
                  </div>
                  <p className="text-neutral-400 text-sm max-w-xl mb-4 leading-relaxed">
                    Peserta yang sebelumnya telah lulus <i>passing grade</i> (P/L, P1/L, P2/L) pada tes CAT, namun <strong>tersingkir di seleksi akhir</strong> karena kalah ranking ataupun dinyatakan Tidak Memenuhi Syarat (TMS) sehingga tidak masuk dalam daftar formasi utama (L) maupun pengganti (MS).
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-red-900/30">
                    <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3 min-w-[120px]">
                      <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">P/L Gugur</div>
                      <div className="text-2xl font-black text-red-400">{stats.cat_pl_tidak_lolos?.toLocaleString() || 0}</div>
                    </div>
                    
                    <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3 min-w-[120px]">
                      <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">P1/L Gugur</div>
                      <div className="text-2xl font-black text-red-400">{stats.cat_p1l_tidak_lolos?.toLocaleString() || 0}</div>
                    </div>
                    
                    <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3 min-w-[120px]">
                      <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">P2/L Gugur</div>
                      <div className="text-2xl font-black text-red-400">{stats.cat_p2l_tidak_lolos?.toLocaleString() || 0}</div>
                    </div>
                  </div>
                </div>
                <div className="text-left md:text-right mt-4 md:mt-0 pt-4 md:pt-0 border-t border-red-900/30 md:border-none w-full md:w-auto">
                  <div className="text-6xl font-black text-white">{stats.cat_all_pl_tidak_lolos?.toLocaleString() || stats.cat_pl_tidak_lolos?.toLocaleString()}</div>
                  <p className="text-sm font-semibold text-red-500 mt-2">Total Peserta Gugur</p>
                </div>
              </div>
            </motion.div>

            {/* ROW 3: DINAMIKA PENGUNDURAN DIRI */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 shrink-0">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                </div>
                <h3 className="text-[11px] font-bold text-amber-500 uppercase tracking-widest leading-snug">Dinamika Pengunduran Diri (Transisi Layer)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-5 hover:border-amber-500/30 transition-colors">
                  <p className="text-sm text-neutral-400 mb-2">Mengundurkan Diri (Layer 1)</p>
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-bold text-white">{stats.mundur_layer1.toLocaleString()}</div>
                    <span className="text-[11px] text-amber-500/80 mb-1.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Naik ke L: {stats.mundur_layer1.toLocaleString()} org
                    </span>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-5 hover:border-amber-500/30 transition-colors">
                  <p className="text-sm text-neutral-400 mb-2">Mengundurkan Diri (Layer 2)</p>
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-bold text-white">{stats.mundur_layer2.toLocaleString()}</div>
                    <span className="text-[11px] text-amber-500/80 mb-1.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Naik ke L: {stats.mundur_layer2.toLocaleString()} org
                    </span>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-5 hover:border-amber-500/30 transition-colors">
                  <p className="text-sm text-neutral-400 mb-2">Mengundurkan Diri (Layer 3)</p>
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-bold text-white">{stats.mundur_layer3.toLocaleString()}</div>
                    <span className="text-[11px] text-amber-500/80 mb-1.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Naik ke L: {stats.mundur_layer3.toLocaleString()} org
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </section>

      {/* SATDIK DISTRIBUTION SECTION */}
      {stats && stats.satdik_counts && Object.keys(stats.satdik_counts).length > 0 && (
        <section className="max-w-5xl mx-auto py-12 border-t border-neutral-900" id="satdik-section">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white flex justify-center items-center">
              <svg className="w-8 h-8 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              Persebaran Penempatan SATDIK
            </h2>
            <p className="text-neutral-500 mt-2">Jumlah peserta yang berhasil ditempatkan di setiap Satuan Pendidikan</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.satdik_counts)
              .slice((satdikPage - 1) * SATDIK_PER_PAGE, satdikPage * SATDIK_PER_PAGE)
              .map(([satdik, count], idx) => (
              <motion.div 
                key={satdik + satdikPage}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-neutral-900/60 border border-neutral-800 hover:border-blue-500/50 rounded-2xl p-5 flex items-center justify-between transition-colors shadow-lg"
              >
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-bold text-neutral-300 leading-snug">{satdik}</h4>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 px-3 py-2 rounded-xl flex flex-col items-center justify-center min-w-[3.5rem]">
                  <span className="text-xl font-black text-blue-400">{count}</span>
                  <span className="text-[10px] uppercase font-bold text-blue-500/70 tracking-wider">Org</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls for SATDIK */}
          {Object.keys(stats.satdik_counts).length > SATDIK_PER_PAGE && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={() => {
                  setSatdikPage(p => Math.max(1, p - 1));
                  document.getElementById("satdik-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                disabled={satdikPage === 1}
                className="px-6 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-white font-medium hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kembali
              </button>
              <div className="text-neutral-500 text-sm font-medium bg-black/50 px-4 py-2 rounded-full border border-neutral-800/50">
                Halaman {satdikPage} dari {Math.ceil(Object.keys(stats.satdik_counts).length / SATDIK_PER_PAGE)}
              </div>
              <button
                onClick={() => {
                  setSatdikPage(p => Math.min(Math.ceil(Object.keys(stats.satdik_counts).length / SATDIK_PER_PAGE), p + 1));
                  document.getElementById("satdik-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                disabled={satdikPage === Math.ceil(Object.keys(stats.satdik_counts).length / SATDIK_PER_PAGE)}
                className="px-6 py-2 bg-blue-600 border border-blue-500 rounded-full text-white font-medium hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </section>
      )}

      {/* DISCLAIMER SECTION */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Disclaimer & Catatan Penting
          </h3>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">📌</span> 
              <span>Data dalam website ini diekstrak murni dari dokumen PDF pengumuman resmi yang dirilis oleh Panselnas di situs <i>panselnas.go.id</i>.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">📌</span> 
              <span>Sistem peringkatan (*ranking*) diurutkan berdasarkan <strong>Nilai Kognitif</strong> per formasi (KDKMP/KNMP). Jika terdapat kesamaan nilai kognitif, <strong>Nilai Substansi/Manajemen</strong> akan digunakan sebagai penentu urutan. Oleh karena itu, urutan di website ini bisa saja sedikit berbeda dengan urutan di dalam dokumen PDF.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">📌</span> 
              <span>Tujuan utama website ini diciptakan murni untuk <strong>membantu mempermudah</strong> rekan-rekan semua dalam melakukan pencarian riwayat kelulusan secara lengkap, cepat, dan komprehensif tanpa perlu membuka banyak file PDF.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">⚠️</span> 
              <span><strong>PERINGATAN:</strong> Sangat mungkin terjadi sedikit perbedaan data akibat proses teknis ekstraksi data (*placing data error*). Oleh karena itu, silakan jadikan <strong>website resmi phtc.panselnas.go.id</strong> (melalui *login* akun masing-masing) sebagai acuan status final Lulus / Tidak Lulus yang paling valid dan mengikat.</span>
            </p>
            <p className="flex items-start gap-2 mt-4 pt-4 border-t border-amber-500/20 font-medium text-amber-200 text-base">
              <span className="mt-0.5">✨</span> 
              <span>Tetap semangat untuk teman-teman semua, baik yang nantinya dinyatakan lulus di tanggal 5-7 Juni, ataupun yang belum mendapatkan kesempatan kali ini. Perjuangan kalian luar biasa!</span>
            </p>
          </div>
        </div>
      </section>

      {/* MODAL / POP-UP */}
      {selectedPeserta && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedPeserta(null)}
        >
          <div 
            className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 md:p-10 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-6 right-6 z-10 text-neutral-500 hover:text-white transition-colors bg-neutral-900/50 p-2 rounded-full"
              onClick={() => setSelectedPeserta(null)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="mb-8 border-b border-neutral-800 pb-6 pr-10">
              <h3 className="text-3xl font-extrabold text-white mb-3">{selectedPeserta.nama}</h3>
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/50 text-indigo-300 text-sm font-mono border border-indigo-500/20 shadow-inner">
                  {selectedPeserta.nomor_peserta}
                </div>
                {(() => {
                  let formasi = "";
                  let score = "";
                  let satdik = "";
                  selectedPeserta.history.forEach(item => {
                    if (item.ditemukan && item.nilai && item.nilai !== "nan") {
                      if (item.tahap === "CAT (Seleksi Awal)") {
                        if (item.nilai.includes(" | ")) {
                          formasi = item.nilai.split(" | ")[0];
                          score = item.nilai.split(" | ")[1];
                        } else {
                          score = item.nilai;
                        }
                      } else {
                        if (item.nilai.includes(" | ")) {
                          formasi = item.nilai.split(" | ")[0];
                          satdik = item.nilai.split(" | ")[1];
                        } else if (item.nilai.includes(" [")) {
                          formasi = item.nilai.split(" [")[0];
                        }
                      }
                    }
                  });
                  
                  return (
                    <>
                      {formasi && (
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-900/30 text-emerald-300 text-sm font-semibold border border-emerald-500/20 shadow-inner">
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          {formasi}
                        </div>
                      )}
                      {score && (
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-900/30 text-amber-300 text-sm font-bold border border-amber-500/20 shadow-inner">
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                          Nilai CAT: {score}
                        </div>
                      )}
                      {satdik && satdik !== "-" && (
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/30 text-blue-300 text-sm font-bold border border-blue-500/20 shadow-inner">
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                          Satdik: {satdik}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="relative border-l-2 border-neutral-800 ml-4 space-y-8 pb-4">
              {selectedPeserta.history.map((item, index) => {
                const isFound = item.ditemukan;
                
                let statusColor = "bg-neutral-800 border-neutral-700 text-neutral-400";
                let dotColor = "bg-neutral-800 border-neutral-700";
                
                if (isFound) {
                  const ket = item.keterangan.toUpperCase();
                  if (ket.includes("P/L") || ket === "L" || ket === "MS") {
                    statusColor = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                    dotColor = "bg-emerald-500 border-emerald-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
                  } else if (ket.includes("TMS") || ket.includes("TL") || ket === "A") {
                    statusColor = "bg-rose-500/10 border-rose-500/30 text-rose-400";
                    dotColor = "bg-rose-500 border-rose-900";
                  } else {
                    statusColor = "bg-amber-500/10 border-amber-500/30 text-amber-400";
                    dotColor = "bg-amber-500 border-amber-900";
                  }
                }

                return (
                  <div key={index} className="relative pl-8 transition-all hover:translate-x-1 duration-300 group">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors ${dotColor} group-hover:scale-110`}></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className={`text-lg font-bold ${isFound ? 'text-white' : 'text-neutral-600'}`}>
                          {item.tahap}
                        </h4>
                        {!isFound && <p className="text-sm text-neutral-700 mt-1 italic">Tidak ada rekam jejak di tahapan ini.</p>}
                      </div>
                      
                      {isFound && (
                        <div className="sm:mt-0 mt-2">
                          <div className={`px-5 py-2 rounded-xl border font-bold text-sm tracking-wide text-center sm:text-right ${statusColor}`}>
                            {item.keterangan}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
}
