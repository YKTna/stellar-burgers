import { FC } from 'react';
import styles from './ingridient.module.css';
import { IngredientDetails } from '@components';

export const IngredientDetail: FC = () => (
  <div className={styles.ingridientDetail}>
    <h3 className='text text_type_main-large'>Детали ингредиента</h3>
    <IngredientDetails />
  </div>
);
