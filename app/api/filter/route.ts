import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { filterMessage } from '@/lib/ai/filter'

const MAX_TEXT_LENGTH = 500
const RATE_LIMIT_WINDOW = 60
const RATE_LIMIT_MAX = 30
const FREE_LIMIT = 100

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW * 1000 })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'リクエストが多すぎます。少し待ってから再試行してください。' }, { status: 429 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let text = ''
  try {
    const body = await req.json()
    text = body?.text ?? ''
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: `メッセージは${MAX_TEXT_LENGTH}文字以内にしてください。` }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, filter_count, filter_count_reset_at')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  // Reset monthly count if new month
  const now = new Date()
  const resetAt = new Date(profile.filter_count_reset_at)
  let currentCount = profile.filter_count
  if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
    currentCount = 0
    await supabase.from('profiles')
      .update({ filter_count: 0, filter_count_reset_at: now.toISOString() })
      .eq('id', user.id)
  }

  if (profile.plan === 'free' && currentCount >= FREE_LIMIT) {
    return NextResponse.json({ error: 'limit_reached', remaining: 0 }, { status: 402 })
  }

  try {
    const filtered = await filterMessage(text)

    if (profile.plan === 'free') {
      await supabase.from('profiles')
        .update({ filter_count: currentCount + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({
      filtered,
      remaining: profile.plan === 'pro' ? null : FREE_LIMIT - currentCount - 1,
    })
  } catch (err) {
    console.error('[/api/filter]', err)
    return NextResponse.json({ filtered: text })
  }
}
