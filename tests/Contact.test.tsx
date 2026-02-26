import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe, expect, it } from 'vitest';

import Contact from '../pages/contact';

describe('Contact page form', () => {
  it('shows validation errors when required fields are empty', async () => {
    render(<Contact />);
    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
    });

    expect(await screen.findByText('Please enter at least 2 characters.')).toBeInTheDocument();
    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(await screen.findByText('WhatsApp number seems too short.')).toBeInTheDocument();
    expect(await screen.findByText('Phone number seems too short.')).toBeInTheDocument();
    expect(
      await screen.findByText('Message must be at least 10 characters long.')
    ).toBeInTheDocument();
  }, 10000);

  it(
    'submits successfully with valid data',
    async () => {
      render(<Contact />);
      const user = userEvent.setup();

      await act(async () => {
        await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
        await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
        await user.type(screen.getByLabelText(/whatsapp number/i), '+254712417489');
        await user.type(screen.getByLabelText(/alternative phone/i), '+254700000000');
        await user.type(screen.getByLabelText(/what can we prep/i), 'Looking for new arrivals.');

        await user.click(screen.getByRole('button', { name: /send message/i }));
      });

      expect(
        await screen.findByText(/your message has been sent/i, undefined, { timeout: 5000 })
      ).toBeInTheDocument();

      await waitFor(
        () => {
          expect(screen.getByLabelText(/name/i)).toHaveValue('');
          expect(screen.getByLabelText(/email/i)).toHaveValue('');
          expect(screen.getByLabelText(/whatsapp number/i)).toHaveValue('');
          expect(screen.getByLabelText(/alternative phone/i)).toHaveValue('');
          expect(screen.getByLabelText(/what can we prep/i)).toHaveValue('');
        },
        { timeout: 5000 }
      );
    },
    15000
  );
});


