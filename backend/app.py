import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Paths to CSV files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_CAT = os.path.join(BASE_DIR, "pengumuman CAT KDKMP dan KNMP.csv")
CSV_LOLOS = os.path.join(BASE_DIR, "pengumuman lolos KDKMP dan KNMP.csv")
CSV_LAYER1 = os.path.join(BASE_DIR, "pengumuman phtc skt 2026 layer 1.csv")
CSV_LAYER2 = os.path.join(BASE_DIR, "pengumuman phtc skt 2026 layer 2.csv")
CSV_LAYER3 = os.path.join(BASE_DIR, "pengumuman phtc skt 2026 layer 3.csv")

# Global variables to hold DataFrames
df_cat = pd.DataFrame()
df_lolos = pd.DataFrame()
df_layer1 = pd.DataFrame()
df_layer2 = pd.DataFrame()
df_layer3 = pd.DataFrame()

# Dictionary to quickly map Names to a list of Nomor Peserta (for fast name search)
nama_to_nomor_map = {}

# Analytics cache
stats_cache = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    global df_cat, df_lolos, df_layer1, df_layer2, df_layer3, stats_cache, nama_to_nomor_map
    print("[*] Loading CSV data into memory for fast searching... This might take a few seconds.")
    
    def load_safe(path):
        if os.path.exists(path):
            df = pd.read_csv(path, dtype={'Nomor Peserta': str})
            df.columns = df.columns.str.strip()
            # Set index to 'Nomor Peserta' for extremely fast O(1) lookup
            return df.set_index('Nomor Peserta')
        return pd.DataFrame()

    df_cat = load_safe(CSV_CAT)
    df_lolos = load_safe(CSV_LOLOS)
    df_layer1 = load_safe(CSV_LAYER1)
    df_layer2 = load_safe(CSV_LAYER2)
    df_layer3 = load_safe(CSV_LAYER3)
    
    # Build a fast text-search mapping from all unique names in CAT
    # We convert name to uppercase for case-insensitive search
    if not df_cat.empty:
        # Some participants might be in layer files but not in CAT? Usually CAT is everyone.
        # But just to be safe, let's only map CAT for now as it's the largest.
        print("    Building Name search index...")
        for nomor, row in df_cat.iterrows():
            if isinstance(row, pd.DataFrame):
                row = row.iloc[0]
            nama = str(row.get("Nama", "")).strip().upper()
            if nama not in nama_to_nomor_map:
                nama_to_nomor_map[nama] = []
            nama_to_nomor_map[nama].append(nomor)

    print("[v] Data loaded successfully!")
    
    # Calculate advanced stats using Set operations for O(1) intersection/difference
    set_cat_pl = set(df_cat[df_cat['Keterangan'].str.contains(r'\bP/L\b', na=False, regex=True)].index) if not df_cat.empty else set()
    set_cat_p1l = set(df_cat[df_cat['Keterangan'].str.contains(r'\bP1/L\b', na=False, regex=True)].index) if not df_cat.empty else set()
    set_cat_p2l = set(df_cat[df_cat['Keterangan'].str.contains(r'\bP2/L\b', na=False, regex=True)].index) if not df_cat.empty else set()
    
    set_cat_all_pl = set_cat_pl | set_cat_p1l | set_cat_p2l
    
    set_lolos_l = set(df_lolos[df_lolos['Keterangan'].str.contains(r'\bL\b|\bL-1\b|\bL-2\b|\bMS\b|\bTMS\b', na=False, regex=True)].index) if not df_lolos.empty else set()
    # Wait, the user said: "dan pada pengumuman lolos baru peserta dinyatakan l ms dan tms"
    # Actually, they mean if they passed they are L, MS. If they failed they are TMS.
    # Let's assume passed is L, MS, L-1, L-2 for df_lolos.
    # But wait, let me just check the exact 'Keterangan' for passed.
    # Earlier I used just 'L'. But let's check for 'L' or 'MS'.
    set_lolos_passed = set(df_lolos[df_lolos['Keterangan'].isin(['L', 'L-1', 'L-2', 'MS'])].index) if not df_lolos.empty else set()
    
    set_layer1_l = set(df_layer1[df_layer1['Keterangan'].isin(['L', 'L-1', 'L-2', 'MS'])].index) if not df_layer1.empty else set()
    set_layer2_l = set(df_layer2[df_layer2['Keterangan'].isin(['L', 'L-1', 'L-2', 'MS'])].index) if not df_layer2.empty else set()
    set_layer3_l = set(df_layer3[df_layer3['Keterangan'].isin(['L', 'L-1', 'L-2', 'MS'])].index) if not df_layer3.empty else set()

    stats_cache = {
        "cat_total": len(df_cat) if not df_cat.empty else 0,
        "cat_all_pl_count": len(set_cat_all_pl),
        "cat_pl_count": len(set_cat_pl),
        "cat_p1l_count": len(set_cat_p1l),
        "cat_p2l_count": len(set_cat_p2l),
        
        "cat_p_count": len(df_cat[df_cat['Keterangan'] == 'P']) if not df_cat.empty else 0,
        "cat_tl_count": len(df_cat[df_cat['Keterangan'] == 'TL']) if not df_cat.empty else 0,
        "cat_th_count": len(df_cat[df_cat['Keterangan'] == 'TH']) if not df_cat.empty else 0,
        "cat_a_count": len(df_cat[df_cat['Keterangan'] == 'A']) if not df_cat.empty else 0,
        "cat_tp_count": len(df_cat[df_cat['Keterangan'] == 'TP']) if not df_cat.empty else 0,
        "cat_td_count": len(df_cat[df_cat['Keterangan'] == 'TIDAK DIKETAHUI']) if not df_cat.empty else 0,

        "lolos_total": len(df_lolos) if not df_lolos.empty else 0,
        "lolos_l_count": len(set_lolos_passed),  # This is L + MS (for backward compatibility if used elsewhere)
        
        # Split L and MS exactly
        "lolos_strictly_l_count": len(set(df_lolos[df_lolos['Keterangan'].isin(['L', 'L-1', 'L-2'])].index)) if not df_lolos.empty else 0,
        "lolos_strictly_ms_count": len(set(df_lolos[df_lolos['Keterangan'] == 'MS'].index)) if not df_lolos.empty else 0,
        
        "layer1_total": len(df_layer1) if not df_layer1.empty else 0,
        "layer2_total": len(df_layer2) if not df_layer2.empty else 0,
        "layer3_total": len(df_layer3) if not df_layer3.empty else 0,
        
        # Advanced Analytics Metrics
        "cat_all_pl_tidak_lolos": len(set_cat_all_pl - set_lolos_passed),
        "cat_pl_tidak_lolos": len(set_cat_pl - set_lolos_passed),
        "cat_p1l_tidak_lolos": len(set_cat_p1l - set_lolos_passed),
        "cat_p2l_tidak_lolos": len(set_cat_p2l - set_lolos_passed),
        
        # Breakdown TMS for failures
        "cat_pl_tidak_lolos_tms": len((set_cat_pl - set_lolos_passed) & set(df_lolos[df_lolos['Keterangan'] == 'TMS'].index) if not df_lolos.empty else set()),
        "cat_p1l_tidak_lolos_tms": len((set_cat_p1l - set_lolos_passed) & set(df_lolos[df_lolos['Keterangan'] == 'TMS'].index) if not df_lolos.empty else set()),
        "cat_p2l_tidak_lolos_tms": len((set_cat_p2l - set_lolos_passed) & set(df_lolos[df_lolos['Keterangan'] == 'TMS'].index) if not df_lolos.empty else set()),
        
        "cat_all_pl_lolos": len(set_cat_all_pl & set_lolos_passed),
        "cat_pl_lolos": len(set_cat_pl & set_lolos_passed),
        "cat_p1l_lolos": len(set_cat_p1l & set_lolos_passed),
        "cat_p2l_lolos": len(set_cat_p2l & set_lolos_passed),
        
        # Breakdown L vs MS
        "cat_pl_lolos_l": len(set_cat_pl & set(df_lolos[df_lolos['Keterangan'] == 'L'].index) if not df_lolos.empty else set()),
        "cat_pl_lolos_ms": len(set_cat_pl & set(df_lolos[df_lolos['Keterangan'] == 'MS'].index) if not df_lolos.empty else set()),
        "cat_p1l_lolos_l": len(set_cat_p1l & set(df_lolos[df_lolos['Keterangan'] == 'L'].index) if not df_lolos.empty else set()),
        "cat_p1l_lolos_ms": len(set_cat_p1l & set(df_lolos[df_lolos['Keterangan'] == 'MS'].index) if not df_lolos.empty else set()),
        "cat_p2l_lolos_l": len(set_cat_p2l & set(df_lolos[df_lolos['Keterangan'] == 'L'].index) if not df_lolos.empty else set()),
        "cat_p2l_lolos_ms": len(set_cat_p2l & set(df_lolos[df_lolos['Keterangan'] == 'MS'].index) if not df_lolos.empty else set()),
        
        "mundur_layer1": len(set_lolos_passed - set_layer1_l),
        "mundur_layer2": len(set_layer1_l - set_layer2_l),
        "mundur_layer3": len(set_layer2_l - set_layer3_l)
    }
    yield
    print("[*] Shutting down backend...")

app = FastAPI(title="Analisa Seleksi API", lifespan=lifespan)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stats")
def get_stats():
    return stats_cache

@app.get("/api/search/{query}")
def search_peserta(query: str, page: int = 1, limit: int = 20):
    query = query.strip().upper()
    
    # Kumpulkan semua nomor peserta yang cocok
    matched_nomor_peserta = set()
    
    # Cek apakah query adalah nomor peserta langsung
    if not df_cat.empty and query in df_cat.index:
        matched_nomor_peserta.add(query)
    
    # Cek apakah query adalah nama (pencarian teks/substring)
    for nama_lengkap, nomor_list in nama_to_nomor_map.items():
        if query in nama_lengkap:
            for n in nomor_list:
                matched_nomor_peserta.add(n)
                
    if not matched_nomor_peserta:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan. Coba gunakan Nama atau Nomor Peserta yang valid.")
    
    # Sorting hasil pencarian
    matched_list = sorted(list(matched_nomor_peserta))
    
    # Pagination
    total_items = len(matched_list)
    total_pages = (total_items + limit - 1) // limit
    
    # Slice list sesuai halaman
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_list = matched_list[start_idx:end_idx]
    
    # Kumpulkan histori
    results = []
    
    def get_info(df, nomor, tahap):
        if not df.empty and nomor in df.index:
            row = df.loc[nomor]
            if isinstance(row, pd.DataFrame):
                row = row.iloc[0]
            
            return {
                "tahap": tahap,
                "nama": str(row.get("Nama", "TIDAK DIKETAHUI")),
                "keterangan": str(row.get("Keterangan", "TIDAK DIKETAHUI")),
                "nilai": str(row.get("Nilai / Info", "")),
                "ditemukan": True
            }
        return {
            "tahap": tahap,
            "ditemukan": False
        }

    for nomor in paginated_list:
        history = []
        history.append(get_info(df_cat, nomor, "CAT (Seleksi Awal)"))
        history.append(get_info(df_lolos, nomor, "Pengumuman Lolos Utama"))
        history.append(get_info(df_layer1, nomor, "Layer 1 (Tambahan/Pergantian)"))
        history.append(get_info(df_layer2, nomor, "Layer 2 (Tambahan/Pergantian)"))
        history.append(get_info(df_layer3, nomor, "Layer 3 (Tambahan/Pergantian)"))
        
        # Ambil nama yang valid
        nama_orang = "TIDAK DIKETAHUI"
        for h in history:
            if h["ditemukan"]:
                nama_orang = h["nama"]
                break
                
        # Status Akhir
        status_akhir = history[0]["keterangan"]
        for h in history[1:]:
            if h["ditemukan"]:
                status_akhir = h["keterangan"]
        
        results.append({
            "nomor_peserta": nomor,
            "nama": nama_orang,
            "status_akhir": status_akhir,
            "history": history
        })
        
    return {
        "results": results,
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total_items,
            "limit": limit
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
