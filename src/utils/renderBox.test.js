import { renderBoxes } from './renderBox';

// Mocking canvas context
let mockCanvas;
let mockContext;

beforeEach(() => {
  mockContext = {
    fillStyle: '',
    fillRect: jest.fn(),
    strokeStyle: '',
    lineWidth: 1,
    strokeRect: jest.fn(),
    clearRect: jest.fn(),
    measureText: jest.fn(() => ({ width: 100 })), // Mock measureText
    fillText: jest.fn(), // Mock fillText
    canvas: {
      width: 640,
      height: 480,
    },
  };
  mockCanvas = {
    getContext: jest.fn(() => mockContext),
  };
});

describe('renderBox.js', () => {
  test('renderBoxes should render the correct number of boxes', () => {
    const boxes = [
      [100, 100, 200, 200],
      [300, 300, 400, 400]
    ];
    const scores = [0.9, 0.8];
    const classes = [0, 1]; // Mock class IDs
    const ratios = [1, 1]; // Mock xRatio and yRatio

    renderBoxes(mockCanvas, boxes, scores, classes, ratios);

    // Check if fillRect or strokeRect was called (rendering boxes)
    expect(mockContext.fillRect).toHaveBeenCalledTimes(2);
    expect(mockContext.strokeRect).toHaveBeenCalledTimes(2);
  });

  test('renderBoxes should use different colors for different classes', () => {
    const boxes = [
      [100, 100, 200, 200]
    ];
    const scores = [0.9];
    const classes = [0]; // First class
    const ratios = [1, 1];

    renderBoxes(mockCanvas, boxes, scores, classes, ratios);

    // Assert that the correct color is used based on the class
    expect(mockContext.fillStyle).toBe('#FF0000'); // Assuming class 0 uses red
  });

  test('renderBoxes should not render boxes if no valid boxes are passed', () => {
    const boxes = [];
    const scores = [];
    const classes = [];
    const ratios = [];

    renderBoxes(mockCanvas, boxes, scores, classes, ratios);

    // Ensure that fillRect is not called
    expect(mockContext.fillRect).not.toHaveBeenCalled();
  });

  test('renderBoxes should render labels correctly', () => {
    const boxes = [
      [100, 100, 200, 200]
    ];
    const scores = [0.9];
    const classes = [0]; // First class
    const ratios = [1, 1];

    renderBoxes(mockCanvas, boxes, scores, classes, ratios);

    // Check if fillText was called (rendering labels)
    expect(mockContext.fillText).toHaveBeenCalledTimes(1);
    expect(mockContext.fillText).toHaveBeenCalledWith('Class 0 - 90%', 100, 90);
  });

  test('renderBoxes should clear the canvas before rendering', () => {
    const boxes = [
      [100, 100, 200, 200]
    ];
    const scores = [0.9];
    const classes = [0]; // First class
    const ratios = [1, 1];

    renderBoxes(mockCanvas, boxes, scores, classes, ratios);

    // Check if clearRect was called to clear the canvas
    expect(mockContext.clearRect).toHaveBeenCalledTimes(1);
    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 640, 480);
  });
});