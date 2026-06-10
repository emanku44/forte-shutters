import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('labour_rates')
    .select('*')
    .order('town')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const { id, updates } = await request.json()
  if (id) {
    // Update existing
    const { error } = await supabase
      .from('labour_rates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    // Insert new town
    const { error } = await supabase.from('labour_rates').insert([updates])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(request) {
  const { id } = await request.json()
  const { error } = await supabase.from('labour_rates').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
