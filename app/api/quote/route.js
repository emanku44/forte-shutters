import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { customer_name, customer_phone } = body
    if (!customer_name || !customer_phone) {
      return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 })
    }
    const { data, error } = await supabase.from('quotes').insert([body]).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, id: data[0].id }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
