import { React, useState, useContext, useEffect, Fragment } from 'react'
import axios from "axios";
import { Link } from "react-router-dom";

//material UI
import { Container, FormGroup, FormControl, InputLabel, Input, Button,TextField, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

//own
import getFormattedDate from '../helpers/getFormattedDate';
import personaFieldsValidations from '../helpers/personaFieldsValidations';
import consts from '../settings/consts';
import AppContext from '../context/App';
import styledComponents from './styled';
import PublicHeader from './PublicHeader';
import Footer from '../components/userPanel/Footer';
import SuccessIcon from '../icons/success.png';

const ContainerComponent = styled('div')({
  padding: '20px'
});

const ci_vals = [
  {
    value: 'V',
    label: 'V',
  },
  {
    value: 'J',
    label: 'J',
  },
  {
    value: 'E',
    label: 'E',
  },
  {
      value: 'P',
      label: 'P',
  }
];

const sexo_vals = [
  {
    value: 'M',
    label: 'Masculino'
  },
  {
    value: 'F',
    label: 'Femenino'
  }
];


const Signup = ({sessionVals, setSessionVals, setIsLogged}) => {
    //utilities
    const {blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2Success = styledComponents.dahsboardPanelh2Success;
    //ui fields
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthdate, setBirthdate] = useState("");
    const [sexo, setSexo] = useState("M");
    const [address, setAddress] = useState("");
    const [ci_type, setCiType] = useState("V");
    const [ci, setCI] = useState("");
    const [ fieldsWidth, setFieldsWidth ] = useState({});

    //logic
    const [showPassword, setShowPassword] = useState(false);
    const [inputPasswordType, setInputPassowrdType] = useState('password');
    const [ registerSuccess , setRegisterSuccess ] = useState(false);

    //responsive web design
    const theme = useTheme();
    const XSmatches = useMediaQuery(theme.breakpoints.up('xs'));
    const SMmatches = useMediaQuery(theme.breakpoints.up('sm'));
    const MDmatches = useMediaQuery(theme.breakpoints.up('md'));
    const LGmatches = useMediaQuery(theme.breakpoints.up('lg'));
    const XLmatches = useMediaQuery(theme.breakpoints.up('xl'));

    
    const _getFieldsWidth = () => {
      if(XSmatches) {
          setFieldsWidth({
              ciType: '95%',
              ci: '95%',
              name: '95%',
              lastname: '95%',
              birthdate: '95%',
              sexo: '95%',
          });
      }

      if(SMmatches) {
          setFieldsWidth({
              ciType: '95%',
              ci: '95%',
              name: '95%',
              lastname: '95%',
              birthdate: '95%',
              sexo: '95%',
          });
      }

      if(MDmatches) {
          setFieldsWidth({
              ciType: '95%',
              ci: '95%',
              name: '95%',
              lastname: '95%',
              birthdate: '95%',
              sexo: '95%',
          });
      }

      if(LGmatches) {
        setFieldsWidth({
            ciType: '30%',
            ci: '60%',
            name: '45%',
            lastname: '45%',
            birthdate: '60%',
            sexo: '30%',
        });
      }

      if(XLmatches) {
          setFieldsWidth({
              ciType: '30%',
              ci: '65%',
              name: '47%',
              lastname: '47%',
              birthdate: '65%',
              sexo: '30%',
          });
      }
  }

    useEffect(() => {
      _getFieldsWidth();
    }, []);

  const signupValidations = () => {
    let objReturn = {status: 'success', data: {}, message: ''};
    const emailRegExp =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/g;
    const specialCharactersAllowed = /[!@#$%&*?]/;
    const personaData = {
      ci_type: ci_type,
      ci: ci,
      name: name,
      lastname: lastname,
      phone: phone,
      address: address,
      birthdate: birthdate,
      sexo: sexo
    };
    const personaValidations = personaFieldsValidations(personaData);

    if(personaValidations.status != 'success') {
      return personaValidations;
    }

    if(login.trim() == "") {
      objReturn = {'status': 'failed', 'data': {}, 'msg': 'Se debe definir un email valido para el usuario.'};
      return objReturn;
    }
    
    setLogin(login);

    if(!emailRegExp.test(login)) {
        objReturn = {status: 'failed', data: {}, msg: 'El correo electrónico especificado es inválido.'};
        return objReturn;
    }

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
    objReturn.data = {personData: personaData, userData: {login: login, password: password}};
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
    const validations = signupValidations();
    if(validations.status != 'success') {
      setBlockUI(false);
      setNotificationMsg(validations.msg);
      setNotificationType('error');
      setShowNotification(true);
      return;
    }
    axios.post(`${consts.backend_base_url}/api/users/signup`, validations.data)
    .then((response) => {
      setRegisterSuccess(true);
      setBlockUI(false);
    })
    .catch((err) => {
      setBlockUI(false);
      if(err.response.data) {
        setNotificationMsg(err.response.data.message);
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
                {
                !registerSuccess && 
                <div class="text-center">
                  <StyledH1>Registro de Usuario</StyledH1>
                </div>
                }
                {
                  !registerSuccess &&
                  <div className='w-100 m-4 d-flex flex-row flex-wrap'>
                    <FormControl sx={{m:'10px', width: fieldsWidth.name}}>
                      <InputLabel htmlFor="name">Nombre</InputLabel>
                      <Input id="name" aria-describedby="Nombre" onChange={(e) => setName(e.target.value)}/>
                    </FormControl>
                    <FormControl sx={{m:'10px', width: fieldsWidth.lastname}}>
                      <InputLabel htmlFor="lastname">Apellido</InputLabel>
                      <Input id="lastname" aria-describedby="Apellido" onChange={(e) => setLastName(e.target.value)}/>
                    </FormControl>
                    <FormControl sx={{m:'10px', width: fieldsWidth.ciType}}>
                      <TextField id="ci_type" variant="standard" select label="Tipo de Cédula" defaultValue={ci_type ? ci_type : "V"} onChange={(e) => setCiType(e.target.value)}>
                          {ci_vals.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                              </MenuItem>
                          ))}
                      </TextField >
                    </FormControl>
                    <FormControl sx={{m:'10px', width: fieldsWidth.ci}}>
                      <InputLabel htmlFor="ci">Cédula</InputLabel>
                      <Input id="ci" aria-describedby="Cédula" onChange={(e) => setCI(e.target.value)}/>
                    </FormControl>
                    <FormControl sx={{m:'10px', width: fieldsWidth.sexo}}>
                      <TextField id="sexo_options" variant="standard" select label="Sexo" defaultValue={sexo ? sexo : "M"} onChange={(e) => setSexo(e.target.value)}>
                          {sexo_vals.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                              </MenuItem>
                          ))}
                      </TextField >
                    </FormControl>
                    <FormControl sx={{m:'10px', width: fieldsWidth.birthdate}}>
                        <TextField id="birthdate" variant="standard" label="Fecha Nacimiento" type="date" defaultValue={'1990-01-01'} onChange={(e) => setBirthdate(new Date(e.target.value))}/>
                    </FormControl>
                    <FormControl sx={{m:'10px', width: '95%'}}>
                        <InputLabel htmlFor="phone">Teléfono</InputLabel>
                        <Input id="phone" aria-describedby="Teléfono" onChange={(e) => setPhone(e.target.value)}/>
                    </FormControl>
                    <FormControl sx={{m:'10px', width: '95%'}}>
                      <InputLabel htmlFor="address">Dirección</InputLabel>
                      <Input id="address" aria-describedby="Dirección" onChange={(e) => setAddress(e.target.value)}/>
                    </FormControl>
                    <FormControl sx={{m: '10px', width: '95%'}}>
                      <InputLabel htmlFor="login">Correo Electrónico</InputLabel>
                      <Input id="login" aria-describedby="Correo Electrónico" onChange={(e) => _onLogin(e)}/>
                    </FormControl>
                    <FormControl sx={{m: '10px', marginTop: '20px', width: '95%'}}>
                      <InputLabel htmlFor="password">Contraseña</InputLabel>
                      <div className='w-100'>
                          <Input style={{width: '90%', padding: '10px'}} id="password" type={inputPasswordType} aria-describedby="Contraseña" onChange={(e) => _onPassword(e)}/>
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
                  </div>
                }
                {
                  registerSuccess &&
                  <div className='text-center'>
                      <img src={SuccessIcon} alt="success-icon" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                      <StyledH2Success className='mt-5'>El usuario ha sido registrado exitosamente!!</StyledH2Success>
                      <p>El paso final es la verificación de su usuario. Para cumplir con este paso, debe ingresar al enlace que hemos enviado a su correo electrónico.</p>
                      <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                          <Link to={"/login"}>
                              <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Iniciar Sesión</Button>
                          </Link>
                      </div>
                  </div>
                }
                
            </FormGroup>
          </CardContent>
            {
              !registerSuccess && 
              <CardActions className='d-flex justify-around p-4'>
                <Button variant="contained" color="success" onClick={handleSubmit}>Enviar</Button>
                <Link to={"/login"}>
                  <Button variant="contained" color="primary">Volver</Button>
                </Link>
              </CardActions>
            }
        </Card>
      </ContainerComponent>
      <Footer />
    </Fragment>
  )
};

export default Signup;
