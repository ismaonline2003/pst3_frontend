import { React, useState, useContext, Fragment, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import axios from "axios";
//material UI
import { Container, FormGroup, FormControl, InputLabel, Input, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/system';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

//own
import consts from '../settings/consts';
import AppContext from '../context/App';
import styledComponents from './styled';
import PublicHeader from './PublicHeader';
import Footer from './userPanel/Footer';
import SuccessIcon from '../icons/success.png';
import noEncontrado from '../icons/no-encontrado.jpg';
import error500 from '../icons/error-500.jpg';

const ContainerComponent = styled('div')({
  padding: '20px'
});


const UserPasswordResetRequest = ({sessionVals, setSessionVals, setIsLogged}) => {
    const {blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;
    const StyledH2Success = styledComponents.dahsboardPanelh2Success;
    const { id } = useParams();

    //ui
    //password
    const [password, setPassword] = useState('');  
    const [showPassword, setShowPassword] = useState(false);
    const [inputPasswordType, setInputPasswordType] = useState('password');
    //password repeated
    const [passwordRepeated, setPasswordRepeated] = useState('');  
    const [showPasswordRepeated, setShowPasswordRepeated] = useState(false);
    const [inputPasswordRepeatedType, setInputPasswordRepeatedType] = useState('password');  

    const [status, setStatus] = useState('draft');
    const [hash, setHash] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


  const passwordValidations = () => {
    let objReturn = {status: 'success', data: {}, msg: ''};
    const specialCharactersAllowed = /[!@#$%&*?]/;
    if(password.length < 12) {
        objReturn = {status: 'failed', data: {}, msg: 'La contraseña debe tener un mínimo 12 caracteres.'};
        return objReturn;
    }

    if(/\s/.test(password)) {
        objReturn = {status: 'failed', data: {}, msg: 'La contraseña no puede tener espacios en blanco.'};
        return objReturn;
    }

    if(!/[A-Z]/.test(password)) {
        objReturn = {status: 'failed', data: {}, msg: 'La contraseña debe tener al menos una letra mayúscula.'};
        return objReturn;
    }

    if(!/[a-z]/.test(password)) {
        objReturn = {status: 'failed', data: {}, msg: 'La contraseña debe contener letras minusculas.'};
        return objReturn;
    }

    if(!/\d/.test(password)) {
        objReturn = {status: 'failed', data: {}, msg: 'La contraseña debe contener al menos un caracter numérico.'};
        return objReturn;
    }

    if(!specialCharactersAllowed.test(password)) {
        objReturn = {status: 'failed', data: {}, msg: `La contraseña debe contener al menos uno de los siguientes caracteres especiales: !@#$%&*?`};
        return objReturn;
    }

    if(password != passwordRepeated) {
        objReturn = {status: 'failed', data: {}, msg: `Ambas contraseñas deben ser iguales.`};
        return objReturn;
    }
    return objReturn;
  }

  const handleSubmit = () => {
    setBlockUI(true);
    const validations = passwordValidations();
    const url = `${consts.backend_base_url}/api/users/passwordReset`;
    const body = {
        id: id,
        hash: hash,
        password: password,
        password_repeated: passwordRepeated
    }
    if(validations.status != 'success') {
      setBlockUI(false);
      setNotificationMsg(validations.msg);
      setNotificationType('error');
      setShowNotification(true);
      return;
    }
    axios.post(url, body)
    .then((response) => {
      setStatus('success');
      setBlockUI(false);
    })
    .catch((err) => {
      if(err.response.status == 404) {
        setStatus('not_found');
      }
      if(err.response.status == 400) {
        setStatus('error');
        setErrorMessage(err.response.data.message);
      }
      if(err.response.status == 500) {
        setStatus('error');
      }
      setBlockUI(false);
    });
  }

  const _onPassword = (e) => {
    setPassword(e.target.value);
  }

  const _handleShowPasswordBtn = () => {
    const boolVal = !showPassword;
    if(boolVal) {
        setInputPasswordType('text');
    }
    if(!boolVal) {
        setInputPasswordType('password');
    }
    setShowPassword(boolVal);
  }

  const _handleShowPasswordRepeatedBtn = () => {
    const boolVal = !showPasswordRepeated;
    if(boolVal) {
        setInputPasswordRepeatedType('text');
    }
    if(!boolVal) {
        setInputPasswordRepeatedType('password');
    }
    setShowPasswordRepeated(boolVal);
  }

  return (
    <Fragment>
      <PublicHeader />
      <ContainerComponent style={{marginTop: '40px'}}>
        <Card width="sm" style={{margin: '0 auto', width: '50%', paddingTop: '40px', paddingBottom: '40px'}}>
          <CardContent>
            {
                status == 'draft' &&
                <FormGroup> 
                    <div className="m-4 text-center">
                        <StyledH1>Recuperar Contraseña</StyledH1>
                        <br />
                        <p>Indique la nueva contraseña en los siguientes campos</p>
                    </div>
                    <FormControl sx={{marginTop: '20px'}}>
                        <InputLabel htmlFor="password">Contraseña</InputLabel>
                        <div className='w-100'>
                        <Input style={{width: '90%', padding: '10px'}} id="password" type={inputPasswordType} aria-describedby="Contraseña" onChange={(e) => setPassword(e.target.value)}/>
                        {
                            showPassword && 
                            <VisibilityOffIcon style={{fontSize: '2.2rem', marginLeft: '10px', cursor: 'pointer'}} onClick={(e) => _handleShowPasswordBtn()}/>
                        }
                        {
                            !showPassword && 
                            <RemoveRedEyeIcon style={{fontSize: '2.2rem', marginLeft: '10px', cursor: 'pointer'}}  onClick={(e) => _handleShowPasswordBtn()}/>
                        }
                        </div>
                    </FormControl>
                    <FormControl sx={{marginTop: '20px'}}>
                        <InputLabel htmlFor="password">Repita la Contraseña</InputLabel>
                        <div className='w-100'>
                        <Input style={{width: '90%', padding: '10px'}} id="password_repeated" type={inputPasswordRepeatedType} aria-describedby="Contraseña Repetida" onChange={(e) => setPasswordRepeated(e.target.value)}/>
                        {
                            showPasswordRepeated && 
                            <VisibilityOffIcon style={{fontSize: '2.2rem', marginLeft: '10px', cursor: 'pointer'}} onClick={(e) => _handleShowPasswordRepeatedBtn()}/>
                        }
                        {
                            !showPasswordRepeated && 
                            <RemoveRedEyeIcon style={{fontSize: '2.2rem', marginLeft: '10px', cursor: 'pointer'}}  onClick={(e) => _handleShowPasswordRepeatedBtn()}/>
                        }
                        </div>
                    </FormControl>
                </FormGroup>
            }
            {
                status == 'success' &&
                <div className='text-center'>
                    <img src={SuccessIcon} alt="success-icon" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                    <StyledH2Success className='mt-5'>La recuperación de contraseña ha sido exitosa!!</StyledH2Success>
                    <p>Para iniciar sesión presione el botón que se encuentra debajo de este mensaje.</p>
                    <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                        <Link to={"/login"}>
                            <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Iniciar Sesión</Button>
                        </Link>
                    </div>
                </div>
            }
            {
                status == 'not_found' &&
                <div className='text-center'>
                    <img src={noEncontrado} alt="success-icon" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                    <StyledH2 className='mt-5'>La solicitud de recuperación de contraseña no ha sido encontrada</StyledH2>
                    <p>Para abrir una nueva solicitud, presione el botón que se encuentra debajo de este mensaje.</p>
                    <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                        <Link to={"/recoverPassword"}>
                            <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Recuperar Contraseña</Button>
                        </Link>
                    </div>
                </div>
            }
            {
                status == 'error' &&
                <div className='text-center'>
                    <img src={error500} alt="success-icon" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                    <StyledH2Success className='mt-5'>{errorMessage}</StyledH2Success>
                    <p>Para abrir una nueva solicitud, presione el botón que se encuentra debajo de este mensaje.</p>
                    <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                        <Link to={"/recoverPassword"}>
                            <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Recuperar Contraseña</Button>
                        </Link>
                    </div>
                </div>
            }
            {
                status == 'error' &&
                <div className='text-center'>
                    <img src={error500} alt="success-icon" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                    <StyledH2 className='mt-5'>Ocurrió un error inesperado</StyledH2>
                    <p>Vuelva a intentarlo mas tarde</p>
                </div>
            }
          </CardContent>
          <CardActions className='d-flex flex-row justify-center'>
            {
                status == 'draft' &&
                <Button variant="contained" color="success" onClick={handleSubmit}>Enviar</Button>
            }
          </CardActions>
        </Card>
      </ContainerComponent>
      <Footer />
    </Fragment>
  )
};

export default UserPasswordResetRequest;
