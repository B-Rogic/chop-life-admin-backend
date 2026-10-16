const express = require('express')

const router = express.Router()

/**
 * POST /api/payments/verify
 * Body: { reference, items?, total?, email? }
 * Confirms the transaction with Paystack and (optionally) saves the order.
 */
router.post('/verify', async (req, res) => {
  const { reference, items, total, email } = req.body

  if (!reference) {
    return res.status(400).json({ verified: false, message: 'Missing reference' })
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )
    const data = await response.json()

    if (!data.status || data.data?.status !== 'success') {
      return res.status(400).json({
        verified: false,
        message: 'Payment not successful',
      })
    }

    // ── Optional: save the order in MongoDB here ──
    // import Order from '../models/Order.js'
    // await Order.create({
    //   reference,
    //   email,
    //   items,
    //   total: data.data.amount / 100,
    //   status: 'paid',
    //   channel: data.data.channel,
    //   paidAt: data.data.paid_at,
    // })

    return res.json({
      verified: true,
      reference,
      amount: data.data.amount / 100,
      email: data.data.customer.email,
      channel: data.data.channel,
    })
  } catch (err) {
    console.error('Paystack verify error:', err)
    return res.status(500).json({ verified: false, message: 'Verification failed' })
  }
})

module.exports = router