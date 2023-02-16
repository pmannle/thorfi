import { useMemo } from 'react';

export interface RouteMenu {
  to: string;
  title: string;
}

const dashboard: RouteMenu = {
  to: '/',
  title: 'DASHBOARD',
};

const myPage: RouteMenu = {
  to: `/mypage`,
  title: 'MY PAGE',
};

const earn: RouteMenu = {
  to: '/earn',
  title: 'EARN',
};

const borrow: RouteMenu = {
  to: '/borrow',
  title: 'BORROW',
};

const useMenus = (): RouteMenu[] => {
  return [dashboard, myPage, earn, borrow];
};

export { useMenus };
