import { test as base } from '@playwright/test';

export interface SimulationFixture {
    simulationUrl: string;
}

export const test = base.extend<SimulationFixture>({
    simulationUrl: async ({ }, use) => {
        const simulationUrl = process.env.SIMULATION_URL || 'http://localhost:5002';
        await use(simulationUrl);
    }
});