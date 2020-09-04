function test(sortMethod) {
  const a = [3, 2, 1];
  const b = sortMethod(a);
  expect(b[0]).toBe(1);
  expect(b[1]).toBe(2);
  expect(b[2]).toBe(3);
}

export default test;
