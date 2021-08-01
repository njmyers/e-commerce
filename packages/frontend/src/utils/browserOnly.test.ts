import { browserOnly } from './browserOnly';

describe('utils/browserOnly', () => {
  const mockValue = 10;

  let windowFunction: jest.Mock<unknown, any>;
  let defaultFunction: jest.Mock<unknown, any>;

  const callBrowserOnly = () => browserOnly(windowFunction, defaultFunction);

  describe('first argument is defined', () => {
    beforeEach(() => {
      windowFunction = jest.fn();
      windowFunction.mockReturnValue(10);
    });

    test('should call function with global window and document objects', () => {
      callBrowserOnly();
      expect(windowFunction).toBeCalledWith(window, document);
    });

    test('should return a value', () => {
      expect(callBrowserOnly()).toBe(mockValue);
    });
  });

  describe('both arguments are defined', () => {
    beforeEach(() => {
      windowFunction = jest.fn().mockReturnValue(mockValue);
      defaultFunction = jest.fn();
    });

    test('should call function with global window and document objects', () => {
      callBrowserOnly();
      expect(windowFunction).toBeCalledWith(window, document);
    });

    test('should return a value', () => {
      expect(callBrowserOnly()).toBe(mockValue);
    });
  });
});
