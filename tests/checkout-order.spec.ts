import { expect, request } from '@playwright/test';
import { test } from './fixture';

[
    { name: 'Checkout order', delay: 0 },
    { name: 'Checkout order with delay', delay: 5000 },
].forEach(({ name, delay }) => {

    test(name, async ({ page, request, simulationUrl }) => {
        await page.goto('');

        await test.step('Add product to cart', async () => {
            const article = page.getByRole('article', { name: 'Wireless Headphones' })
            await article.getByRole('button', { name: 'Add to cart' }).click();
        });

        await test.step('Verify order details on checkout page', async () => {
            const nav = page.getByRole('navigation');
            await nav.getByRole('button', { name: 'Cart' }).click();

            const shoppingCart = page.getByRole('region', { name: 'Shopping cart items' });
            const cartItems = shoppingCart.getByRole('listitem');
            await expect(cartItems).toHaveCount(1);
            await expect(cartItems.first()).toContainText('Wireless Headphones');
            await expect(cartItems.first()).toContainText('$79.99');
        });

        await test.step('Proceed to checkout', async () => {
            await page.getByRole('button', { name: 'Proceed to checkout' }).click();

            const orderId = await page.getByLabel('Order ID').textContent()

            await request.post(`${simulationUrl}/simulate/payment-delay`, {
                headers: { 'Content-Type': 'application/json' },
                data: { orderId, delayMs: delay },
            });
        })

        await test.step('Pay and verify order completion', async () => {
            await page.getByRole('button', { name: 'Pay' }).click();

            await page.getByRole('textbox', { name: 'Card number' }).fill('4242424242424242');
            await page.getByRole('textbox', { name: 'Expiry' }).fill('12/34');
            await page.getByRole('textbox', { name: 'CVC' }).fill('123');
            await page.getByRole('button', { name: 'Pay' }).click();

            if (delay > 0) {
                await expect(page.getByRole('heading', { name: 'Processing your payment' })).toBeVisible();
            }

            await expect(page.getByRole('heading', { name: 'Payment confirmed' })).toBeVisible({ timeout: 30000 });
        })
    });
});