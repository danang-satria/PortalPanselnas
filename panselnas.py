import os
import sys
import re
import pandas as pd
import fitz
import sqlite3
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_progress_bar(iteration, total, prefix='', suffix='', decimals=1, length=50, fill='█', printEnd="\r"):
    if total == 0: return
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print(f'\r  {prefix} |{bar}| {percent}% {suffix}', end=printEnd)
    if iteration == total: 
        print()

# ==========================================
# 1. EKSTRAK PDF STANDAR (CAT & LAYER 1)
# ==========================================
def konversi_pdf_ke_csv_cepat(pdf_path, csv_path):
    if not os.path.exists(pdf_path): return
    print(f"\n[*] Memproses PDF Standar: {os.path.basename(pdf_path)}")
    valid_statuses = ['TMS-1', 'P1/L', 'P2/L', 'P3/L', 'P4/L', 'P/L', 'L-1', 'L-2', 'TMS', 'APS', 'MS', 'TL', 'TH', 'TP', 'P', 'L', 'A']
    data_tabel = []
    
    try:
        doc = fitz.open(pdf_path)
        total_halaman = len(doc)
        print_progress_bar(0, total_halaman, prefix='Progress:', suffix='Selesai', length=40)
        
        for i in range(total_halaman):
            page = doc[i]
            words = page.get_text("words")
            if not words: continue
                
            words.sort(key=lambda w: (round(w[1]/4)*4, w[0]))
            rows = {}
            for w in words:
                y = round(w[1]/4)*4
                if y not in rows: rows[y] = []
                rows[y].append(w)
                
            for y, row_words in rows.items():
                id_match, id_x1 = None, 0
                for w in row_words:
                    if re.match(r'^[A-Z0-9]{12,24}$', w[4]) and sum(c.isdigit() for c in w[4]) >= 10:
                        id_match = w[4]
                        id_x1 = w[2]
                        break
                
                if id_match:
                    name_words = [w[4] for w in row_words if w[0] > id_x1 and w[0] < 320]
                    nama = ' '.join(name_words) if name_words else "TIDAK TERBACA"
                    
                    keterangan = "TIDAK DIKETAHUI"
                    status_idx = len(row_words)
                    for idx, w in reversed(list(enumerate(row_words))):
                        if w[4] in valid_statuses:
                            keterangan = w[4]
                            status_idx = idx
                            break
                            
                    info_words = [w[4] for w in row_words if w[0] >= 320 and row_words.index(w) < status_idx]
                    info_tambahan = ' '.join(info_words)
                            
                    data_tabel.append({"Nomor Peserta": id_match, "Nama": nama, "Nilai / Info": info_tambahan, "Keterangan": keterangan})
            print_progress_bar(i + 1, total_halaman, prefix='Progress:', suffix='Selesai', length=40)

        if data_tabel:
            pd.DataFrame(data_tabel).to_csv(csv_path, index=False)
            print(f"[v] Disimpan ke {os.path.basename(csv_path)} ({len(data_tabel)} baris)")
    except Exception as e:
        print(f"[X] Error: {e}")

# ==========================================
# 2. EKSTRAK PDF KNMP
# ==========================================
def ekstrak_knmp(pdf_path, csv_path):
    if not os.path.exists(pdf_path): return
    print(f"\n[*] Memproses PDF KNMP: {os.path.basename(pdf_path)}")
    valid_statuses = ['TMS-1', 'P1/L', 'P2/L', 'P3/L', 'P4/L', 'P/L', 'L-1', 'L-2', 'TMS', 'APS', 'MS', 'TL', 'TH', 'TP', 'P', 'L', 'A']
    data_tabel = []
    
    try:
        doc = fitz.open(pdf_path)
        total_halaman = len(doc)
        current_formasi = "TIDAK DIKETAHUI"
        print_progress_bar(0, total_halaman, prefix='Progress:', suffix='Selesai', length=40)
        
        for i in range(total_halaman):
            page = doc[i]
            raw_text = page.get_text("text").replace('\n', ' ')
            m = re.search(r'Jabatan Formasi\s*:\s*[A-Z0-9]+\s*-\s*(.*?)\s*\d+\s*Lokasi Formasi', raw_text)
            if m:
                current_formasi = ' '.join(m.group(1).strip().split())

            words = page.get_text("words")
            if not words: continue
                
            words.sort(key=lambda w: (round(w[1]/4)*4, w[0]))
            rows = {}
            for w in words:
                y = round(w[1]/4)*4
                if y not in rows: rows[y] = []
                rows[y].append(w)
                
            for y, row_words in rows.items():
                id_match, id_x1 = None, 0
                for w in row_words:
                    if re.match(r'^[A-Z0-9]{12,24}$', w[4]) and sum(c.isdigit() for c in w[4]) >= 10:
                        id_match = w[4]; id_x1 = w[2]; break
                
                if id_match:
                    name_words = [w[4] for w in row_words if w[0] > id_x1 and w[0] < 320]
                    nama = ' '.join(name_words) if name_words else "TIDAK TERBACA"
                    
                    keterangan = "TIDAK DIKETAHUI"
                    status_idx = len(row_words)
                    for idx, w in reversed(list(enumerate(row_words))):
                        if w[4] in valid_statuses:
                            keterangan = w[4]; status_idx = idx; break
                            
                    info_words = [w[4] for w in row_words if w[0] >= 320 and row_words.index(w) < status_idx]
                    nilai_info_final = f"{current_formasi} | {' '.join(info_words)}"
                    data_tabel.append({"Nomor Peserta": id_match, "Nama": nama, "Nilai / Info": nilai_info_final, "Keterangan": keterangan})
            print_progress_bar(i + 1, total_halaman, prefix='Progress:', suffix='Selesai', length=40)

        if data_tabel:
            pd.DataFrame(data_tabel).to_csv(csv_path, index=False)
            print(f"[v] Disimpan ke {os.path.basename(csv_path)} ({len(data_tabel)} baris)")
    except Exception as e:
        print(f"[X] Error: {e}")

# ==========================================
# 3. EKSTRAK LAYER 2 & 3 (SATDIK)
# ==========================================
def ekstrak_layer23(pdf_path, csv_path):
    if not os.path.exists(pdf_path): return
    print(f"\n[*] Memproses PDF Layer 2/3: {os.path.basename(pdf_path)}")
    valid_statuses = ['TMS-1', 'P1/L', 'P2/L', 'P3/L', 'P4/L', 'P/L', 'L-1', 'L-2', 'TMS', 'APS', 'MS', 'TL', 'TH', 'TP', 'P', 'L', 'A']
    data_tabel = []
    
    try:
        doc = fitz.open(pdf_path)
        total_halaman = len(doc)
        current_formasi = "TIDAK DIKETAHUI"
        print_progress_bar(0, total_halaman, prefix='Progress:', suffix='Selesai', length=40)
        
        for i in range(total_halaman):
            page = doc[i]
            raw_text = page.get_text("text").replace('\n', ' ')
            m = re.search(r'Jabatan Formasi\s*:\s*[A-Z0-9]+\s*-\s*(.*?)\s*\d+\s*Lokasi Formasi', raw_text)
            if m:
                current_formasi = ' '.join(m.group(1).strip().split())

            words = page.get_text("words")
            if not words: continue
                
            words.sort(key=lambda w: (round(w[1]/4)*4, w[0]))
            rows = {}
            for w in words:
                y = round(w[1]/4)*4
                if y not in rows: rows[y] = []
                rows[y].append(w)
                
            for y, row_words in rows.items():
                id_match, id_x1 = None, 0
                for w in row_words:
                    if re.match(r'^[A-Z0-9]{12,24}$', w[4]) and sum(c.isdigit() for c in w[4]) >= 10:
                        id_match = w[4]; id_x1 = w[2]; break
                
                if id_match:
                    right_words = [w[4] for w in row_words if w[0] > id_x1]
                    row_text = ' '.join(right_words)
                    
                    nama = "TIDAK TERBACA"; keterangan = "TIDAK DIKETAHUI"; satdik = "-"
                    
                    if current_formasi != "TIDAK DIKETAHUI" and current_formasi in row_text:
                        parts = row_text.split(current_formasi, 1)
                        nama = parts[0].strip()
                        rest_words = parts[1].strip().split()
                        if rest_words:
                            keterangan = rest_words[0]
                            if len(rest_words) > 1: satdik = ' '.join(rest_words[1:])
                    else:
                        status_idx = -1
                        for idx, w in reversed(list(enumerate(right_words))):
                            if w in valid_statuses:
                                keterangan = w; status_idx = idx; break
                        if status_idx != -1:
                            nama = ' '.join(right_words[:status_idx]).replace(current_formasi, '').strip()
                            satdik_words = right_words[status_idx+1:]
                            satdik = ' '.join(satdik_words) if satdik_words else '-'
                            
                    nilai_info_final = f"{current_formasi} | {satdik}"
                    data_tabel.append({"Nomor Peserta": id_match, "Nama": nama, "Nilai / Info": nilai_info_final, "Keterangan": keterangan})
            print_progress_bar(i + 1, total_halaman, prefix='Progress:', suffix='Selesai', length=40)

        if data_tabel:
            pd.DataFrame(data_tabel).to_csv(csv_path, index=False)
            print(f"[v] Disimpan ke {os.path.basename(csv_path)} ({len(data_tabel)} baris)")
    except Exception as e:
        print(f"[X] Error: {e}")

# ==========================================
# 4. KONVERSI SQLITE
# ==========================================
def load_safe(path):
    if os.path.exists(path):
        df = pd.read_csv(path, dtype={'Nomor Peserta': str})
        df.columns = df.columns.str.strip()
        df['Nomor Peserta'] = df['Nomor Peserta'].str.strip()
        return df.set_index('Nomor Peserta')
    return pd.DataFrame()

def build_sqlite_db():
    print("\n[*] Menyatukan Data dan Membangun Database SQLite...")
    CSV_CAT = os.path.join(BASE_DIR, "pengumuman CAT KDKMP dan KNMP.csv")
    CSV_KNMP = os.path.join(BASE_DIR, "pengumuman CAT KNMP.csv")
    CSV_LOLOS = os.path.join(BASE_DIR, "pengumuman lolos KDKMP dan KNMP.csv")
    CSV_LAYER1 = os.path.join(BASE_DIR, "pengumuman phtc skt 2026 layer 1.csv")
    CSV_LAYER2 = os.path.join(BASE_DIR, "pengumuman phtc skt 2026 layer 2 (fixed).csv")
    CSV_LAYER3 = os.path.join(BASE_DIR, "pengumuman phtc skt 2026 layer 3 (fixed).csv")
    DB_PATH = os.path.join(BASE_DIR, "database.db")

    df_cat = load_safe(CSV_CAT)
    df_knmp = load_safe(CSV_KNMP)
    if not df_knmp.empty:
        df_cat = pd.concat([df_cat, df_knmp])
        df_cat = df_cat[~df_cat.index.duplicated(keep='first')]

    df_lolos = load_safe(CSV_LOLOS)
    df_layer1 = load_safe(CSV_LAYER1)
    df_layer2 = load_safe(CSV_LAYER2)
    df_layer3 = load_safe(CSV_LAYER3)

    set_cat_pl = set(df_cat[df_cat['Keterangan'].str.contains(r'\bP/L\b', na=False, regex=True)].index) if not df_cat.empty else set()
    set_cat_p1l = set(df_cat[df_cat['Keterangan'].str.contains(r'\bP1/L\b', na=False, regex=True)].index) if not df_cat.empty else set()
    set_cat_p2l = set(df_cat[df_cat['Keterangan'].str.contains(r'\bP2/L\b', na=False, regex=True)].index) if not df_cat.empty else set()
    set_cat_all_pl = set_cat_pl | set_cat_p1l | set_cat_p2l
    
    set_lolos_passed = set(df_lolos[df_lolos['Keterangan'].isin(['L', 'L-1', 'L-2', 'MS'])].index) if not df_lolos.empty else set()
    set_layer1_l = set(df_layer1[df_layer1['Keterangan'].isin(['L', 'L-1', 'L-2', 'MS'])].index) if not df_layer1.empty else set()
    set_layer2_l = set(df_layer2[df_layer2['Keterangan'].isin(['L', 'L-1', 'L-2', 'MS'])].index) if not df_layer2.empty else set()
    set_layer3_l = set(df_layer3[df_layer3['Keterangan'].isin(['L', 'L-1', 'L-2', 'MS'])].index) if not df_layer3.empty else set()

    stats = {
        "cat_total": len(df_cat) if not df_cat.empty else 0,
        "cat_all_pl_count": len(set_cat_all_pl),
        "cat_pl_count": len(set_cat_pl),
        "cat_p1l_count": len(set_cat_p1l),
        "cat_p2l_count": len(set_cat_p2l),
        "lolos_total": len(df_lolos) if not df_lolos.empty else 0,
        "lolos_l_count": len(set_lolos_passed),
        "cat_all_pl_tidak_lolos": len(set_cat_all_pl - set_lolos_passed),
        "cat_pl_tidak_lolos": len(set_cat_pl - set_lolos_passed),
        "cat_p1l_tidak_lolos": len(set_cat_p1l - set_lolos_passed),
        "cat_p2l_tidak_lolos": len(set_cat_p2l - set_lolos_passed),
        "mundur_layer1": len(set_lolos_passed - set_layer1_l),
        "mundur_layer2": len(set_layer1_l - set_layer2_l),
        "mundur_layer3": len(set_layer2_l - set_layer3_l)
    }

    satdik_counts = {}
    def process_satdik(df):
        if df.empty: return
        passed = df[df['Keterangan'].isin(['L', 'L-1', 'L-2', 'MS'])]
        for val in passed['Nilai / Info']:
            if pd.notna(val) and " | " in str(val):
                satdik = str(val).split(" | ")[1].strip()
                if satdik and satdik != "-": satdik_counts[satdik] = satdik_counts.get(satdik, 0) + 1

    process_satdik(df_layer2)
    process_satdik(df_layer3)
    stats["satdik_counts"] = dict(sorted(satdik_counts.items(), key=lambda x: x[1], reverse=True))

    if df_cat.empty:
        print("[X] Data CAT kosong. Aborting.")
        return

    df_merged = df_cat[['Nama', 'Nilai / Info', 'Keterangan']].rename(columns={'Nilai / Info': 'cat_nilai', 'Keterangan': 'cat_keterangan'})
    if not df_lolos.empty: df_merged = df_merged.join(df_lolos[['Keterangan', 'Nilai / Info']].rename(columns={'Keterangan': 'lolos_keterangan', 'Nilai / Info': 'lolos_nilai'}), how='left')
    if not df_layer1.empty: df_merged = df_merged.join(df_layer1[['Keterangan', 'Nilai / Info']].rename(columns={'Keterangan': 'layer1_keterangan', 'Nilai / Info': 'layer1_nilai'}), how='left')
    if not df_layer2.empty: df_merged = df_merged.join(df_layer2[['Keterangan', 'Nilai / Info']].rename(columns={'Keterangan': 'layer2_keterangan', 'Nilai / Info': 'layer2_nilai'}), how='left')
    if not df_layer3.empty: df_merged = df_merged.join(df_layer3[['Keterangan', 'Nilai / Info']].rename(columns={'Keterangan': 'layer3_keterangan', 'Nilai / Info': 'layer3_nilai'}), how='left')
    
    df_merged = df_merged.reset_index()
    print(f"[*] Total baris data: {len(df_merged)}")

    if os.path.exists(DB_PATH): os.remove(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE statistics (id INTEGER PRIMARY KEY, data TEXT)")
    cursor.execute("INSERT INTO statistics (data) VALUES (?)", (json.dumps(stats),))
    df_merged.to_sql('participants', conn, if_exists='replace', index=False)
    cursor.execute("CREATE INDEX idx_nama ON participants(Nama COLLATE NOCASE);")
    cursor.execute("CREATE INDEX idx_nomor ON participants([Nomor Peserta]);")
    conn.commit()
    conn.close()
    print(f"[v] Database berhasil dibuat di {DB_PATH}")

if __name__ == "__main__":
    clear_screen()
    print("==========================================")
    print("      PANSELNAS ALL-IN-ONE TOOLKIT        ")
    print("==========================================")
    print("1. Ekstrak Semua PDF ke CSV")
    print("2. Bangun Ulang Database (SQLite)")
    print("3. Ekstrak Semua + Bangun Database")
    print("0. Keluar")
    
    try:
        pilihan = input("\nMasukkan pilihan (1/2/3/0): ")
        if pilihan == '1' or pilihan == '3':
            konversi_pdf_ke_csv_cepat("pengumuman CAT KDKMP dan KNMP.pdf", "pengumuman CAT KDKMP dan KNMP.csv")
            ekstrak_knmp("pengumuman CAT KNMP.pdf", "pengumuman CAT KNMP.csv")
            konversi_pdf_ke_csv_cepat("pengumuman lolos KDKMP dan KNMP.pdf", "pengumuman lolos KDKMP dan KNMP.csv")
            konversi_pdf_ke_csv_cepat("pengumuman phtc skt 2026 layer 1.pdf", "pengumuman phtc skt 2026 layer 1.csv")
            ekstrak_layer23("pengumuman phtc skt 2026 layer 2.pdf", "pengumuman phtc skt 2026 layer 2 (fixed).csv")
            ekstrak_layer23("pengumuman phtc skt 2026 layer 3.pdf", "pengumuman phtc skt 2026 layer 3 (fixed).csv")
            
        if pilihan == '2' or pilihan == '3':
            build_sqlite_db()
            
        print("\n[v] Seluruh proses selesai!")
    except KeyboardInterrupt:
        print("\n[!] Dibatalkan.")
