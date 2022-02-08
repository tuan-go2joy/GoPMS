import { fireEvent, render, RenderResult } from '@testing-library/vue';
import { datatype, internet, lorem } from '@withshepherd/faker';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Quasar } from 'quasar';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { VueQueryPlugin } from 'vue-query';
import { ISigninMutationVariables } from '~/modules/auth/apis/useSigninMutation';
import { DEV_API_URL } from '~/constants';
import { i18n } from '~/plugins/i18n';
import { quasarOptions } from '~/plugins/quasar';
import { router } from '~/plugins/router';
import SignInForm from '../sign-in-form.vue';

const EMAIL = internet.email();
const PASSWORD = {
  valid: 'valid_password',
  invalid: 'invalid_password',
  '500_error': 'make_500_error',
};

const server = setupServer(
  rest.post<ISigninMutationVariables>(
    `${DEV_API_URL}/authentication/token/`,
    ({ body }, res, ctx) => {
      if (body.password === PASSWORD['500_error']) return res(ctx.status(500));

      const isCorrect = body.email === EMAIL && body.password === PASSWORD.valid;
      if (!isCorrect) return res(ctx.status(401));
      return res(ctx.status(200));
    },
  ),
);

describe('SignInForm', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  expect(SignInForm).toBeTruthy();
  let wrapper: RenderResult;
  beforeEach(() => {
    wrapper = render(SignInForm, {
      global: { plugins: [[Quasar, quasarOptions], i18n, router, VueQueryPlugin] },
    });
  });

  it('should have a labels', async () => {
    expect(await wrapper.findByLabelText('Email')).to.exist;
    expect(await wrapper.findByLabelText('Password')).to.exist;
  });

  it('should have a submit button', async () => {
    const submitButton = await wrapper.getByRole('button');
    expect(submitButton).to.exist;
    expect(submitButton.textContent).to.equal('Sign in');
    expect(submitButton.getAttribute('type')).to.equal('submit');
  });

  it('should validate email', async () => {
    const emailInput = await wrapper.findByLabelText('Email');

    await fireEvent.update(emailInput, lorem.word());
    expect(await wrapper.findByRole('alert')).to.exist;

    await fireEvent.update(emailInput, datatype.string(65));
    expect(await wrapper.getByRole('alert')).to.exist;
  });

  it('should validate password', async () => {
    const passwordInput = await wrapper.findByLabelText('Password');

    await fireEvent.update(passwordInput, datatype.string(5));
    expect(await wrapper.findByRole('alert')).to.exist;
  });

  it('should notify auth failures', async () => {
    const emailInput = await wrapper.findByLabelText('Email');
    const passwordInput = await wrapper.findByLabelText('Password');
    const submitButton = await wrapper.getByTestId('sign-in-btn');

    await fireEvent.update(emailInput, EMAIL);
    await fireEvent.update(passwordInput, PASSWORD.invalid);
    await fireEvent.click(submitButton);

    await wrapper.findByText('Wrong Credentials');
  });

  it('should notify unhandled failures', async () => {
    const emailInput = await wrapper.findByLabelText('Email');
    const passwordInput = await wrapper.findByLabelText('Password');
    const submitButton = await wrapper.getByTestId('sign-in-btn');

    await fireEvent.update(emailInput, EMAIL);
    await fireEvent.update(passwordInput, PASSWORD['500_error']);
    await fireEvent.click(submitButton);

    await wrapper.findByText('Something went wrong...');
  });
});
