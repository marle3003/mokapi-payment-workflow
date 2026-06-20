import express from 'express'
import cors from 'cors'
import { Kafka } from 'kafkajs';

const PORT = process.env.PORT || 3000
const PAYMENT_BASE_URL = process.env.PAYMENT_BASE_URL || 'http://localhost:5000'
const KAFKA_HOST = process.env.KAFKA_HOST || 'localhost:9092'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/checkout', async (req, res) => {
  const { orderId, amount, currency, successUrl } = req.body
  const paymentResponse = await fetch(`${PAYMENT_BASE_URL}/checkout/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount, currency, successUrl }),
  })

  if (!paymentResponse.ok) {
    return res.status(500).json({ error: 'Failed to create payment session', details: await paymentResponse.text() })
  }

  const { paymentUrl } = await paymentResponse.json()
  console.log(`Created payment session for order ${orderId}, redirecting to ${paymentUrl}`)
  res.json({ paymentUrl })
})


app.get('/api/orders/*orderId', async (req, res) => {
  const orderId = req.params.orderId[0];
  console.log(`Checking payment status for order ${orderId}`);
  const paymentStatus = orderPaymentStates[orderId] || 'processing';
  res.json({ orderId, paymentStatus });
})


app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})

const kafka = new Kafka({
  clientId: 'backend',
  brokers: [ KAFKA_HOST ]
});

const consumer = kafka.consumer({ groupId: 'backend-group' });
const orderPaymentStates: Record<string, string> = {};

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-payment-state', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      const value = JSON.parse(message.value.toString());
      console.log('Received payment state:', value);

      orderPaymentStates[value.orderId] = value.paymentStatus;
    }
  });
}

start().catch(console.error);