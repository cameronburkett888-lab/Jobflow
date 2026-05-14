import Stripe from 'stripe';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    const { stripeCustomerId } = userDoc.data();
    if (!stripeCustomerId) return res.status(400).json({ error: 'No Stripe customer found' });

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    // Also check trialing
    const trialing = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'trialing',
      limit: 1,
    });

    const sub = subscriptions.data[0] || trialing.data[0];
    if (!sub) return res.status(404).json({ error: 'No active subscription found' });

    // Cancel at period end so they keep access until billing cycle ends
    await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Cancel error:', err);
    return res.status(500).json({ error: err.message });
  }
}