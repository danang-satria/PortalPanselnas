import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

function getHistoryItem(tahap, nama, keterangan, nilai) {
  if (keterangan && keterangan !== 'None' && keterangan !== null) {
    return {
      tahap,
      nama: nama || "TIDAK DIKETAHUI",
      keterangan: keterangan || "TIDAK DIKETAHUI",
      nilai: (nilai !== 'nan' && nilai !== 'None' && nilai !== null) ? String(nilai) : "",
      ditemukan: true
    };
  }
  return {
    tahap,
    ditemukan: false
  };
}

export async function GET(request, context) {
  try {
    const params = await context.params;
    const query = decodeURIComponent(params.query).trim().toUpperCase();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    const dbPath = path.join(process.cwd(), 'database.db');
    const db = new Database(dbPath, { readonly: true });
    
    // Check if query is exact number match first, otherwise do LIKE on name
    const countStmt = db.prepare(`SELECT COUNT(*) as total FROM participants WHERE [Nomor Peserta] = ? OR Nama LIKE ?`);
    const likeQuery = `%${query}%`;
    const countRow = countStmt.get(query, likeQuery);
    
    console.log("API Search Debug: query=", query, "likeQuery=", likeQuery, "total=", countRow.total);

    const total_items = countRow.total;
    
    if (total_items === 0) {
      db.close();
      return NextResponse.json({ error: "Data tidak ditemukan. Coba gunakan Nama atau Nomor Peserta yang valid." }, { status: 404 });
    }

    const total_pages = Math.ceil(total_items / limit);
    const offset = (page - 1) * limit;

    const rowsStmt = db.prepare(`
      SELECT * FROM participants 
      WHERE [Nomor Peserta] = ? OR Nama LIKE ?
      ORDER BY [Nomor Peserta] ASC
      LIMIT ? OFFSET ?
    `);
    
    const rows = rowsStmt.all(query, likeQuery, limit, offset);
    db.close();

    const results = rows.map(row => {
      const history = [];
      const nama = row.Nama;
      
      history.push(getHistoryItem("CAT (Seleksi Awal)", nama, row.cat_keterangan, row.cat_nilai));
      history.push(getHistoryItem("Pengumuman Lolos Utama", nama, row.lolos_keterangan, row.lolos_nilai));
      history.push(getHistoryItem("Layer 1 (Tambahan/Pergantian)", nama, row.layer1_keterangan, row.layer1_nilai));
      history.push(getHistoryItem("Layer 2 (Tambahan/Pergantian)", nama, row.layer2_keterangan, row.layer2_nilai));
      history.push(getHistoryItem("Layer 3 (Tambahan/Pergantian)", nama, row.layer3_keterangan, row.layer3_nilai));
      
      let nama_orang = "TIDAK DIKETAHUI";
      for (const h of history) {
        if (h.ditemukan) {
          nama_orang = h.nama;
          break;
        }
      }

      let status_akhir = history[0].keterangan;
      for (let i = 1; i < history.length; i++) {
        if (history[i].ditemukan) {
          status_akhir = history[i].keterangan;
        }
      }

      return {
        nomor_peserta: row['Nomor Peserta'],
        nama: nama_orang,
        status_akhir,
        history
      };
    });

    return NextResponse.json({
      results,
      pagination: {
        current_page: page,
        total_pages,
        total_items,
        limit
      }
    });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
