import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const [{ data: pricing }, { data: motors }, { data: addons }] = await Promise.all([
    supabase.from('pricing').select('*').order('product_type'),
    supabase.from('motor_pricing').select('*').order('price'),
    supabase.from('addon_pricing').select('*').order('addon_name'),
  ])
  return NextResponse.json({ pricing, motors, addons })
}

export async function POST(request) {
  const { table, id, updates } = await request.json()
  const allowed = ['pricing', 'motor_pricing', 'addon_pricing']
  if (!allowed.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }
  const { error } = await supabase
    .from(table)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
