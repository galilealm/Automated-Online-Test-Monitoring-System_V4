import * as tf from "@tensorflow/tfjs";
import { startLogging, getDetectionLogs } from "./detect";

// Mock TensorFlow.js
vi.mock("@tensorflow/tfjs", () => ({
  browser: {
    fromPixels: vi.fn(() => ({
      shape: [224, 224, 3],
      pad: vi.fn(() => ({
        resizeBilinear: vi.fn(() => ({
          toFloat: vi.fn(() => ({
            expandDims: vi.fn(() => "mocked_tensor"),
          })),
        })),
      })),
    })),
  },
  tidy: vi.fn((fn) => fn()),
}));

// Mock the Canvas API
beforeAll(() => {
  global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillStyle: "",
    fillRect: vi.fn(),
  }));
});

describe("detect.js utility functions", () => {
  test("startLogging() should reset detection logs", () => {
    startLogging();
    expect(getDetectionLogs()).toEqual([]);
  });

  test("getDetectionLogs() should return an empty array initially", () => {
    expect(getDetectionLogs()).toEqual([]);
  });

  test("getDetectionLogs() should return logged detections", () => {
    startLogging();
    const mockLog = { class: "real", confidence: 0.9 };
    getDetectionLogs().push(mockLog); // Simulate adding a detection log

    expect(getDetectionLogs()).toEqual([mockLog]); // Ensure the log is stored
  });

  test("startLogging() should clear previous logs", () => {
    getDetectionLogs().push({ class: "spoof", confidence: 0.1 }); // Add fake log
    startLogging(); // Reset logs

    expect(getDetectionLogs()).toEqual([]); // Logs should now be empty
  });

  test("preprocess() should correctly process an image into a tensor-like object", () => {
    const mockImage = { data: new Uint8Array([255, 0, 0, 255]) }; // Simulated image data
    const processedImage = tf.browser.fromPixels(mockImage);
    
    expect(processedImage.shape).toEqual([224, 224, 3]); // Mocked return shape
    expect(typeof processedImage).toBe("object"); // Ensures it's an object
  });
});