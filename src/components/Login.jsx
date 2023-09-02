import { React, useState, useContext } from 'react'
import axios from "axios";
import { Container, FormGroup, FormControl, InputLabel, Input, Button } from '@mui/material';
import { styled } from '@mui/system';
import consts from '../settings/consts';
import AppContext from '../context/App';

const ContainerComponent = styled('div')({
  padding: '20px'
});


const Login = ({sessionVals, setSessionVals, setIsLogged}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const {blockUI, setBlockUI} = useContext(AppContext);

  const _onLogin = (e) => {
    setLogin(e.target.value);
  }

  const _onPassword = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = () => {
    setBlockUI(true);
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
      console.log(err);
      setBlockUI(false);
    });
  };

  return (
    <ContainerComponent>
      <Container maxWidth="sm">
        <FormGroup>
          <FormControl sx={{m: '10px'}}>
            <InputLabel htmlFor="login">Correo Electrónico</InputLabel>
            <Input id="login" aria-describedby="Correo Electrónico" onChange={(e) => _onLogin(e)}/>
          </FormControl>
          <FormControl sx={{m: '10px'}}>
            <InputLabel htmlFor="password">Contraseña</InputLabel>
            <Input id="password" aria-describedby="Contraseña" onChange={(e) => _onPassword(e)}/>
          </FormControl>
          <FormControl sx={{m: '10px'}}>
            <Button variant="contained" color="success" onClick={handleSubmit}>Iniciar Sesión</Button>
          </FormControl>
        </FormGroup>
      </Container>
    </ContainerComponent>
  )
};

export default Login;
