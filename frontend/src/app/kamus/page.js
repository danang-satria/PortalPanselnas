"use client";

export default function Kamus() {
  return (
    <div className="font-sans p-4 md:p-8 pt-12 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent mb-4 drop-shadow-sm">
          Kamus Keterangan Status
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          Penjelasan lengkap mengenai kode status yang diterbitkan pada dokumen PDF pengumuman hasil seleksi Panselnas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* L & TMS */}
        <div className="bg-[#111] border border-emerald-900/40 rounded-3xl p-8 hover:border-emerald-500/50 transition-colors shadow-lg">
          <div className="text-emerald-400 font-bold mb-3 text-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              L
            </div>
            Lulus
          </div>
          <p className="text-neutral-300 leading-relaxed text-base">
            Peserta mengikuti seleksi kompetensi tambahan, memenuhi persyaratan, dan memperoleh alokasi pada kebutuhan/formasi tahap awal KDKMP atau KNMP sesuai dengan penetapan Panselnas.
          </p>
        </div>

        <div className="bg-[#111] border border-red-900/40 rounded-3xl p-8 hover:border-red-500/50 transition-colors shadow-lg">
          <div className="text-red-400 font-bold mb-3 text-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              TMS
            </div>
            Tidak Memenuhi Syarat
          </div>
          <p className="text-neutral-300 leading-relaxed text-base">
            Peserta yang tidak memenuhi persyaratan (Gugur) Seleksi Kompetensi Tambahan dan tidak dapat melanjutkan pada tahapan berikutnya / Tidak memenuhi syarat yang ditentukan oleh Panselnas.
          </p>
        </div>

        {/* MS */}
        <div className="md:col-span-2 bg-[#111] border border-teal-900/40 rounded-3xl p-8 hover:border-teal-500/50 transition-colors shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/5 blur-3xl rounded-full pointer-events-none"></div>
          <div className="text-teal-400 font-bold mb-4 text-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center">
              MS
            </div>
            Memenuhi Syarat (Namun Belum Mendapat Alokasi)
          </div>
          <p className="text-neutral-300 leading-relaxed text-base max-w-4xl">
            Peserta yang memenuhi persyaratan Seleksi Kompetensi Tambahan, namun <strong>belum memperoleh alokasi</strong> pada kebutuhan/formasi tahap awal. Peserta dengan kode MS tetap diberi kesempatan mengikuti tahapan pelatihan/pembinaan SDM sesuai ketentuan Panselnas dan ditempatkan dalam basis data/talent pool untuk dapat dipertimbangkan pada pengisian kebutuhan/formasi berikutnya sesuai kebutuhan, wilayah, minat, bakat, kompetensi, peringkat nilai, dan ketersediaan formasi. <br/><br/>
            <span className="text-teal-500/80 italic font-medium">Status MS tidak dimaknai sebagai penetapan alokasi formasi dan tidak menimbulkan hak otomatis untuk diangkat, ditempatkan, atau menerima penugasan tertentu.</span>
          </p>
        </div>

        {/* Others */}
        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900 transition-colors">
          <div className="text-white font-bold mb-2 text-xl">P</div>
          <p className="text-sm text-neutral-400 leading-relaxed">Peserta seleksi kompetensi memenuhi Nilai Ambang Batas (NAB) sub tes kognitif lebih besar sama dengan 110.</p>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900 transition-colors">
          <div className="text-white font-bold mb-2 text-xl">P1</div>
          <p className="text-sm text-neutral-400 leading-relaxed">Peserta seleksi kompetensi memenuhi Nilai Ambang Batas (NAB) sub tes kognitif lebih besar sama dengan 100.</p>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900 transition-colors">
          <div className="text-white font-bold mb-2 text-xl">P2</div>
          <p className="text-sm text-neutral-400 leading-relaxed">Peserta seleksi kompetensi memenuhi Nilai Ambang Batas (NAB) sub tes kognitif lebih besar sama dengan 90 dan sub tes substansi lebih besar sama dengan 71.</p>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900 transition-colors">
          <div className="text-white font-bold mb-2 text-xl">APS</div>
          <p className="text-sm text-neutral-400 leading-relaxed">Peserta yang mengajukan pengunduran diri secara resmi.</p>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900 transition-colors">
          <div className="text-white font-bold mb-2 text-xl">TL</div>
          <p className="text-sm text-neutral-400 leading-relaxed">Peserta dinyatakan Tidak Lulus dalam tahapan seleksi.</p>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900 transition-colors">
          <div className="text-white font-bold mb-2 text-xl">TH</div>
          <p className="text-sm text-neutral-400 leading-relaxed">Peserta Tidak Hadir pada saat pelaksanaan seleksi.</p>
        </div>

      </div>
    </div>
  );
}
