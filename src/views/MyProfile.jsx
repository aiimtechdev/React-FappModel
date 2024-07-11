import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from 'auth/authSlice';
import { toast } from 'react-toastify';
import { Row, Col, Card, OverlayTrigger, Tooltip, Form, Button, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { apiRequest } from 'utils/request';
import { NavLink } from 'react-router-dom';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const EditPasswordAnchor = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCurPass, setShowCurPass] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showCnfPass, setShowCnfPass] = useState(false);
  const initialValues = { password: '', newPassword: '', confirmPassword: '' }

  const validationSchema = Yup.object().shape({
    password: Yup.string().required('Current password is Required.'),
    newPassword: Yup.string().required('New Password is Required.')
      .matches(/[A-Z]+/, 'Atleast one UpperCase Character.')
      .matches(/[a-z]+/, 'Atleast one LowerCase Character.')
      .matches(/[@$!%*#?&]+/, "Atleast one Special Character.")
      .matches(/\d+/, "Atleast one Number.")
      .min(8, "Must be greater than 7 characters length."),
    confirmPassword: Yup.string().required('Confirm password is Required.')
      .oneOf([Yup.ref('newPassword'), null], 'Password must match.')
      .notOneOf([Yup.ref('password'), null], 'Same as the current password.')
  })

  const onSubmit = async(values) => {
    document.body.classList.add('spinner');
    //const resp = await apiRequest('/myProfile', 'POST', values, localStorage.getItem('token'));
    toast.success("Password updated successfully!  ", {
      hideProgressBar: false,
      closeOnClick: true,
    });
    // if (resp.status === 'success' && resp.data.status === 'success') {
    //   toast.success("Password updated successfully!  ", {
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //   });
    // }
    resetForm();
    setShowModal(false);
    document.body.classList.remove('spinner');
  }

  const formik = useFormik({validationSchema, initialValues, onSubmit, enableReinitialize: true, });
  const { handleSubmit, handleChange, values, touched, errors, resetForm } = formik;

  return(<>
    <Button variant='outline-primary' onClick={() => setShowModal(!showModal)}> Change Password </Button>
    <Modal show={showModal} onHide={() => setShowModal(false)} backdrop='static' animation={true} size='md' centered>
      <Modal.Header className='cta-41 text-primary p-4' closeButton>Change Password</Modal.Header>
      <Modal.Body>
        <Form className='d-flex flex-column' id="change_password" onSubmit={handleSubmit}>
          <Form.Group>
              <Form.Label>Current Password</Form.Label>
              <div className='filled'>
                  <CsLineIcons className="" icon={ showCurPass ? 'lock-off' : 'lock-on' } />
                  <Form.Control type={showCurPass ? 'text' : 'password'} placeholder='Current Password' name='password' value={values.password || ''} onChange={handleChange} />
                  <span className="form-right-icon" role="button" onClick={() => setShowCurPass(!showCurPass)}>
                    <CsLineIcons icon={ showCurPass ? 'eye' : 'eye-off' } />
                  </span>
                  {errors.password && touched.password && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.password}</div>}
              </div>
          </Form.Group>
          <Form.Group>
              <Form.Label>New Password</Form.Label>
              <div className="filled">
                  <CsLineIcons icon={ showPass ? 'lock-off' : 'lock-on' } />
                  <span className="form-right-icon" role="button" onClick={() => setShowPass(!showPass)}>
                    <CsLineIcons icon={ showPass ? 'eye' : 'eye-off' } />
                  </span>
                  <Form.Control type={showPass ? "text" : "password"}  placeholder="New Password" name='newPassword' value={values.newPassword || ''} onChange={handleChange} />
                  {errors.newPassword && touched.newPassword && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.newPassword}</div>}
              </div> 
          </Form.Group>
          <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <div className="mb-3 filled">
                  <CsLineIcons icon={ showCnfPass ? 'lock-off' : 'lock-on' } />
                  <span className="form-right-icon" role="button" onClick={() => setShowCnfPass(!showCnfPass)}>
                    <CsLineIcons icon={ showCnfPass ? 'eye' : 'eye-off' } />
                  </span>
                  <Form.Control type={showCnfPass ? "text" : "password"} placeholder="Password" name='confirmPassword' value={values.confirmPassword || ''} onChange={handleChange} />
                  {errors.confirmPassword && touched.confirmPassword && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.confirmPassword}</div>}
              </div> 
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className='d-flex justify-content-end gap-3 p-3'>
        <Button variant='outline-primary' onClick={() => {resetForm(); setShowModal(false)}}>Cancel</Button>
        <Button variant='primary' form="change_password" type='submit'>Change</Button>
      </Modal.Footer>
    </Modal>
  </>
  );
}

const MyProfilePage = () => {
  const title = 'My Profile';
  const description = 'Welcome to My Profile page design.';
  const {currentUser} = useSelector((state)=>state.auth);
  console.log(currentUser);
  const dispatch = useDispatch();
  const initialValues = {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    phoneNo: currentUser.phoneNo,
    city: currentUser.city
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required').matches(/^[a-zA-Z\s]+$/, "Invalid Name format"),
    lastName: Yup.string().matches(/^[a-zA-Z\s]+$/, "Invalid Name format"),
    email: Yup.string().required('Email is required').email(),
    phoneNo: Yup.string().matches(/^[0-9]+$/, "Only digits allowed").min(10, "Must be exactly 10 digits"),
    city: Yup.string().matches(/^[a-zA-Z\s]+$/, "Invalid Name format")
  });

  const diffAndDispatchUser = (currData) => {
    if(!Object.keys(currentUser).every(userProp => currData[userProp] == currentUser[userProp])) {
      const currUser = {
        firstName: currData.firstName,
        lastName: currData.lastName,
        phoneNo: currData.phoneNo,
        email: currData.email,
        city: currData.city
      }
      dispatch(setCurrentUser(currUser));
    }
  }

  useEffect(() => {
    Object.entries(currentUser).map(([key, value]) => {
      value = value === null ? '' : value;
      setFieldValue(key, value);
    })
  }, [currentUser])

  const onSubmit = async(values) => {
    document.body.classList.add('spinner');
   // const resp = await apiRequest('/myProfile', 'PATCH', values, localStorage.getItem('token'));
     toast.success("Profile updated successfully!  ", {
        hideProgressBar: false,
        closeOnClick: true,
      });
    // if (resp.status === 'success' && resp.data.status === 'success') {
    //   toast.success("Profile updated successfully!  ", {
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //   });
    //   if(resp.data.userToken) localStorage.setItem('token', resp.data.userToken);
    //   diffAndDispatchUser(values);
    // }
    document.body.classList.remove('spinner');
  }

  const formik = useFormik({validationSchema, initialValues, onSubmit, enableReinitialize: true, });
  const { handleSubmit, handleChange, values, touched, errors, setFieldValue } = formik;
  return (
    <>
      <HtmlHead title={title} description={description} />
      <Row>
        <Row className="g-0 mb-2 mb-sm-0">
          <NavLink className="muted-link d-inline-block hidden breadcrumb-back w-auto" to="/dashboard">
            <CsLineIcons icon="chevron-left" size="13" />
            <span className="align-middle text-small ms-1">Dashboard</span>
          </NavLink>
        </Row>
        <Row>
          <section className="scroll-section" id="title">
            <div className="page-title-container">
              <h1 className="mb-0 pb-0 text-primary">{title}</h1>
            </div>
          </section>
        </Row>
        <Col lg="8" xl="6">
          <Card style={{maxWidth: '35rem'}}>
              <Card.Header className="bg-primary" style={{ height:'7rem' }}></Card.Header>
              <div className='mb-3 mx-auto position-relative'>
                  <img src={ currentUser.thumb ? `data:image/png;base64,${currentUser.thumb}` : '/img/profile.webp' } alt="user" 
                  className="border border-separator-light border-4 sw-15 sh-15" style={{marginTop:'-4.2em', borderRadius:'50%'}} id="contactThumbModal" />
              </div>
              <Card.Body>
                { currentUser.firstName != undefined ?
                  <>
                    <p>Details of <span className='cta-41 text-primary' style={{marginBottom:'2em'}}>{currentUser.firstName + ' ' + currentUser.lastName}</span></p>
                    <div className='d-flex flex-wrap'>
                      <div style={{flex: '0.5', minWidth: '14rem'}}>
                          <p>
                            <span className="me-2">
                              <OverlayTrigger placement="top" overlay={<Tooltip>Admin Name</Tooltip>}>
                                <a><CsLineIcons icon="user" /></a>
                              </OverlayTrigger>
                            </span>
                            {currentUser.firstName + ' ' + currentUser.lastName}
                          </p>
                          <p>
                            <span className="me-2">
                              <OverlayTrigger placement="top" overlay={<Tooltip>Location</Tooltip>}>
                                <a><CsLineIcons icon="pin" /></a>
                              </OverlayTrigger>
                            </span>
                            {currentUser.city ? currentUser.city : 'Not Available'}
                          </p>
                      </div>
                      <div style={{flex: '0.5', minWidth: '14rem'}}>
                          <p>
                            <span className="me-2">
                              <OverlayTrigger placement="top" overlay={<Tooltip>Email Address</Tooltip>}>
                                <a><CsLineIcons icon="email" /></a>
                              </OverlayTrigger>
                            </span>
                            {currentUser.email}
                          </p>
                          <p>
                            <span className="me-2">
                              <OverlayTrigger placement="top" overlay={<Tooltip>Phone Number</Tooltip>}>
                                <a><CsLineIcons icon="phone" /></a>
                              </OverlayTrigger>
                            </span>
                            {currentUser.phoneNo ? currentUser.phoneNo : 'Not Available'}
                          </p>
                      </div>
                    </div>
                  </> : <></>
                }
              </Card.Body>
          </Card>
        </Col>
        <Col xl="6">
          <Card className="form-aside">
            <Card.Header className="text-primary p-4">
              <h4 className='m-0'>Edit Profile</h4>
            </Card.Header>
            <Card.Body>
              <Form className='d-flex flex-column' onSubmit={handleSubmit}>
                <Row>
                  <Col md='6'>
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <div className="mb-3 filled">
                        <CsLineIcons icon="user" />
                        <Form.Control type="text" placeholder="First name" name='firstName' value={values.firstName || ''} onChange={handleChange} />
                        {errors.firstName && touched.firstName && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.firstName}</div>}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md='6'>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <div className="mb-3 filled">
                        <CsLineIcons icon="user" />
                        <Form.Control type="text" placeholder="Last name" name='lastName' value={values.lastName || ''} onChange={handleChange} />
                        {errors.lastName && touched.lastName && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.lastName}</div>}
                      </div> 
                    </Form.Group>
                  </Col>
                  <Col md='6'>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <div className="mb-3 filled">
                        <CsLineIcons icon="email" />
                        <Form.Control type="email" placeholder="Email" name='email' value={values.email || ''} onChange={handleChange} />
                        {errors.email && touched.email && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.email}</div>}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md='6'>
                    <Form.Group>
                      <Form.Label>Phone Number</Form.Label>
                      <div className="mb-3 filled">
                        <CsLineIcons icon="phone" />
                        <Form.Control type="number" placeholder="Phone number" name='phoneNo' value={values.phoneNo || ''} onChange={handleChange} />
                        {errors.phoneNo && touched.phoneNo && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.phoneNo}</div>}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md='6'>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <div className="mb-3 filled">
                        <CsLineIcons icon="pin" />
                        <Form.Control type="text" placeholder="City" name='city' value={values.city || ''} onChange={handleChange} />
                        {errors.city && touched.city && <div style={{fontSize:'0.72rem', color:'red'}}>{errors.city}</div>}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <div className='d-flex justify-content-between' >
                    <EditPasswordAnchor />
                    <Button variant='primary' type='submit'> Update </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default MyProfilePage;
