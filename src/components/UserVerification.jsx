import { React, useState, useContext, Fragment, useEffect } from 'react';
import axios from "axios";
import { useParams, Link } from 'react-router-dom';

//material UI
import { Container, FormGroup, FormControl, InputLabel, Input, Button,TextField, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

//own
import consts from '../settings/consts';
import AppContext from '../context/App';
import styledComponents from './styled';
import PublicHeader from './PublicHeader';
import Footer from '../components/userPanel/Footer';
import SuccessIcon from '../icons/success.png';
import noEncontrado from '../icons/no-encontrado.jpg';
import error500 from '../icons/error-500.jpg';

const ContainerComponent = styled('div')({
  padding: '20px'
});


const UserVerification = ({sessionVals, setSessionVals, setIsLogged}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const {blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
  const StyledH1 = styledComponents.dahsboardPanelh1;
  const StyledH2 = styledComponents.dahsboardPanelh2;
  const StyledH2Success = styledComponents.dahsboardPanelh2Success;
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('draft');
  const { id } = useParams();

  const SearchRecordUser = () => {
    setBlockUI(true);
    if(!id) {
        setStatus('not_found');
        setBlockUI(false);
        return;
    }
    const url = `${consts.backend_base_url}/api/users/api/userVerification/${id}`;
    console.log(url);
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
            setStatus('verified_already');
        }
        if(err.response.status == 500) {
            setStatus('error');
        }
        setBlockUI(false);
    });
  };

  useEffect(() => {
    SearchRecordUser();
  }, [])

  return (
    <Fragment>
      <PublicHeader />
      <ContainerComponent style={{marginTop: '40px'}}>
        <Card maxWidth="sm" style={{margin: '0 auto', width: '50%', paddingTop: '40px', paddingBottom: '40px'}}>
          <CardContent>
            {
                status == 'success' &&
                <div className='text-center'>
                    <img src={SuccessIcon} alt="success-icon" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                    <StyledH2Success className='mt-5'>Su usuario ha sido verificado satisfactoriamente!!</StyledH2Success>
                    <p>Para iniciar sesión, presione el botón que se encuentra debajo</p>
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
                    <StyledH2 className='mt-5'>Su usuario no fue encontrado</StyledH2>
                    <p>Verifíque el enlace suministrado vía correo electrónico</p>
                </div>
            }
            {
                status == 'verified_already' &&
                <div className='text-center'>
                    <img src={SuccessIcon} alt="success-icon" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                    <StyledH2Success className='mt-5'>Su usuario ya habia sido verificado previamente.</StyledH2Success>
                    <p>Para iniciar sesión, presione el botón que se encuentra debajo</p>
                    <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                        <Link to={"/login"}>
                            <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Iniciar Sesión</Button>
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
        </Card>
      </ContainerComponent>
      <Footer />
    </Fragment>
  )
};

export default UserVerification;
