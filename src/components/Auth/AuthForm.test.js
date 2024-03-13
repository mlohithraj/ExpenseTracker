import { render, screen } from '@testing-library/react';
import AuthForm from './AuthForm';

describe('component', () => {
test('rendering', () => {
  render(<AuthForm />);

  const passwordConfirmation = screen.getByText('Login');
  expect(passwordConfirmation).toBeInTheDocument();
});
})


