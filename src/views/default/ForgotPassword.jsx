/* eslint-disable */
import{ React, useState }from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { apiRequest } from 'utils/request';
import { toast } from 'react-toastify';
// import '../signin.css';

const ForgotPassword = () => {

    const[check, setCheck] = useState(false);

    const initialValues = { email: ''};

    const validationSchema = Yup.object().shape({
      email: Yup.string().email().required('Email is required'),
    });
    
    const onSubmit = async () => {
      document.body.classList.add('spinner');
      const body = { "email":values.email };
      const resp = await apiRequest('/auth/forgot-password', 'POST', body);
      setTimeout(() => {
        if (resp.status === 'success' && resp.data.status === 'success') {
          // toast.success("Mail send Successfull", {
          //   hideProgressBar: false,
          //   closeOnClick: true,
          // });
          setCheck(true);
        }  
        document.body.classList.remove('spinner');
      }, 1000);
    }
    const formik = useFormik({validationSchema, initialValues, onSubmit});
    const { handleSubmit, handleChange, values, touched, errors } = formik;

    const content = (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 z-index-1" style={{marginTop:'-3.3rem'}}>
            <div className="bg-white d-flex flex-column rounded p-7" style={{minWidth: '350px', width: '40%', maxWidth: '425px'}} >  
            {
                !check ? 
                <form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
                    <div className="mb-5">
                    <h2 className="cta-1 text-primary">Lets reset your password</h2>
                    </div>
                    <div className="mb-5">
                    <p className="h6">Please enter your email address to receive a password reset link.</p>
                        {/* <p className="h6">
                            If you are a member, please <NavLink to="/login" className='font-weight-bold'>login</NavLink>.
                        </p> */}
                    </div>
                    <div className="mb-3">
                        <div className="mb-3 filled form-group tooltip-end-top">
                            <CsLineIcons icon="email" />
                            <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
                            {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
                        </div>    
                    </div>
    
            
                    <Button size="lg" type="submit" className='w-100 mt-4 py-3' >Send Email</Button>
                   
                </form>
                    : 
                    <>
                        <div className="mb-5">
                            <h2 className="cta-1 mb-0 text-primary">A password reset link has been sent to your email. </h2>
                        </div>
                        {/* <p className="h6">
                            If you are a member, please <NavLink to="/login">login</NavLink>.
                        </p> */}
                        <div style={{display:'flex', justifyContent:'end'}}>
                        <NavLink to="/login">
                            <Button variant="primary" type='submit' >
                                OK
                            </Button>
                        </NavLink> 
                        </div>
                    </>
            }              
            </div>
        </div> 
    );
     
    return(<LayoutFullpage content={content} />);
}

export default ForgotPassword