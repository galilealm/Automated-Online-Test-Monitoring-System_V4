import { sendEmail } from './emailService';
import emailjs from 'emailjs-com';
import { vi } from 'vitest';

// Mock emailjs-com correctly
vi.mock('emailjs-com', () => ({
  __esModule: true, 
  default: {
    send: vi.fn(),
  },
}));

describe('sendEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
    global.alert = vi.fn(); // Mock alert to avoid the "not implemented" error
  });

  it('should send an email successfully when emailjs.send resolves', async () => {
    // Arrange: Mock the resolved value for the send method
    const mockResponse = { status: 200, text: 'OK' };
    emailjs.send.mockResolvedValue(mockResponse);

    const sessionResults = 'Session results';
    const candidateEmail = 'candidate@example.com';
    const sponsorEmail = 'sponsor@example.com';

    // Act: Call the sendEmail function and wait for it to resolve
    await sendEmail(sessionResults, candidateEmail, sponsorEmail);

    // Assert: Ensure emailjs.send was called correctly
    expect(emailjs.send).toHaveBeenCalledTimes(1);
    expect(emailjs.send).toHaveBeenCalledWith(
      'service_1',
      'template',
      {
        session_results: sessionResults,
        candidate_email: candidateEmail,
        sponsor_email: sponsorEmail,
      },
      'GsqK9QNN8re0JhJjn'
    );

    // Assert: Ensure alert is called for success
    expect(global.alert).toHaveBeenCalledWith('Email sent successfully!');
  });

  it('should handle an error when emailjs.send fails', async () => {
    // Arrange: Mock a rejected send (simulate an error)
    const mockError = new Error('Failed to send email');
    emailjs.send.mockRejectedValue(mockError);

    const sessionResults = 'Session results';
    const candidateEmail = 'candidate@example.com';
    const sponsorEmail = 'sponsor@example.com';

    // Act: Call the sendEmail function and wait for the promise to reject
    await sendEmail(sessionResults, candidateEmail, sponsorEmail);

    // Assert: Ensure emailjs.send was called
    expect(emailjs.send).toHaveBeenCalledTimes(1);

   
  });
});
