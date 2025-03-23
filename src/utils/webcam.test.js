import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Webcam } from './webcam';

describe('Webcam class', () => {
  let webcam;
  let videoRef;

  beforeEach(() => {
    // Reset mocks before each test
    webcam = new Webcam();
    videoRef = {
      srcObject: null,
    };
    // Mock alert to avoid the "Not implemented" error in jsdom
    global.alert = vi.fn();
  });

  it('should open the webcam and stream to videoRef', async () => {
    // Mock getUserMedia to return a fake stream
    const fakeStream = { getTracks: vi.fn() };
    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue(fakeStream),
    };

    await webcam.open(videoRef);
    expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: false,
      video: { facingMode: 'environment' },
    });
    expect(videoRef.srcObject).toBe(fakeStream);
  });

  it('should handle error when getUserMedia fails', async () => {
    // Mock getUserMedia to reject
    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockRejectedValue(new Error('Permission denied')),
    };

    
  });

  it('should close the webcam stream', () => {
    const mockStop = vi.fn();
    const fakeStream = { 
      getTracks: vi.fn(() => [{ stop: mockStop }]) 
    };
    videoRef.srcObject = fakeStream;

    webcam.close(videoRef);

    // Ensure that the stop method is called
    expect(mockStop).toHaveBeenCalled();
    expect(videoRef.srcObject).toBeNull();
  });

  it('should alert if trying to close the webcam when not opened', () => {
    webcam.close(videoRef);
    expect(global.alert).toHaveBeenCalledWith('Please open Webcam first!');
  });
});
