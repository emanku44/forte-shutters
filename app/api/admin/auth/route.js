import { NextResponse } from 'next/server'

export async function POST(request) {
  const { password } = await request.json()
  const correct = process.env.ADMIN_PASSWORD

  if (!correct) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD not set in environment variables' }, { status: 500 })
  }

  if (password !== correct) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
