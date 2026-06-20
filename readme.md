# mokapi-payment-workflow

A working example of how to mock a complete payment flow using Mokapi and Playwright.

Instead of stubbing API responses, Mokapi serves a real HTML payment page and produces 
a Kafka message when the user submits the form. Playwright navigates the full checkout 
flow just like a real user would, including the redirect to the payment page and the 
async order status update.

![Video about the payment workflow](mokapi-payment-workflow.gif "Payment Workflow")

## What's in here

- A simple online shop with a frontend and backend
- A Mokapi config that serves the payment page and mocks the Kafka topic
- A simulation API to seed test data and configure payment delays
- Playwright tests that walk through the full checkout flow

## How it works

1. Playwright seeds a shopping cart via the simulation API
2. Playwright navigates to the checkout page and clicks pay
3. The shop redirects to the Mokapi payment page
4. Playwright fills in the card details and submits
5. Mokapi produces a Kafka message with the order ID and payment status
6. The backend consumes the message and updates the order
7. Playwright waits for the order status to show "paid"

## Getting started

```bash
git clone https://github.com/marle3003/mokapi-payment-workflow
cd mokapi-payment-workflow
docker compose up
```

Then run the Playwright tests:

```bash
BASE_URL=http://localhost:3000 npx playwright test
```

## Read more

Full writeup on how this works and why:
[Your Playwright Tests Deserve a Real Payment Flow]()