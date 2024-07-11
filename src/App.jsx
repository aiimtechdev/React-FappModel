import React, { useMemo } from 'react';

// import redux for auth guard
import { useSelector, useDispatch } from 'react-redux';

// import layout
import Layout from 'layout/Layout';

import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiRequest } from 'utils/request';

// import routing modules
import RouteIdentifier from 'routing/components/RouteIdentifier';
import { getRoutes } from 'routing/helper';
import routesAndMenuItems from 'routes';
import Loading from 'components/loading/Loading';
import { setCurrentUser } from 'auth/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const getUser = async () => {
    document.body.classList.add('spinner');
    const resp = await apiRequest('/auth/getUser', 'GET', undefined, localStorage.getItem('token'));
    if (resp.status === 'success' && resp.data.status === 'success') {
      dispatch(setCurrentUser(resp.data.user_data));
      document.body.classList.remove('spinner');
    }
    document.body.classList.remove('spinner');
  };
  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const test = JSON.stringify(currentUser) === '{}' && isLogin === true ? getUser() : '';

  const routes = useMemo(() => getRoutes({ data: routesAndMenuItems, isLogin, userRole: currentUser.role }), [isLogin, currentUser]);
  if (routes) {
    return (
      <Layout>
        <RouteIdentifier routes={routes} fallback={<Loading />} />
      </Layout>
    );
  }
  return <></>;
};

export default App;
