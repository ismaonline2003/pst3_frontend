import { React, useState, useEffect, Fragment } from 'react'
import { Navigate } from 'react-router-dom';

const OnlineRadioMyAccountLogout = ({}) => {
  const [loginRedirect, setLoginRedirect] = useState(false);

  useEffect(() => {
      localStorage.setItem('token', '');
      localStorage.setItem('token_exp_time', '');
      localStorage.setItem('userData', '{}');
      setLoginRedirect(true);
      setTimeout(() => {
        window.location.reload(true);
      }, 500);
  }, []);

  return (
    <Fragment>
      {loginRedirect && <Navigate to={`/login`} />}
    </Fragment>
  )
};

export default OnlineRadioMyAccountLogout;