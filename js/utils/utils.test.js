import { parseChars } from "./index";

test("chars to works as expected", () => {
  const expected = [1, 2];
  const actual = parseChars("1,2");
  expect(actual).toEqual(expected);
});

test("chars works with empty array", () => {
  const expected = [];
  const actual = parseChars("");
  expect(actual).toEqual(expected);
});
test("chars to work with null imput", () => {
  const expected = [];
  const actual = parseChars(null);
  expect(actual).toEqual(expected);
});
