import { LAYOUT, MENU_BEHAVIOUR, NAV_COLOR, MENU_PLACEMENT, RADIUS, THEME_COLOR, USER_ROLE } from 'constants';

export const IS_DEMO = true;
export const IS_AUTH_GUARD_ACTIVE = true;
export const SERVICE_URL = '/app';
export const USE_MULTI_LANGUAGE = true;

export const REACT_HELMET_PROPS = {
  defaultTitle: 'MonitoringSensor - Admin',
  titleTemplate: '%s | MonitoringSensor - Admin',
};

export const DEFAULT_PATHS = {
  APP: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  NOTFOUND: '/page-not-found',
  UNAUTHORIZED: '/unauthorized',
  INVALID_ACCESS: '/invalid-access',
};

export const DEFAULT_SETTINGS = {
  MENU_PLACEMENT: MENU_PLACEMENT.Vertical,
  MENU_BEHAVIOUR: MENU_BEHAVIOUR.Pinned,
  LAYOUT: LAYOUT.Boxed,
  RADIUS: RADIUS.Standard,
  COLOR: THEME_COLOR.LightRed,
  NAV_COLOR: NAV_COLOR.Default,
  USE_SIDEBAR: false,
};

export const REDUX_PERSIST_KEY = 'sensor-monitor-admin';
