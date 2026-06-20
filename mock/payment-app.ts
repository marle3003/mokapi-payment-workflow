import { on, shared } from 'mokapi'
import { render } from 'mokapi/mustache'
import { produce } from 'mokapi/kafka'
import { PaymentSession } from './payment-api'
import { simulations } from './simulation'

const paymentPageTemplate = open('./assets/payment.html')
const sessions = shared.namespace('payment').update<Record<string, PaymentSession>>('sessions', (current) => current || {})

export default function() {
    on('http', (req, res) => {
        if (req.api !== 'Payment App') {
            return
        }

        if (req.method === 'GET') {
            const sessionId = req.query.sessionId;
            const session = sessions[sessionId]

            if (!session) {
                res.statusCode = 400
                res.data = 'Session not found'
                return
            }

            const html = render(paymentPageTemplate, { sessionId, ...session, error: undefined })
            res.data = html
        } else if (req.method === 'POST') {
            let { sessionId, delay } = req.body
            const session = sessions[sessionId]

            if (!session) {
                res.statusCode = 200
                const html = render(paymentPageTemplate, { sessionId, error: 'Session not found' })
                res.data = html
                return
            }

            const kafkaProduceRequest = {
                topic: 'order-payment-state',
                messages: [
                    {
                        key: session.orderId,
                        data: {
                            orderId: session.orderId,
                            paymentStatus: 'success'
                        }
                    }
                ]
            }

            if (!delay && simulations.payment[session.orderId]) {
                delay = simulations.payment[session.orderId].delayMs
            }

            if (delay > 0) {
                delete simulations.payment[session.orderId]

                setTimeout(() => {
                    produce(kafkaProduceRequest)
                }, delay)
            } else {
                try {
                    produce(kafkaProduceRequest)
                } catch (err) {
                    const html = render(paymentPageTemplate, { sessionId, error: `${err}` })
                    res.data = html
                    return
                }
            }

            

            res.statusCode = 302
            res.headers = { Location: session.successUrl }
        }
    })
}