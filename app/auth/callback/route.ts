import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Handles the redirect from Supabase auth emails (password recovery, etc.).
// Exchanges the one-time code for a session cookie, then forwards the user
// to `next` (defaults to the lobby).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/lobby'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // `x-forwarded-host` is the user-facing host behind Vercel's proxy.
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // No code or exchange failed → send back to login with an error flag.
  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
