const sum = require('../extension/js/attempt');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});