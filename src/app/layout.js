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
  title: {
    default: "Hasil Seleksi SDM KDKMP & KNMP PHTC 2026",
    template: "%s | Portal PHTC 2026"
  },
  description: "Portal resmi dan tercepat pencarian hasil kelulusan seleksi SDM KDKMP dan KNMP 2026. Pantau riwayat status dari tahap CAT hingga penempatan Satdik Layer 3 secara instan.",
  keywords: ["pengumuman CPNS", "PHTC 2026", "KDKMP", "KNMP", "hasil seleksi CAT", "lulus seleksi", "Satdik", "penempatan PHTC", "portal seleksi"],
  authors: [{ name: "Panselnas PHTC" }],
  creator: "Danang Satria",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://portalpanselnas.vercel.app", // Adjust if actual Vercel URL is different
    title: "Portal Kelulusan SDM KDKMP & KNMP PHTC 2026",
    description: "Cari nomor peserta atau nama Anda untuk mengetahui status kelulusan akhir KDKMP & KNMP secara real-time dari CAT hingga Layer 3.",
    siteName: "Portal PHTC 2026",
    images: [
      {
        url: "/og-image.png", // Next.js standard or fallback
        width: 1200,
        height: 630,
        alt: "Portal Kelulusan PHTC 2026"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Hasil Seleksi SDM KDKMP & KNMP PHTC 2026",
    description: "Pantau kelulusan PHTC Anda secara instan dari awal hingga akhir!"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
