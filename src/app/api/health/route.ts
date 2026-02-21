import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'OK', 
    message: 'Masjid Keuangan API is running',
    timestamp: new Date().toISOString()
  });
}