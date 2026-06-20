
import { on, shared } from 'mokapi'

export interface PaymentSession {
    orderId: string;
    amount: number;
    currency: string;
    successUrl: string;
}

const sessions = shared.namespace('payment').update<Record<string, PaymentSession>>('sessions', (current) => current || {})

export default function() {
    on('http', (req, res) => {
        if (req.api !== 'Payment Provider API') {
            return
        }

        const { orderId, amount, currency, successUrl } = req.body

        // Generate a unique session ID
        const sessionId = 'mock-session-' + Math.random().toString(36).slice(2, 9)
        sessions[sessionId] = { orderId, amount, currency, successUrl }

        const paymentUrl = `http://localhost:5001/payment?sessionId=${sessionId}`

        res.data = {
            sessionId,
            paymentUrl
        }
    })
}