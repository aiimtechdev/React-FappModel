/* eslint-disable */
import{ React, useEffect, useState }from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { apiRequest } from 'utils/request';

const ResetPassword = () => {

    const [viewpass, setViewpass] = useState(false);
    const [viewpasscon, setViewpasscon] = useState(false);
    
    const history = useHistory();
    const useQuery = () => new URLSearchParams(window.location.search);
    const query = useQuery();
    const token = query.get('token');
    const name = query.get('name');

    const initialValues = { password: '', confirmPassword:''};
    const validationSchema = Yup.object().shape({
        password: Yup.string().required('Password is required')
        .matches(/[A-Z]+/, "One Uppercase Letter")
        .matches(/[a-z]+/, "One Lowercase Letter")
    //   .matches(/[@$!%*#?&]+/, "One Special Character")
        .matches(
            /^.*[`~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*$/,
            'Need one special character',
        )
        .matches(/\d+/, "One Number")
        .min(8, "Must be 8 characters"),
        confirmPassword: Yup.string().required('Retype your password').
        oneOf([Yup.ref('password'), null], 'Password must match')
    });
 
    const onSubmit = async (values) => {
      document.body.classList.add('spinner');
      const body = {  
        "password": values.password,
        "confirmPassword": values.confirmPassword
      }
      const resp = await apiRequest('/auth/reset-password', 'POST', body, token);
      setTimeout(() => {
        if (resp.status === 'success' && resp.data.status === 'success') {
            alert("Password Updated Successfully");
            history.push("/login")
        } else if (resp.status !== 'success' && resp.data.status !== 'success'){
            alert("Token Invalid");
        }
        document.body.classList.remove('spinner');
      }, 1000);
    }

    const formik = useFormik({validationSchema, initialValues, onSubmit});
    const { handleSubmit, handleChange, values, touched, errors } = formik;

    const content = (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 z-index-1" style={{marginTop:'-3.3rem'}}>
            <div className="bg-white d-flex flex-column rounded p-7" style={{minWidth: '350px', width: '40%', maxWidth: '425px'}} >                
                <form id="resetForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <h2 className="cta-1 mb-0 text-primary text-center">Reset Your Password</h2>
                    </div>
                    <div className="mb-5">
                        <p className="h6 text-center" style={{padding: '0 10%'}}>Please use the form below to reset your password.</p>
                    </div>
                    <div className="mb-3">
                        <p className='cta-41 text-center'>User: {name}</p>
                        <div className="mb-3 filled form-group tooltip-end-top d-flex flex-direction-row">
                            <CsLineIcons icon={viewpass ? 'lock-off' : 'lock-on'} />
                            <Form.Control type={viewpass ? "text" : "password"} name="password" onChange={handleChange} value={values.password} placeholder="Password" />
                            <Button variant="foreground-alternate" className='p-0 ms-n6 filled ' onClick={()=>setViewpass(!viewpass)} style={{backgroundColor: '#f8f8f8'}}>
                                {viewpass === true ? <CsLineIcons icon="eye" size="17" /> : <CsLineIcons icon="eye-off" size="17" />}
                            </Button> 
                            {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="mb-3 filled form-group tooltip-end-top d-flex flex-direction-row">
                            <CsLineIcons icon={viewpasscon ? 'lock-off' : 'lock-on'} />
                            <Form.Control type={viewpasscon ? "text" : "password"} name="confirmPassword" onChange={handleChange} value={values.confirmPassword} placeholder="Confirm Password" />
                                <Button variant="foreground-alternate" className='p-0 ms-n6 filled' onClick={()=>setViewpasscon(!viewpasscon)} style={{backgroundColor: '#f8f8f8'}}>
                                    {viewpasscon === true ?  <CsLineIcons icon="eye" size="17" /> : <CsLineIcons icon="eye-off" size="17" />}
                                </Button> 
                            {errors.confirmPassword && touched.confirmPassword && <div className="d-block invalid-tooltip">{errors.confirmPassword}</div>}
                        </div>
                    </div>
                    <Button size="lg" type="submit" className='w-100 mt-4 py-3' >Reset Password</Button>            
                </form>
            </div>
        </div> 
    );
    return(<LayoutFullpage content={content} />);
}

export default ResetPassword