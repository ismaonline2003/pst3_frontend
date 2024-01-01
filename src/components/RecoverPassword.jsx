import { React, useState, useContext, Fragment } from 'react'
import axios from "axios";
import { Container, FormGroup, FormControl, InputLabel, Input, Button } from '@mui/material';
import { styled } from '@mui/system';
import consts from '../settings/consts';
import AppContext from '../context/App';
import styledComponents from './styled';
import PublicHeader from './PublicHeader';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Footer from './userPanel/Footer';

const ContainerComponent = styled('div')({
  padding: '20px'
});


const RecoverPassword = ({sessionVals, setSessionVals, setIsLogged}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const {blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
  const StyledH1 = styledComponents.dahsboardPanelh1;
  const [showPassword, setShowPassword] = useState(false);
  const [inputPasswordType, setInputPassowrdType] = useState('password');

  const loginValidations = () => {
    let objReturn = {status: 'success', data: {}, message: ''};
    let emailRegExp =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/g;

    if(login.trim() == '') {
      objReturn = {status: 'error', data: {}, message: 'Debe escribir un correo electrónico válido.'};
      return objReturn;
    }
    if(!emailRegExp.test(login)) {
      objReturn = {status: 'error', data: {}, message: 'El correo electrónico especificado es inválido.'};
      return objReturn;
    }
    return objReturn;
  }

  const _onLogin = (e) => {
      setLogin(e.target.value);
  }

  const _onPassword = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = () => {
    setBlockUI(true);
    const validations = loginValidations();
    if(validations.status != 'success') {
      setBlockUI(false);
      setNotificationMsg(validations.message);
      setNotificationType('error');
      setShowNotification(true);
      return;
    }
    axios.post(`${consts.backend_base_url}/api/users/login`, {
      login: login,
      password: password
    })
    .then((response) => {
      setSessionVals({
        token: response.data.token,
        expirationTime: response.data.expiration_time,
        isExpired: false,
        userData: response.data.userData
      });
      setIsLogged(true);
      setBlockUI(false);
    })
    .catch((err) => {
      setBlockUI(false);
      if(err.data) {
        setNotificationMsg(err.data.message);
      } else {
        setNotificationMsg("Ocurrió un error inesperado.. Intentelo mas tarde.");
      }
      setNotificationType('error');
      setShowNotification(true);
    });
  };

  const _handleShowPasswordBtn = (val) => {
    setShowPassword(val);
    if(showPassword) {
      setInputPassowrdType('text');
    }
    if(!showPassword) {
      setInputPassowrdType('password');
    }

  }

  return (
    <Fragment>
      <PublicHeader />
      <ContainerComponent style={{marginTop: '40px'}}>
        <Card maxWidth="sm" style={{margin: '0 auto', width: '50%', paddingTop: '40px', paddingBottom: '40px'}}>
          <CardContent>
            <FormGroup> 
              <div class="m-4 text-center">
                  <StyledH1>Registro de Usuario</StyledH1>
              </div>
              <FormControl sx={{m: '10px'}}>
                <InputLabel htmlFor="login">Correo Electrónico</InputLabel>
                <Input id="login" aria-describedby="Correo Electrónico" onChange={(e) => _onLogin(e)}/>
              </FormControl>
              <FormControl sx={{m: '20px'}}>
                <InputLabel htmlFor="password">Contraseña</InputLabel>
                <div className='w-100'>
                  <Input style={{width: '90%'}} id="password" type={inputPasswordType} aria-describedby="Contraseña" onChange={(e) => _onPassword(e)}/>
                  {
                    showPassword && 
                    <RemoveRedEyeIcon style={{fontSize: '2.2rem', marginLeft: '10px', cursor: 'pointer'}} onClick={(e) => _handleShowPasswordBtn(!showPassword)}/>
                  }
                  {
                    !showPassword && 
                    <RemoveRedEyeIcon style={{fontSize: '2.2rem', marginLeft: '10px', cursor: 'pointer'}}  onClick={(e) => _handleShowPasswordBtn(!showPassword)}/>
                  }
                </div>
              </FormControl>
            </FormGroup>
          </CardContent>
          <CardActions>
              <FormControl sx={{m: '10px'}}>
                <Button variant="contained" color="success" onClick={handleSubmit}>Iniciar Sesión</Button>
              </FormControl>
          </CardActions>
        </Card>
      </ContainerComponent>
      <Footer />
    </Fragment>
  )
};

export default RecoverPassword;
