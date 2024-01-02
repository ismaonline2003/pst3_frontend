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


const OnlineRadio = ({}) => {
  const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
  const [ audioBlobURL, setAudioBlobURL ] = useState("");
  const [ suscriptionID, setSuscriptionID] = useState(false);
  const [ username, setUsername] = useState("");
  const [ userID, setUserID] = useState(false);
  const [ recordData, setRecordData ] = useState({});
  const [ titulo, setTitulo ] = useState("");
  const [ descripcion, setDescripcion ] = useState("");
  const [ fechaInicio, setFechaInicio ] = useState(false);
  const [ emisionTimeStr, setEmisionTimeStr ] = useState("");
  const [ chatMessages, setChatMessages ] = useState([]);
  const [ draftMessage, setDraftMessage] = useState("");

  //const playElement = useRef();
  const H1 = styledComponents.radioOnlineh1;
  const ImgIcon = styledComponents.radioOnlineIcon;
  const socket = useMemo(() =>  io(consts.ws_server_url), [recordData]);

  const messageValidations = () => {
    let objReturn = {'status': 'success', 'data': {}, 'msg': ''};
    let userMsgs = chatMessages.filter((msg) => msg.user_id === userID);
    if(draftMessage.trim() == "") {
        objReturn = {'status': 'failed', 'data': {}, 'msg': 'Debe escribir algo en el mensaje'};
        return objReturn;
    }
    if(draftMessage.length > 256) {
        objReturn = {'status': 'failed', 'data': {}, 'msg': 'El mensaje no puede tener más de 256 caracteres'};
        return objReturn;
    }
    if(userMsgs.length > 0) {
      userMsgs.sort((a, b) => {
        return new Date(a.time) < new Date(b.time)
      });
      let currentDatetime = new Date();
      let lastMessageDatetime = new Date(userMsgs[0].time);
      let targetDatetime = new Date(lastMessageDatetime.setSeconds(lastMessageDatetime.getSeconds()+30));
      if(currentDatetime < targetDatetime) {
        objReturn = {'status': 'failed', 'data': {}, 'msg': 'Debe esperar 30 segundos para enviar el siguiente mensaje'};
        return objReturn;
      }
    }
    return objReturn;
  }

  const sendMessage = (e) => {
    const validations = messageValidations();
    if(validations.status != 'success') {
      setNotificationMsg(validations.msg);
      setNotificationType('warning');
      setShowNotification(true);
      return;
    }
    socket.emit("newMessage", { user_id: userID, username: username, content: draftMessage});
    setDraftMessage("");
  }

  const onRadioAudio = (data) => {
    const audioCtx = new AudioContext();
    audioCtx.decodeAudioData(data.file, function(decodedBuffer) {
      console.log(decodedBuffer);
      var newSource = audioCtx.createBufferSource();
      newSource.buffer = decodedBuffer;
      newSource.connect( audioCtx.destination );
      newSource.start(0);
    }, function(error) {
      console.log(error);
    });
  }

  const onChatMessage = (data) => {
    let newChatMessagesList = [...chatMessages];
    console.log(newChatMessagesList);
    newChatMessagesList.push(data);
    setChatMessages(newChatMessagesList);
  }

  const onSocketConnection = () => {
    const engine = socket.io.engine;
    console.log("Socket Connection"); // x8WIv7-mJelg7on_ALbx
    socket.on("radioAudio", onRadioAudio); 
    socket.on("messages", onChatMessage); 
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  };

  const onSocketDisconnection = () => {
    console.log("onSocketDisconnection");
    console.log(socket.id); // undefined
  }

  const getEmissionTime = () => { 
    if(fechaInicio) {
        const currentTime = new Date();
        const diff = currentTime.getTime() - fechaInicio.getTime();
        const secondsDiff = diff/ 1000;
        const minutesDiff = secondsDiff/60;
        const hourDiff = minutesDiff/60;
        let hoursInt = parseInt(`${hourDiff}`.split('.')[0]);
        let minutesInt = parseInt(`${minutesDiff}`.split('.')[0]);
        let hours = hoursInt;
        let minutes = parseInt(minutesDiff - (hoursInt*60));
        let seconds = parseInt(secondsDiff - (minutesInt*60));

        if(hours < 10) {
            hours = `0${hours}`;
        }

        if(minutes < 10) {
            minutes = `0${minutes}`;
        }

        if(seconds < 10) {
            seconds = `0${seconds}`;
        }
        setEmisionTimeStr(`${hours}:${minutes}:${seconds}`);
        setTimeout(() => {
            getEmissionTime();
        }, 1000);
    }
}

  const setEmisionValues = (data) => {
    let radioEspectadorMensajes = [];
    setRecordData(data);
    setTitulo(data.titulo);
    setDescripcion(data.descripcion);
    setFechaInicio(new Date(data.fecha_inicio));
    data.radio_espectador_mensajes.map((msg) => {
      radioEspectadorMensajes.push({
        user_id: msg.user_id,
        username: msg.username,
        content: msg.content,
        time: msg.fecha_envio
      })
    })
    setChatMessages(radioEspectadorMensajes);
  }

  const searchCurrentEmision = () => {
    setBlockUI(true);
    const token = localStorage.getItem('token');
    const config = {headers:{'authorization': token}};
    const url = `${consts.backend_base_url}/api/emision/api/current`;
    axios.get(url, config).then((response) => {
        console.log(response);
        if(response.data) {
            setEmisionValues(response.data);
        }
        setBlockUI(false);
    }).catch((err) => {
        setNotificationMsg(err.response.data.message);
        setNotificationType('error');
        setShowNotification(true);
        setBlockUI(false);
    });
  }

  const setUsersVals = () => {
    let userData = localStorage.getItem('userData');
    if(userData != '{}') {
      userData = JSON.parse(userData);
      if(userData) {
        const activeSuscriptionsFiltered = userData.suscripcions.filter(s => s.activa);
        setUsername(`${userData.person.name.toLowerCase()}_${userData.person.lastname.toLowerCase()}_${userData.id}`);
        setUserID(userData.id);
        console.log(activeSuscriptionsFiltered);
        if(activeSuscriptionsFiltered.length > 0) {
          setSuscriptionID(activeSuscriptionsFiltered[0].id);
        }
      }
    }
  }

  const _handleBtnSuscribe = () => {
    if(!userID) {
      setNotificationMsg("Debe iniciar sesión para suscribirse");
      setNotificationType('warning');
      setShowNotification(true);
      return;
    }

    axios.post(`${consts.backend_base_url}/api/emision/api/suscribe`, {user_id: userID, username: username})
    .then((response) => {
      //logica
      let userData = JSON.parse(localStorage.getItem('userData'));
      userData.suscripcions.push(response.data);
      localStorage.setItem('userData', JSON.stringify(userData));
      setSuscriptionID(response.data.id);
      setNotificationMsg("Su suscripción ha sido registrada exitosamente");
      setNotificationType('success');
      setShowNotification(true);
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
  }

  const _handleBtnUnsuscribe = () => {
    if(!userID) {
      setNotificationMsg("Debe iniciar sesión para cancelar la suscripción");
      setNotificationType('warning');
      setShowNotification(true);
      return;
    }

    axios.post(`${consts.backend_base_url}/api/emision/api/unsuscribe`, {id: suscriptionID})
    .then((response) => {
      let userData = JSON.parse(localStorage.getItem('userData'));
      for(let i = 0; i < userData.suscripcions.length; i++) {
        if(userData.suscripcions[i].id == suscriptionID) {
          userData.suscripcions[i].activa = false;
        }
      }
      localStorage.setItem('userData', JSON.stringify(userData));
      setSuscriptionID(false);
      setNotificationMsg("Usted ha cancelado su suscripción ha exitosamente");
      setNotificationType('success');
      setShowNotification(true);
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
  }

  useEffect(() => {
    getEmissionTime();
  }, [fechaInicio]);

  useEffect(() => {
    searchCurrentEmision();
    setUsersVals();
  }, []);

  if(socket) {
    socket.on("connect", onSocketConnection);
    socket.on("disconnect", onSocketDisconnection);
  }

  return (
    <Fragment>
      <OnlineRadioNavbar userID={userID}/>
      <ContainerComponent>
        <Container maxWidth="md">
        <Grid Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={8}>
              <br />
              <h1 style={{'color': '#00b0ff', 'fontSize': '40px', 'fontWeight': '700'}}>AgroOnline UPTCMS</h1>
              <br />
              <div>
                {
                  !suscriptionID &&
                  <Button variant="contained" color="success" onClick={(e) => _handleBtnSuscribe()}>Suscribete</Button>
                }
                {
                  userID && suscriptionID &&
                  <Button variant="contained" color="error" onClick={(e) => _handleBtnUnsuscribe()}>Cancelar Suscripción</Button>
                }
              </div>
              <br />
              <Container maxWidth="xl" className="bg-teal-300  p-6 rounded-md">
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6} className="text-left">
                      <ImgIcon src={IconButton} alt="React Logo" className="radio-online-icon"/>
                    </Grid>
                    <Grid item xs={6} className="text-right p-0 m-0">
                    <h2 style={{'color': 'white', 'fontSize': '50px'}}>{emisionTimeStr}</h2>
                    </Grid>
                  </Grid>
              </Container>
              <br />
              <div className='text-justify'>
                <h2 style={{'fontSize': '25px', 'fontWeight': '700', 'color': '#424242'}}>{titulo}</h2>
                <br />
                {parser(descripcion)}
              </div>
          </Grid>
          <Grid item xs={4} className="text-left">
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem alignItems="flex-start" key={"chat_message_title"}>
                <h3 className='font-bold'>Chat En Vivo</h3>
              </ListItem>
              {
                chatMessages.map((message) => {
                  return (
                    <Fragment>
                      <ListItem alignItems="flex-start" key={message.id}>
                        <ListItemText
                          secondary={
                            <div>
                              <Typography
                                sx={{ display: 'inline', fontWeight: '700'}}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {message.username}
                              </Typography>
                              <br></br>
                              {message.content}
                            </div>
                          }
                        />
                      </ListItem>
                      <Divider/>
                    </Fragment>
                  )
                })
              }
              <br />
              <ListItem alignItems="flex-start">
                    {
                      userID &&
                      <div className="w-100 p-0">
                        <TextField
                          id="textarea-chat"
                          label="Enviar Mensaje"
                          multiline
                          rows={4}
                          variant="filled"
                          value={draftMessage}
                          className='w-100'
                          onChange={(e) => setDraftMessage(e.target.value)}
                        />
                        <br />
                        <br />
                        <Button variant="contained" color="info" endIcon={<SendIcon />} onClick={(e) => sendMessage(e)}>
                          Enviar
                        </Button>
                      </div>
                    }
                    {
                      !userID &&
                      <div className="w-100 p-0">
                        <TextField
                          id="textarea-chat"
                          label="Inicie Sesión para enviar un mensaje"
                          disabled
                          multiline
                          rows={4}
                          variant="filled"
                          className='w-100'
                        />
                        <br />
                        <br />
                        <Link to={"/login"} target='_blank'>
                          <Button variant="contained" color="primary">
                            Iniciar Sesión
                          </Button>
                        </Link>
                      </div>
                    }
              </ListItem>
            </List>
          </Grid>
        </Grid>
        </Container>
      </ContainerComponent>
    </Fragment>
  )
};

export default OnlineRadio;
