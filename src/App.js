import { React, useState, createContext, useEffect, Fragment } from 'react';
import {Routes, Route } from 'react-router-dom';
//import { HelmetProvider } from 'react-helmet-async'; 

//material UI
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

//own
import Login from './components/Login';
import OnlineRadio from './components/onlineRadio/OnlineRadio';
import Dashboard from './components/userPanel/Dashboard';
import AppContext from './context/App';
import SimpleNotification from './components/generales/SimpleNotification';
import Signup from './components/Signup';
import RecoverPassword from './components/RecoverPassword';
import UserVerification from './components/UserVerification';
import UserPasswordResetRequest from './components/UserPasswordResetRequest';

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
  const [notificationMsg, setNotificationMsg] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showNotification, setShowNotification] = useState(false);

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

  useEffect(() => {
    if(showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  }, [showNotification])


  if(sessionVals.isExpired) {
    return (
     <AppContext.Provider value={{blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification}}>
        <Routes value="dark">
          <Route path="/" element={<Login sessionVals={sessionVals} setSessionVals={setSessionVals} setIsLogged={setIsLogged} panel=""/>} />
          <Route path="/login" element={<Login sessionVals={sessionVals} setSessionVals={setSessionVals} setIsLogged={setIsLogged} panel=""/>} />
          <Route path="/signup" element={<Signup sessionVals={sessionVals} setSessionVals={setSessionVals} setIsLogged={setIsLogged} panel=""/>} />
          <Route path="/recoverPassword" element={<RecoverPassword sessionVals={sessionVals} setSessionVals={setSessionVals} setIsLogged={setIsLogged} panel=""/>} />
          <Route path="/userPasswordResetRequest/:id" element={<UserPasswordResetRequest sessionVals={sessionVals} setSessionVals={setSessionVals} setIsLogged={setIsLogged} panel=""/>} />
          <Route path="/userVerification/:id" element={<UserVerification sessionVals={sessionVals} setSessionVals={setSessionVals} setIsLogged={setIsLogged} panel=""/>} />
          <Route path="/radioOnline" element={<OnlineRadio />} />
        </Routes>
        {
            showNotification == true && 
              <SimpleNotification 
                message={notificationMsg}
                type={notificationType}
              />
        }
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={blockUI}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
     </AppContext.Provider> 
    )
  } else {
      return (
        <AppContext.Provider value={{blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification}}>
          <Routes>
              {
                sessionVals.userData.rol != 'E' && 
                <Fragment>
                  <Route path="/" element={<Dashboard sessionVals={sessionVals} panelName={"inicio"}/>}/>
                  <Route path="/login" element={<Dashboard sessionVals={sessionVals} panelName={"inicio"}/>}/>
                </Fragment>
              }
              {
                sessionVals.userData.rol === 'E' && 
                <Fragment>
                  <Route path="/" element={<OnlineRadio />}/>
                  <Route path="/login" element={<OnlineRadio />}/>
                </Fragment>
              }
              {
                sessionVals.userData.rol != 'E' && 
                <Route path="/dashboard">
                  <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"inicio"}/>}/>
                  <Route path="radioOnlineEmision" element={<Dashboard sessionVals={sessionVals} panelName={"emision_panel"}/>}/>
                  <Route path="estudiantes" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"estudiantes"}/>}/>
                    <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"estudiante_form"}/>}/>
                  </Route>
                  <Route path="profesores" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"profesores"}/>}/>
                    <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"profesor_form"}/>}/>
                  </Route>
                  <Route path="secciones" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"secciones"}/>}/>
                    <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"seccion_form"}/>}/>
                  </Route>
                  <Route path="pnfs" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"pnfs"}/>}/>
                    <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"pnf_form"}/>}/>
                  </Route>
                  <Route path="proyectos" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"proyectos"}/>}/>
                    <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"proyecto_form"}/>}/>
                  </Route>
                  <Route path="noticias" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"noticias"}/>}/>
                    <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"noticia_form"}/>}/>
                  </Route>
                  <Route path="categorias_noticias" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"categorias_noticias"}/>}/>
                    <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"categoria_noticia_form"}/>}/>
                  </Route>
                  <Route path="grabaciones" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"grabaciones"}/>}/>
                    <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"grabacion_form"}/>}/>
                  </Route>
                  <Route path="suscripciones" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"suscripciones"}/>}/>
                    <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"suscripcion_form"}/>}/>
                  </Route>
                  <Route path="suscripciones_web" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"suscripciones_web"}/>}/>
                    <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"suscripcion_web_form"}/>}/>
                  </Route>
                  <Route path="estadisticas" >
                      <Route path="interaccionWebsite" element={<Dashboard sessionVals={sessionVals} panelName={"interaccionWebsite"}/>}/>
                      <Route path="nVisitasWebsite" element={<Dashboard sessionVals={sessionVals} panelName={"nVisitasWebsite"}/>}/>
                      <Route path="visitasCategoriaWebsite" element={<Dashboard sessionVals={sessionVals} panelName={"visitasCategoriaWebsite"}/>}/>
                      <Route path="visitasArticuloWebsite" element={<Dashboard sessionVals={sessionVals} panelName={"visitasArticuloWebsite"}/>}/>
                      <Route path="visitasMensualesWebsite" element={<Dashboard sessionVals={sessionVals} panelName={"visitasMensualesWebsite"}/>}/>
                      <Route path="likesWebsite" element={<Dashboard sessionVals={sessionVals} panelName={"likesWebsite"}/>}/>
                      <Route path="comentariosWebsite" element={<Dashboard sessionVals={sessionVals} panelName={"comentariosWebsite"}/>}/>
                      <Route path="visitasRadioOnline" element={<Dashboard sessionVals={sessionVals} panelName={"visitasRadioOnline"}/>}/>
                      <Route path="timepoSintonizacionRadio" element={<Dashboard sessionVals={sessionVals} panelName={"timepoSintonizacionRadio"}/>}/>
                      <Route path="nSuscripcionesRadio" element={<Dashboard sessionVals={sessionVals} panelName={"nSuscripcionesRadio"}/>}/>
                  </Route>
                  <Route path="usuarios" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"usuarios"}/>}/>
                      <Route path=":id" element={<Dashboard sessionVals={sessionVals} panelName={"usuario_form"}/>}/>
                  </Route>
                  <Route path="iniciosSesion" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"inicios_sesion"}/>}/>
                  </Route>
                  <Route path="logs" >
                    <Route path="" element={<Dashboard sessionVals={sessionVals} panelName={"logs"}/>}/>
                  </Route>
                </Route>
              }
              <Route path="/radioOnline" element={<OnlineRadio />} />
          </Routes>
          {
            showNotification == true && 
              <SimpleNotification 
                message={notificationMsg}
                type={notificationType}
              />
          }
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