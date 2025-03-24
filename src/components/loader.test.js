import { render, screen } from '@testing-library/react';
import React from 'react';
import Loader from './loader';

describe('Loader Component', () => {
  it('should render the loader with default props', () => {
    render(
      React.createElement(Loader, null, 'Loading...')
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Loading...').parentElement.querySelector('.spinner')).toBeInTheDocument();
  });

  it('should pass additional props to the wrapper div', () => {
    render(
      React.createElement(Loader, { 'data-testid': 'loader' }, 'Loading...')
    );
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('wrapper');
  });

  it('should render the spinner inside the wrapper', () => {
    render(
      React.createElement(Loader, null, 'Loading...')
    );
    const spinner = screen.getByText('Loading...').parentElement.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner');
  });
});