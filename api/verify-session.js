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

  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return res.status(400).json({ error: 'Session not completed' });
    }

    const userId = session.metadata?.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in session metadata' });
    }

    await db.collection('users').doc(userId).set(
      {
        isPro: true,
        stripeCustomerId: session.customer,
        stripeSessionId: sessionId,
        proSince: new Date().toISOString(),
      },
      { merge: true }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Verify session error:', err);
    return res.status(500).json({ error: err.message });
  }
}