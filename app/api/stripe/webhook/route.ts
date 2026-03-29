import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const supabaseAdmin = getSupabaseAdmin()
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const getUid = async (customerId: string): Promise<string | null> => {
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
    return customer.metadata?.supabase_uid ?? null
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const uid = await getUid(sub.customer as string)
      if (uid) {
        await supabaseAdmin.from('profiles').update({
          plan: sub.status === 'active' ? 'pro' : 'free',
          stripe_subscription_id: sub.id,
        }).eq('id', uid)
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const uid = await getUid(sub.customer as string)
      if (uid) {
        await supabaseAdmin.from('profiles').update({
          plan: 'free',
          stripe_subscription_id: null,
        }).eq('id', uid)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
