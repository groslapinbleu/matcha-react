import RadioButtons from 'components/RadioButtons';
import React from 'react';
import renderer from 'react-test-renderer';
import { genders } from 'models/User';

const handleSelect = (name, value) => {
  console.log('name =' + name + ' value = ' + value);
};

test('RadioButtons snapshot test', () => {
  const component = renderer.create(
    <RadioButtons
      selectedElement={0}
      elementList={genders}
      name='test'
      className='border-indigo-300'
      onSelect={handleSelect}
    />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
