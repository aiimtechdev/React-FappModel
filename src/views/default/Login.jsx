  import React, { useState, useEffect } from 'react';
  import { Redirect } from 'react-router-dom';
  import { Button, Form } from 'react-bootstrap';
  import * as Yup from 'yup';
  import { useFormik } from 'formik';
  import CsLineIcons from 'cs-line-icons/CsLineIcons';
  import LayoutFullpage from 'layout/LayoutFullpage';
  import { useDispatch, useSelector } from 'react-redux';
  import { setCurrentUser } from 'auth/authSlice';
  import { apiRequest } from 'utils/request.js';
  import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  const LoginPage = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.auth);
  const [showPass, setShowPass] = useState(false);
  
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().min(6,'Must be at least 6 chars!').required('Password is required'),
    remember_me: Yup.boolean(),
  });

  const initialValues = { email:'', password:'', remember_me: false};

  const setCookie = (cname, cvalue, exMins) => {
    var date = new Date();
    date.setTime(date.getTime() + exMins * 60 * 1000);
    var expires = 'expires=' + date.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';paths=/'; 
  }

  const getCookie = (cookieName) => {
    let cookie = {};
    document.cookie.split(';').forEach(function (ele){
        let [key, value1] = ele.split('=');
        cookie[key.trim()] = value1 ;
    });
    return cookie[cookieName];
  }

  const onSubmit = async(values) => {
    document.body.classList.add('spinner');
    if(values.remember_me === false){
      setCookie('remember_me', '', 0);
    }
    const resp = await apiRequest('/auth/login', 'POST', values, false);
    if (resp.status === 'success') {
      toast.success('Login successful', {
        hideProgressBar: false,
        closeOnClick: true,
      });
      if(resp.data.dec_data !== ''){
        setCookie('remember_me', resp.data.dec_data, 21600);
      }
      dispatch(setCurrentUser(resp.data.user_data));
      localStorage.setItem('token', resp.data.access_token);
    }
    document.body.classList.remove('spinner');
  }

  const decryptData = React.useCallback(async () => {
    document.body.classList.add('spinner');
    const remember_me = getCookie('remember_me');
    if (remember_me !== undefined) {
      const body = { remember_me: remember_me };
      const resp = await apiRequest('/auth/remember_me', 'POST', body);
      setTimeout(() => {
        if (resp.status === 'success' && resp.data.status === 'success') {
          setFieldValue('email', resp.data.decData.admin_email);
          setFieldValue('password', resp.data.decData.password);
          setFieldValue('remember_me', true);
        }
        document.body.classList.remove('spinner');
      }, 1000);
    }
    document.body.classList.remove('spinner');
  }, []);

  useEffect(async () => {
    decryptData();
    toast.info(localStorage.getItem("Ermsg"), {
      hideProgressBar: false,
      closeOnClick: true,
      onClose: () => { localStorage.removeItem("Ermsg") }
    });
  }, []);

  const formik = useFormik({validationSchema, initialValues, onSubmit});
  const { handleSubmit, handleChange, values, touched, errors, setFieldValue } = formik;
  if(isLogin) return(<Redirect to="/dashboard" />);

  const content = (
    <div className="container-fluid d-flex justify-content-center align-items-center flex-column z-index-1">
      <h3 className="text-nowrap text-white fw-bolder fs-1 my-4">MonitoringSensor</h3>
      <div className="bg-white d-flex flex-column rounded p-7" style={{minWidth: '350px', width: '40%', maxWidth: '425px'}}>
        <Form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
          <h3 className="fw-bolder text-center mb-7">Sign In</h3>
          <div className="mb-3">
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
          </div>
          <div className="mb-3">
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon={showPass ? 'lock-off' : 'lock-on'} />
              <Form.Control type={showPass ? "text" : "password"} name="password" onChange={handleChange} value={values.password} placeholder="Password" />
              <span className="form-right-icon" role="button" onClick={() => setShowPass(!showPass)}>
                <CsLineIcons icon={showPass ? 'eye' : 'eye-off'} />
              </span>
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>
          </div>
          <div className="mb-3">
            <div className="custom-control custom-checkbox d-flex justify-content-between align-center">
              <Form.Check
                type="checkbox"
                label="Remember me"
                name="remember_me"
                checked={values.remember_me}
                value={values.remember_me}
                onChange={handleChange}
              />
                {/* <a className="text-primary" href="/forgot-password">Forgot password?</a> */}
                {/* <p className="forgot-password text-right">
                  Forgot <a href="/forgot-password">password ?</a>
                </p> */}
                  <p className="forgot-password text-right text-primary">
                    <a href="/forgot-password">Forgot Password ?</a>
                  </p>
            </div>
          </div>
          <Button type="submit" className='w-100 mt-4 py-3'>Login</Button>
        </Form>
      </div>
    </div>
  );
  return(<LayoutFullpage content={content} />);
 }

 export default LoginPage;