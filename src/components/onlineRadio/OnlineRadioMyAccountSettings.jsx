import { React, useState, useContext, useEffect, useMemo, Fragment } from 'react'
import { Link } from 'react-router-dom';
import parser from 'html-react-parser';
import axios from "axios";

//material ui
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { Container, FormGroup, FormControl, InputLabel, Input, Button } from '@mui/material';
import { styled } from '@mui/system';

//socket io
import { io } from "socket.io-client";

//own
import styledComponents from '../styled';
import consts from '../../settings/consts';
import AppContext from '../../context/App';
import IconButton from '../../icons/radio-online-icon.svg'
import OnlineRadioNavbar from './OnlineRadioNavbar';


const ContainerComponent = styled('div')({
  padding: '20px'
});


const OnlineRadioMyAccountSettings = ({}) => {
  const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);

  //const playElement = useRef();
  const H1 = styledComponents.radioOnlineh1;
  const [ userID, setUserID] = useState(false);

  useEffect(() => {
    let userData = localStorage.getItem('userData');
    if(userData != '{}') {
      userData = JSON.parse(userData);
      if(userData) {
        setUserID(userData.id);
      }
    }
  }, []);


  return (
    <Fragment>
      <OnlineRadioNavbar userID={userID}/>
      <ContainerComponent>
        <Container maxWidth="md">
        </Container>
      </ContainerComponent>
    </Fragment>
  )
};

export default OnlineRadioMyAccountSettings;