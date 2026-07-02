import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portal CPNS PHTC 2026",
  description: "Portal pencarian hasil kelulusan seleksi SDM KDKMP dan KNMP",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
        
        {/* HEADER GLOBAL */}
        <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-900">
          <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <span className="font-bold tracking-wide text-white group-hover:text-indigo-200 transition-colors">PHTC 2026</span>
            </a>
            <div className="flex gap-6">
              <a href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Dasbor Utama</a>
              <a href="/kamus" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Kamus Status</a>
            </div>
          </div>
        </nav>

        {/* KONTEN UTAMA */}
        <main className="flex-1">
          {children}
        </main>

        {/* FOOTER GLOBAL */}
        <footer className="border-t border-neutral-900 bg-[#050505] py-8">
          <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-neutral-500 text-sm">
              &copy; 2026 Portal Rekrutmen PHTC. Dibuat dengan penuh dedikasi.
            </p>
            <p className="text-neutral-600 text-xs flex items-center justify-center md:justify-end gap-1">
              Data yang disajikan berdasarkan rekapitulasi Panselnas.
            </p>
          </div>
        </footer>
        
      </body>
    </html>
  );
}
