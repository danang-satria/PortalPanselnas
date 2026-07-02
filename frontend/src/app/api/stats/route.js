import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'database.db');
    const db = new Database(dbPath, { readonly: true });
    
    // Fetch stats
    const row = db.prepare('SELECT data FROM statistics LIMIT 1').get();
    db.close();

    if (row && row.data) {
      return NextResponse.json(JSON.parse(row.data));
    }
    
    return NextResponse.json({ error: "Stats not found" }, { status: 404 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
