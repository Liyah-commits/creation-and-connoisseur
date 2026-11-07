/**
 * The Contact, Volunteer and Get Help forms, in both languages: labels, required text,
 * inline errors tied with aria-describedby, focus on the first error, the live
 * region, and axe in the error and success states.
 *
 * The production build has no Formspree ID, so it tests the "not connected"
 * path. The template build uses the placeholder ID "template-test", and these
 * tests intercept the request in the browser, so nothing is ever sent.
 */
import { expect, test, type Page } from '@playwright/test';
import { routes } from '../src/i18n/routes';
import { ui } from '../src/i18n/ui';
import { expectNoAxeViolations, VIEWPORTS } from './helpers';

const forms = [
  { kind: 'contact', lang: 'en', path: routes.contact.en },
  { kind: 'contact', lang: 'es', path: routes.contact.es },
  { kind: 'volunteer', lang: 'en', path: routes.volunteer.en },
  { kind: 'volunteer', lang: 'es', path: routes.volunteer.es },
  { kind: 'help', lang: 'en', path: routes.getHelp.en },
  { kind: 'help', lang: 'es', path: routes.getHelp.es },
] as const;

const subjectKey = { contact: 'form.subjectContact', volunteer: 'form.subjectVolunteer', help: 'form.subjectHelp' } as const;
const successKey = { contact: 'form.successContact', volunteer: 'form.successVolunteer', help: 'form.successHelp' } as const;

const validValues: Record<string, string> = {
  name: 'Test Person',
  email: 'test.person@example.org',
  phone: '(000) 000-0000',
  message: 'This is a test message.',
  interests: 'Packing bags and greeting people.',
  availability: 'Weekday afternoons.',
};

async function fillValid(page: Page) {
  for (const input of await page.locator('form[data-form] .field-input').all()) {
    const name = (await input.getAttribute('name'))!;
    await input.fill(validValues[name] ?? 'Test');
  }
}

for (const { kind, lang, path } of forms) {
  test.describe(`${kind} form (${lang})`, () => {
    test('structure: labels, required text, autocomplete, live region, honeypot', async ({ page }) => {
      await page.goto(path);
      const form = page.locator('form[data-form]');
      await expect(form).toHaveCount(1);

      for (const input of await form.locator('.field-input').all()) {
        const id = await input.getAttribute('id');
        const label = form.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
        const required = await input.evaluate((el: HTMLInputElement) => el.required);
        await expect(label).toContainText(required ? ui['form.required'][lang] : ui['form.optional'][lang]);
      }
      await expect(form.locator('input[name="name"]')).toHaveAttribute('autocomplete', 'name');
      await expect(form.locator('input[name="email"]')).toHaveAttribute('autocomplete', 'email');
      await expect(form.locator('input[name="email"]')).toHaveAttribute('type', 'email');
      if (kind !== 'contact') await expect(form.locator('input[name="phone"]')).toHaveAttribute('autocomplete', 'tel');

      // The live region is in the page, empty, before anything happens.
      const status = form.locator('[role="status"]');
      await expect(status).toHaveCount(1);
      await expect(status).toHaveText('');

      // The honeypot is not visible and not reachable by keyboard.
      await expect(form.locator('input[name="_gotcha"]')).toBeHidden();
      await expect(form.locator('input[name="_subject"]')).toHaveValue(ui[subjectKey[kind]][lang]);

      // JavaScript has taken over validation.
      expect(await form.evaluate((el: HTMLFormElement) => el.noValidate)).toBe(true);
    });

    test('empty submit: inline errors, aria-invalid, aria-describedby, focus on first error', async ({ page }, testInfo) => {
      await page.goto(path);
      const form = page.locator('form[data-form]');
      await form.locator('[data-submit]').click();

      const required = form.locator('.field-input[required]');
      const count = await required.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const input = required.nth(i);
        await expect(input).toHaveAttribute('aria-invalid', 'true');
        const id = await input.getAttribute('id');
        const error = page.locator(`#${id}-error`);
        await expect(error).toBeVisible();
        await expect(error).toHaveText(new RegExp(`^${ui['form.errorPrefix'][lang]} \\S`));
        await expect(input).toHaveAttribute('aria-describedby', new RegExp(`(^| )${id}-error( |$)`));
      }
      // Optional fields are not marked invalid.
      for (const input of await form.locator('.field-input:not([required])').all()) await expect(input).not.toHaveAttribute('aria-invalid', 'true');

      await expect(required.first()).toBeFocused();
      await expect(form.locator('[role="status"]')).toHaveText('');

      for (const [name, viewport] of Object.entries(VIEWPORTS)) {
        await page.setViewportSize(viewport);
        await expectNoAxeViolations(page, testInfo, `${kind} ${lang} errors ${name}`);
      }
    });

    test('invalid email gets its own message, and errors clear when fixed', async ({ page }) => {
      await page.goto(path);
      const form = page.locator('form[data-form]');
      await fillValid(page);
      const email = form.locator('input[name="email"]');
      await email.fill('not-an-email');
      await form.locator('[data-submit]').click();
      await expect(email).toBeFocused();
      await expect(page.locator(`#${await email.getAttribute('id')}-error`)).toContainText(ui['form.errorEmailInvalid'][lang]);

      await email.fill('fixed@example.org');
      await expect(email).not.toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator(`#${await email.getAttribute('id')}-error`)).toBeHidden();
    });

    test('valid submit is announced in the live region', async ({ page }, testInfo) => {
      await page.goto(path);
      const form = page.locator('form[data-form]');
      const connected = (await form.getAttribute('data-connected')) === 'true';
      const status = form.locator('[role="status"]');

      if (connected) {
        let body = '';
        await page.route('https://formspree.io/**', async (route) => {
          body = route.request().postData() ?? '';
          await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
        });
        await fillValid(page);
        await form.locator('[data-submit]').click();
        await expect(status).toHaveText(ui[successKey[kind]][lang]);
        expect(body).toContain('_subject');
        // The form is cleared after a successful send.
        await expect(form.locator('input[name="name"]')).toHaveValue('');
      } else {
        await expect(page.locator(`#${kind}-notice`)).toContainText(ui['form.notConnected'][lang]);
        let requested = false;
        page.on('request', (request) => {
          if (request.method() === 'POST') requested = true;
        });
        await fillValid(page);
        await form.locator('[data-submit]').click();
        await expect(status).toHaveText(ui['form.notConnectedSubmit'][lang]);
        expect(requested, 'nothing is sent when the form is not connected').toBe(false);
      }

      for (const [name, viewport] of Object.entries(VIEWPORTS)) {
        await page.setViewportSize(viewport);
        await expectNoAxeViolations(page, testInfo, `${kind} ${lang} submitted ${name}`);
      }
    });

    test('a failed send is announced, and the form keeps what was typed', async ({ page }) => {
      await page.goto(path);
      const form = page.locator('form[data-form]');
      test.skip((await form.getAttribute('data-connected')) !== 'true', 'Only applies when a Formspree ID is set (template build).');
      await page.route('https://formspree.io/**', (route) => route.fulfill({ status: 500, body: 'error' }));
      await fillValid(page);
      await form.locator('[data-submit]').click();
      await expect(form.locator('[role="status"]')).toHaveText(ui['form.failure'][lang]);
      await expect(form.locator('input[name="name"]')).toHaveValue(validValues.name!);
    });

    test('works without JavaScript: native validation and a real form post', async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      const form = page.locator('form[data-form]');
      expect(await form.evaluate((el: HTMLFormElement) => el.noValidate)).toBe(false);
      await expect(form).toHaveAttribute('method', 'post');
      const connected = (await form.getAttribute('data-connected')) === 'true';
      await expect(form).toHaveAttribute('action', connected ? /^https:\/\/formspree\.io\/f\// : path);
      await context.close();
    });
  });
}
