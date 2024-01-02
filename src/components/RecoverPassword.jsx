import { React, useState, useContext, Fragment } from 'react';
import axios from "axios";

//material UI
import { Container, FormGroup, FormControl, InputLabel, Input, Button } from '@mui/material';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
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


const RecoverPassword = ({sessionVals, setSessionVals, setIsLogged}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const {blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
  const StyledH1 = styledComponents.dahsboardPanelh1;
  const StyledH2 = styledComponents.dahsboardPanelh2;
  const StyledH2Success = styledComponents.dahsboardPanelh2Success;
  const [inputPasswordType, setInputPassowrdType] = useState('password');
  const [status, setStatus] = useState('draft');


  const RequestValidations = () => {
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

  const handleSubmit = () => {
    setBlockUI(true);
    const validations = RequestValidations();
    const url = `${consts.backend_base_url}/api/users/api/passwordResetRequest/${login}`;
    if(validations.status != 'success') {
      setBlockUI(false);
      setNotificationMsg(validations.message);
      setNotificationType('error');
      setShowNotification(true);
      return;
    }
    axios.get(url)
    .then((response) => {
      setStatus('success');
      setBlockUI(false);
    })
    .catch((err) => {
      if(err.response.status == 404) {
        setStatus('not_found');
      }
      if(err.response.status == 400) {
        setStatus('already_exists');
      }
      if(err.response.status == 500) {
        setStatus('error');
      }
      setBlockUI(false);
    });
  }

  return (
    <Fragment>
      <PublicHeader />
      <ContainerComponent style={{marginTop: '40px'}}>
        <Card maxWidth="sm" style={{margin: '0 auto', width: '50%', paddingTop: '40px', paddingBottom: '40px'}}>
          <CardContent>
            {
              status == 'draft' &&
              <FormGroup> 
                <div class="m-4 text-center">
                    <StyledH1>Recuperar Contraseña</StyledH1>
                </div>
                <FormControl sx={{m: '10px'}}>
                  <InputLabel htmlFor="login">Correo Electrónico</InputLabel>
                  <Input id="login" aria-describedby="Correo Electrónico" onChange={(e) => setLogin(e.target.value)}/>
                </FormControl>
              </FormGroup>
            }
            {
                status == 'success' &&
                <div className='text-center'>
                    <img src={SuccessIcon} alt="success-icon" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                    <StyledH2Success className='mt-5'>La solicitud ha sido creada satisfactoriamente!!</StyledH2Success>
                    <p>El siguiente paso es acceder al enlace enviado a su correo electrónico</p>
                </div>
            }
            {
                status == 'not_found' &&
                <div className='text-center'>
                    <img src={noEncontrado} alt="success-icon" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                    <StyledH2 className='mt-5'>El usuario no fue encontrado</StyledH2>
                    <p>Verifíque su correo electrónico, recargue la pagina y escriba el correo electrónico nuevamente</p>
                </div>
            }
            {
                status == 'already_exists' &&
                <div className='text-center'>
                    <img src={SuccessIcon} alt="success-icon" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                    <StyledH2Success className='mt-5'>El usuario ya tiene una solicitud de recuperación de contraseña abierta</StyledH2Success>
                    <p>Se ha vuelto a enviar a su correo electronico un mail con la solicitud de recuperación de contraseña</p>
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
          {
              status == 'draft' &&
              <CardActions>
                <FormControl sx={{m: '10px'}}>
                  <Button variant="contained" color="success" onClick={handleSubmit}>Enviar</Button>
                </FormControl>
              </CardActions>
          }
        </Card>
      </ContainerComponent>
      <Footer />
    </Fragment>
  )
};

export default RecoverPassword;
