import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import ButtonHandler from './btn-handler';
import { sendEmail } from '../utils/emailService';
import { Webcam } from '../utils/webcam';

// Mock external services
vi.mock('../utils/emailService', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('../utils/webcam', () => ({
  Webcam: vi.fn().mockImplementation(() => ({
    open: vi.fn().mockImplementation(() => {
      cameraRef.current.srcObject = {};
    }),
    close: vi.fn(),
  })),
}));

// Mock window.alert
global.alert = vi.fn();

describe('ButtonHandler Component', () => {
  let cameraRef, videoRef, toggleSession;

  beforeEach(() => {
    cameraRef = { current: { srcObject: null, style: { display: 'none' } } };
    videoRef = { current: null };
    toggleSession = vi.fn();
  });

  it('should render the start session button', () => {
    render(
      React.createElement(ButtonHandler, {
        cameraRef: cameraRef,
        videoRef: videoRef,
        toggleSession: toggleSession,
        sessionActive: false,
        summary: null,
      })
    );
    const button = screen.getByText('Start the session');
    expect(button).toBeInTheDocument();
  });

  it('should open the modal when the start session button is clicked', () => {
    render(
      React.createElement(ButtonHandler, {
        cameraRef: cameraRef,
        videoRef: videoRef,
        toggleSession: toggleSession,
        sessionActive: false,
        summary: null,
      })
    );
    const startButton = screen.getByText('Start the session');
    fireEvent.click(startButton);
    expect(screen.getByText('Session Information')).toBeInTheDocument();
  });



  it('should show error if candidate email is invalid', async () => {
    render(
      React.createElement(ButtonHandler, {
        cameraRef: cameraRef,
        videoRef: videoRef,
        toggleSession: toggleSession,
        sessionActive: false,
        summary: null,
      })
    );

    fireEvent.click(screen.getByText('Start the session'));

    fireEvent.change(screen.getByPlaceholderText("Candidate's email"), {
      target: { value: 'invalidemail' },
    });
    fireEvent.change(screen.getByPlaceholderText("Sponsor's email"), {
      target: { value: 'sponsor@example.com' },
    });
    fireEvent.click(screen.getByLabelText(/I accept the Terms of Use/i));

    fireEvent.click(screen.getAllByText('Start the session')[1]);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid candidate email.')).toBeInTheDocument();
    });
  });

  it('should show error if terms are not accepted', async () => {
    render(
      React.createElement(ButtonHandler, {
        cameraRef: cameraRef,
        videoRef: videoRef,
        toggleSession: toggleSession,
        sessionActive: false,
        summary: null,
      })
    );

    fireEvent.click(screen.getByText('Start the session'));

    fireEvent.change(screen.getByPlaceholderText("Candidate's email"), {
      target: { value: 'candidate@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText("Sponsor's email"), {
      target: { value: 'sponsor@example.com' },
    });

    fireEvent.click(screen.getAllByText('Start the session')[1]);

    await waitFor(() => {
      expect(screen.getByText('You must accept the Terms of Use to continue.')).toBeInTheDocument();
    });
  });
});