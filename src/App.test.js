import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import App from './App';

// Mock the DetectUtils module
vi.mock('./utils/detect', () => ({
  default: {
    detect: vi.fn(),
    detectVideo: vi.fn(),
    startLogging: vi.fn(),
    getDetectionLogs: vi.fn().mockReturnValue([]),
  },
}));

// Mock the getContext method for HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = vi.fn();

// Mock TensorFlow's methods including ready, loadGraphModel, and ones
vi.mock('@tensorflow/tfjs', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ready: vi.fn().mockResolvedValue(),
    loadGraphModel: vi.fn().mockResolvedValue({
      inputs: [{ shape: [1, 640, 640, 3] }],
      execute: vi.fn().mockReturnValue([]),
    }),
    ones: vi.fn().mockReturnValue({
      shape: [1, 640, 640, 3],
    }),
  };
});

describe('App component', () => {
  it('should render the app and load the model', async () => {
    render(React.createElement(App));

    expect(screen.getByText('AI-powered Proctor')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the Automated Online Test Monitoring System')).toBeInTheDocument();
    expect(screen.getByText(/Loading... Please wait/)).toBeInTheDocument();

    // Wait for the model to be loaded
    await waitFor(() => expect(screen.queryByText('Loading... Please wait')).not.toBeInTheDocument());
  });

  it('should start and stop session correctly', async () => {
    render(React.createElement(App));

    const button = screen.getByRole('button');

    // Initially, the session button should show 'Start the session'
    expect(button).toHaveTextContent('Start the session');

    // Simulate starting the session (button click)
    fireEvent.click(button);


    // Simulate closing the session (button click)
    fireEvent.click(button);

    // Wait for the button text to change back to 'Start the session'
    await waitFor(() => {
      expect(button).toHaveTextContent('Start the session');
    });
  });
});
