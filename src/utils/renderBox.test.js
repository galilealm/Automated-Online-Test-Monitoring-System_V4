import { renderBoxes } from './renderBox';
import labels from './labels.json';

// Mocking canvas context
let mockCanvas;
let mockContext;

beforeEach(() => {
  mockContext = {
    fillStyle: '',
    fillRect: vi.fn(),
    strokeStyle: '',
    lineWidth: 1,
    strokeRect: vi.fn(),
    clearRect: vi.fn(),
    measureText: vi.fn((text) => ({ width: text.length * 8 })), // Approximate width
    fillText: vi.fn(),
    canvas: {
      width: 640,
      height: 480,
    },
  };
  mockCanvas = {
    getContext: vi.fn(() => mockContext),
  };
});

describe('renderBox.js', () => {
  test('renderBoxes should render the correct number of boxes', () => {
    const boxes = [
      100, 100, 200, 200,  // box 1
      300, 300, 400, 400   // box 2
    ];
    const scores = [0.9, 0.8];
    const classes = [0, 1];
    const ratios = [1, 1];

    renderBoxes(mockCanvas, boxes, scores, classes, ratios);

    // Each box calls fillRect (1 for box, 1 for label background)
    expect(mockContext.fillRect).toHaveBeenCalledTimes(4);
    // Each box calls strokeRect once
    expect(mockContext.strokeRect).toHaveBeenCalledTimes(2);
  });

  test('renderBoxes should use different colors for different classes', () => {
    const boxes = [100, 100, 200, 200];
    const scores = [0.9];
    const classes = [0];
    const ratios = [1, 1];

    const fillStyles = [];
    mockContext.fillRect = vi.fn((x, y, w, h) => {
      fillStyles.push(mockContext.fillStyle);
    });

    renderBoxes(mockCanvas, boxes, scores, classes, ratios);

    // Check if one of the fillStyle calls contains the expected rgba value
    const colorUsed = fillStyles.some((color) => color.includes('rgba(31, 58, 147'));
    expect(colorUsed).toBe(true);
  });

  test('renderBoxes should not render boxes if no valid boxes are passed', () => {
    renderBoxes(mockCanvas, [], [], [], [1, 1]);

    expect(mockContext.fillRect).not.toHaveBeenCalled();
    expect(mockContext.strokeRect).not.toHaveBeenCalled();
  });

  test('renderBoxes should render labels correctly', () => {
    const boxes = [100, 100, 200, 200];
    const scores = [0.9];
    const classes = [0];
    const ratios = [1, 1];

    renderBoxes(mockCanvas, boxes, scores, classes, ratios);

    const expectedText = `${labels[0]} - 90.0%`;
    expect(mockContext.fillText).toHaveBeenCalledWith(expectedText, expect.any(Number), expect.any(Number));
  });

  test('renderBoxes should clear the canvas before rendering', () => {
    const boxes = [100, 100, 200, 200];
    const scores = [0.9];
    const classes = [0];
    const ratios = [1, 1];

    renderBoxes(mockCanvas, boxes, scores, classes, ratios);

    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 640, 480);
  });
});
