import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { name, phone, email, message } = await request.json()

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, phone, email, message }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data[0].id }, { status: 201 })

  } catch (err) {
    console.error('Contact submission error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
