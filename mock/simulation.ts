import { on, shared } from 'mokapi'

export interface Simulation {
    payment: Record<string, PaymentSimulation>
}

export interface PaymentSimulation {
    delayMs: number
}

export const simulations = shared.update<Simulation>('simulations', current => current || { payment: {} })

export default function() {
    on('http', (req, res) => {
        if (req.api !== 'Simulation API') {
            return
        }

        switch (req.key) {
            case '/simulate/payment-delay':
                const { orderId, delayMs } = req.body
                simulations.payment[orderId] = { delayMs }
                break
        }
    })
}