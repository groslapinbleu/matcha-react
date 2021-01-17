import { genders, defaultUserData } from 'models/User';

// number
const gendersSize = genders.length;
test('genders size is 3', () => {
  expect(gendersSize).toBe(3);
});

describe('string tests', () => {
  // string
  test('genders first item is other', () => {
    expect(genders[0]).toContain('autre');
  });
  test('genders second item includes female', () => {
    expect(genders[1]).toMatch(/femme/);
  });
});

const testArray = [
  'autre', // index 0 is the default value
  'homme',
];

// array
test('check whole genders array', () => {
  expect(genders).toEqual(expect.arrayContaining(testArray));
});

describe('array tests', () => {
  // object property
  test('check properties of object defaultUserData', () => {
    expect(defaultUserData).toHaveProperty('email');
  });

  // object value
  test('check properties and value of object defaultUserData', () => {
    expect(defaultUserData).toHaveProperty('visible', false);
  });
});
