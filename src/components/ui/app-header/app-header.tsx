import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { pathname } = useLocation();

  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients');
  const isFeedActive = pathname.startsWith('/feed');
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        {/* Левая часть меню */}
        <div className={styles.menu_part_left}>
          <div className={styles.menu_item}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <NavLink
              to='/'
              end
              className={({ isActive }) =>
                clsx(styles.link, { [styles.link_active]: isActive })
              }
            >
              Конструктор
            </NavLink>
          </div>

          <div className={styles.menu_item}>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <NavLink
              to='/feed'
              className={({ isActive }) =>
                clsx(styles.link, { [styles.link_active]: isActive })
              }
            >
              Лента заказов
            </NavLink>
          </div>
        </div>

        {/* Центр логотип */}
        <div className={styles.logo}>
          <Logo className='' />
        </div>

        {/* Правая часть меню */}
        <div className={styles.link_position_last}>
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              clsx(styles.link, { [styles.link_active]: isActive })
            }
          >
            {userName || 'Личный кабинет'}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
