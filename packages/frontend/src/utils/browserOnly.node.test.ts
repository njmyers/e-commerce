/** @jest-environment node */

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

    test('should not call function', () => {
      callBrowserOnly();
      expect(windowFunction).not.toBeCalled();
    });

    test('should return undefined', () => {
      expect(callBrowserOnly()).toBe(undefined);
    });
  });

  describe('both arguments are defined', () => {
    beforeEach(() => {
      windowFunction = jest.fn();
      defaultFunction = jest.fn().mockReturnValue(mockValue);
    });

    test('should call function with no arguments', () => {
      callBrowserOnly();
      expect(defaultFunction).toBeCalledWith();
    });

    test('should return a value', () => {
      expect(callBrowserOnly()).toBe(mockValue);
    });
  });
});
