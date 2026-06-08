import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()

    const {
      product_type, property_type, location,
      openings, material, colour, special_notes,
      motor, remote_count, access_control, power_supply,
      addons, warranty,
      customer_name, customer_phone, customer_email,
      contact_pref, final_notes,
      estimated_low, estimated_high
    } = body

    if (!customer_name || !customer_phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('quotes')
      .insert([{
        product_type, property_type, location,
        openings, material, colour, special_notes,
        motor, remote_count, access_control, power_supply,
        addons, warranty,
        customer_name, customer_phone, customer_email,
        contact_pref, final_notes,
        estimated_low, estimated_high
      }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data[0].id }, { status: 201 })

  } catch (err) {
    console.error('Quote submission error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
