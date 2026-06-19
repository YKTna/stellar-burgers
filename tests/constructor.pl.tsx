import { test, expect } from '@playwright/test';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/api.har', {
      url: '**/api/**',
      notFound: 'abort'
    });
  });

  test('добавляет ингредиенты в конструктор', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('constructor-bun-top')).toHaveCount(0);
    await expect(page.getByTestId('constructor-bun-bottom')).toHaveCount(0);
    await expect(page.getByTestId('constructor-ingredient-item')).toHaveCount(0);

    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Краторная булка N-200i' });

    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('constructor-ingredient-item')).toHaveCount(1);
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
  });

  test('открывает модальное окно ингредиента и показывает правильные данные', async ({
    page
  }) => {
    await page.goto('/');

    await expect(page.getByTestId('modal')).toHaveCount(0);

    const ingredientCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Краторная булка N-200i' });

    await ingredientCard.getByTestId('ingredient-link').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal.getByTestId('ingredient-details')).toBeVisible();
  });

  test('закрывает модальное окно ингредиента по клику на крестик', async ({
    page
  }) => {
    await page.goto('/');

    const ingredientCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Краторная булка N-200i' });

    await ingredientCard.getByTestId('ingredient-link').click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(page.getByTestId('modal')).toHaveCount(0);
  });

  test('закрывает модальное окно ингредиента по клику на оверлей', async ({
    page
  }) => {
    await page.goto('/');

    const ingredientCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Краторная булка N-200i' });

    await ingredientCard.getByTestId('ingredient-link').click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 }
    });

    await expect(page.getByTestId('modal')).toHaveCount(0);
  });

  test('создаёт заказ, показывает номер и очищает конструктор', async ({
    page,
    context
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');

    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Краторная булка N-200i' });

    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('constructor-ingredient-item')).toHaveCount(1);

    await expect(page.getByTestId('modal')).toHaveCount(0);
    await expect(page.getByTestId('modal-title')).toHaveCount(0);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    const modalTitle = modal.getByTestId('modal-title');
    await expect(modalTitle).toBeVisible();

    await expect(page.getByTestId('constructor-bun-top')).toHaveCount(0);
    await expect(page.getByTestId('constructor-bun-bottom')).toHaveCount(0);
    await expect(page.getByTestId('constructor-ingredient-item')).toHaveCount(0);

    await page.getByTestId('modal-close').click();

    await expect(page.getByTestId('modal')).toHaveCount(0);
  });
});