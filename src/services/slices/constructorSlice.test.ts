jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit');
  return {
    ...actual,
    nanoid: () => 'test-id'
  };
});

import constructorReducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient } from '../../utils/types';

const bun: TIngredient = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg'
};

const mainIngredient: TIngredient = {
  _id: '2',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'image2.jpg',
  image_mobile: 'image2-mobile.jpg',
  image_large: 'image2-large.jpg'
};

const sauceIngredient: TIngredient = {
  _id: '3',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'image3.jpg',
  image_mobile: 'image3-mobile.jpg',
  image_large: 'image3-large.jpg'
};

jest.mock('uuid', () => ({
  v4: () => 'test-id'
}));

describe('constructorSlice reducer', () => {
  it('должен вернуть initialState для неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  it('должен обработать addIngredient для булки', () => {
    const state = constructorReducer(initialState, addIngredient(bun));

    expect(state).toEqual({
      bun: {
        ...bun,
        id: 'test-id'
      },
      ingredients: []
    });
  });

  it('должен обработать addIngredient для начинки', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(mainIngredient)
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [
        {
          ...mainIngredient,
          id: 'test-id'
        }
      ]
    });
  });

  it('должен обработать removeIngredient', () => {
    const startState = {
      bun: null,
      ingredients: [
        { ...mainIngredient, id: 'first-id' },
        { ...sauceIngredient, id: 'second-id' }
      ]
    };

    const state = constructorReducer(startState, removeIngredient('first-id'));

    expect(state).toEqual({
      bun: null,
      ingredients: [{ ...sauceIngredient, id: 'second-id' }]
    });
  });

  it('должен обработать moveIngredient', () => {
    const startState = {
      bun: null,
      ingredients: [
        { ...mainIngredient, id: 'first-id' },
        { ...sauceIngredient, id: 'second-id' }
      ]
    };

    const state = constructorReducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [
        { ...sauceIngredient, id: 'second-id' },
        { ...mainIngredient, id: 'first-id' }
      ]
    });
  });

  it('должен не менять state, если moveIngredient получает невалидный индекс', () => {
    const startState = {
      bun: null,
      ingredients: [{ ...mainIngredient, id: 'first-id' }]
    };

    const state = constructorReducer(
      startState,
      moveIngredient({ fromIndex: 5, toIndex: 0 })
    );

    expect(state).toEqual(startState);
  });

  it('должен обработать clearConstructor', () => {
    const startState = {
      bun: { ...bun, id: 'bun-id' },
      ingredients: [{ ...mainIngredient, id: 'first-id' }]
    };

    const state = constructorReducer(startState, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
