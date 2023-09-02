//import { HelmetProvider } from 'react-helmet-async'; 
import Login from './components/Login';
import Dashboard from './components/userPanel/Dashboard';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { React, useState, createContext, useEffect } from 'react';
import {Routes, Route } from 'react-router-dom';
import AppContext from './context/App';
import './App.css';

function App() {
  let default_session_obj = {
    token: "",
    expirationTime:  0,
    isExpired: true,
    userData: {}
  };
  const [blockUI, setBlockUI] = useState(false);
  const [sessionVals, setSessionVals] = useState(default_session_obj);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    let userData = {};
    try {
      userData = JSON.parse(localStorage.getItem('userData'));
    } catch(e) {
      userData = {}
    }
    let local_storage_token = localStorage.getItem('token');
    if(["", undefined, null, "undefined"].includes(local_storage_token)) {
      local_storage_token = "";
    }
    let local_storage_token_exp_time = localStorage.getItem('token_exp_time');
    if(["", undefined, null, "undefined"].includes(local_storage_token_exp_time)) {
      local_storage_token_exp_time = 0;
    }

    const sessionObj = {
      token:  local_storage_token,
      expirationTime:  local_storage_token_exp_time,
      isExpired: false,
      userData: userData
    };
    const currentTime = new Date();

    if(currentTime.getTime() > sessionObj.expirationTime) {
      sessionObj.isExpired = true
    } else {
      setIsLogged(true);
    }
    console.log('sessionObj', sessionObj);
    setSessionVals(sessionObj);
  }, []);

  useEffect(() => {
    console.log(sessionVals);
  }, [sessionVals]);

  useEffect(() => {
    if(!sessionVals.isExpired) {
      let userData = '{}';
      try {
        userData = JSON.stringify(sessionVals.userData);
      } catch(e) {
        userData = '{}';
      }
      localStorage.setItem('token', sessionVals.token);
      localStorage.setItem('token_exp_time', sessionVals.expirationTime);
      localStorage.setItem('userData', userData);
    }
  }, [isLogged]);


  if(sessionVals.isExpired) {
    return (
     <AppContext.Provider value={{blockUI, setBlockUI}}>
        <Routes value="dark">
          <Route path="/login" element={<Login sessionVals={sessionVals} setSessionVals={setSessionVals} setIsLogged={setIsLogged} panel=""/>} />
        </Routes>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={blockUI}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
     </AppContext.Provider> 
    )
  } else {
    console.log(sessionVals);
      return (
        <AppContext.Provider value={{blockUI, setBlockUI}}>
          <Routes>
              <Route path="/" element={<Dashboard sessionVals={sessionVals} panelName={"inicio"}/>}/>
              <Route path="/login" element={<Dashboard sessionVals={sessionVals} panelName={"inicio"}/>} ></Route>
              <Route path="/dashboard">
                <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"inicio"}/>}/>
                <Route path="radioOnlineEmision" element={<Dashboard sessionVals={sessionVals} panelName={"emision_panel"}/>}/>
              </Route>
          </Routes>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={blockUI}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </AppContext.Provider>
      );
  }
}

export default App;