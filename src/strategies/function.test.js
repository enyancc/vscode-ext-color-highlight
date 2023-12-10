const assert = require('assert');
const { findColorFunctionsInText, createColorFunctionObject } = require('./functions');

describe('findColorFunctionsInText', function() {
  it('should find color functions in text', async function() {
    const text = 'background-color: rgb(255, 0, 0); --custom-color-rgb: 0 0 255;';
    const result = await findColorFunctionsInText(text);
    assert.deepStrictEqual(result, [
      { start: 18, end: 32, color: 'rgb(255, 0, 0)' },
      { start: 34, end: 57, color: 'rgb(0 0 255)' }
    ]);
  });
});

describe('createColorFunctionObject', function() {
  it('should create a color function object from a match', function() {
    const match = { index: 18, 0: 'rgb(255, 0, 0)' };
    const result = createColorFunctionObject(match);
    assert.deepStrictEqual(result, { start: 18, end: 32, color: 'rgb(255, 0, 0)' });
  });

  it('should create a color function object from a CSS variable match', function() {
    const match = { index: 34, 0: '--custom-color-rgb: 0 0 255;' };
    const result = createColorFunctionObject(match);
    assert.deepStrictEqual(result, { start: 34, end: 57, color: 'rgb(0 0 255)' });
  });
});