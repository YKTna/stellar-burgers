import ingredientsReducer, {
  initialState,
  getIngredients
} from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredientsSlice reducer', () => {
  it('должен вернуть initialState для неизвестного экшена', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  it('должен обработать getIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      getIngredients.pending('', undefined)
    );

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('должен обработать getIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      {
        ...initialState,
        isLoading: false
      },
      getIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  it('должен обработать getIngredients.rejected', () => {
    const action = getIngredients.rejected(
      new Error('Ошибка загрузки'),
      '',
      undefined
    );

    const state = ingredientsReducer(
      {
        ...initialState,
        isLoading: true
      },
      action
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка загрузки'
    });
  });
});
