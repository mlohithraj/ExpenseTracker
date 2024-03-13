import { render, screen } from '@testing-library/react';
import StartingPageContent from './StartingPageContent';

describe('StartingPageContent component', () => {
  test('renders welcome message', () => {
    render(<StartingPageContent />);

    const welcomeMessage = screen.getByText('Welcome To Expense Tracker !!!');
    expect(welcomeMessage).toBeInTheDocument();
  });
});
