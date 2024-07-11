import { DEFAULT_PATHS } from 'config';
import { lazy } from 'react';

const DashboardPage = lazy(() => import('views/Dashboard'));
const CompanyPage = lazy(() => import('views/Company/Company'));
const CompanyDetailsPage = lazy(() => import('views/Company/CompanyDetails/CompanyDetails'));
const DevicesPage = lazy(() => import('views/Devices/Devices'));
const PlanPage = lazy(() => import('views/Plans/Plan'));
const MyProfilePage = lazy(() => import('views/MyProfile'));
const Logout = lazy(() => import('views/default/Logout'));
const DeviceDetailsPage = lazy(() => import('views/Devices/DeviceDetails'))

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      exact: true,
      redirect: true,
      to: `${appRoot}/dashboard`,
    }, {
      path: `${appRoot}/my-profile`,
      component: MyProfilePage,
      protected: true
    }, {
      path: `${appRoot}/dashboard`,
      component: DashboardPage,
      label: 'menu.dashboard',
      protected: true,
      icon: 'dashboard-1',
    }, {
      path: `${appRoot}/customers`,
      label: 'menu.customers',
      icon: 'building',
      component: CompanyPage,
      subs: [{
        path: '/details/:id?',
        component: CompanyDetailsPage,
        routelabel: "Details"
      }],
      protected: true,
      routelabel: "Customers"
    },
    {
      path: `${appRoot}/devices`,
      component: DevicesPage,
      label: 'menu.devices',
      subs: [{
        path: '/details/:id?',
        component: DeviceDetailsPage,
        routelabel: "Details"
      }],
      protected: true,
      icon: 'cpu',
    },
    {
      path: `${appRoot}/logout`,
      component: Logout,
      label: 'menu.logout',
      protected: true,
      icon: 'logout'
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;
