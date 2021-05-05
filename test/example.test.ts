test('basic', () => {
    expect(true).toBe(true);
});

test('addition', () => {
    expect(1 + 2).toBe(3);
});

test('string contains', () => {
    expect("https://google.com").toMatch(/https/);
});

const test_array = ['class1', 'class2', 'class3'];
test('array contains', () => {
    expect(test_array).toContain('class3');
});
