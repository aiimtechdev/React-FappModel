/* eslint-disable */
import React,{useEffect, useState} from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Logout() {
  const { isLogin } = useSelector((state) => state.auth);
  const [condi, setCondi] = useState(isLogin);
    
  useEffect(() => {
    setCondi(false);
    localStorage.removeItem("token");
    window.location.reload(true);
    condi === false ? <Redirect to="/login" />: ""   
  },[condi]);
  return (
    <div>{condi === false ? <Redirect push to="/login" /> : ""}</div>
  )
}

export default Logout;