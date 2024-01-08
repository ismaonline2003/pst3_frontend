import { React, useState, useContext, useEffect, useMemo, useRef, Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom';
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
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
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
import getEmisionFormattedDate from '../../helpers/getEmisionFormattedDate';

const ContainerComponent = styled('div')({
  padding: '20px'
});


const OnlineRadio = ({}) => {
  const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
  const [ suscriptionID, setSuscriptionID] = useState(false);
  const [ username, setUsername] = useState("");
  const [ userID, setUserID] = useState(false);
  const [ recordID, setRecordID ] = useState(false);
  const [ grid1Width, setGrid1With ] = useState(8);
  const [ grid2Width, setGrid2With ] = useState(4);
  const [ recordData, setRecordData ] = useState({});
  const [ titulo, setTitulo ] = useState("");
  const [ descripcion, setDescripcion ] = useState("");
  const [ fechaInicio, setFechaInicio ] = useState(false);
  const [ emisionTimeStr, setEmisionTimeStr ] = useState("");
  const [ currentEmisionFilenames, setCurrentEmisionFilenames ] = useState([]);
  const [ scheduledRadioAudioData, setScheduledRadioAudioData ] = useState(false);
  const [ scheduledAudioViewed, setScheduledAudioViewed ] = useState(false);
  const [ chatMessages, setChatMessages ] = useState([]);
  const [ draftMessage, setDraftMessage] = useState("");
  const [ sliderVolumeVal, setSliderVolumeVal] = useState(100);

  //const playElement = useRef();
  const emisionAudiosElement = useRef(null);
  const radioAudiosElement = useRef(null);
  const ImgIcon = styledComponents.radioOnlineIcon;
  const socket = useMemo(() =>  io(consts.ws_server_url), [recordData]);
  const scheduledAudioViewedMemo = useMemo(() =>  scheduledAudioViewed, [scheduledAudioViewed]);
  const location = useLocation();

  if(emisionAudiosElement && emisionAudiosElement.current) {
    emisionAudiosElement.current.onended = () => {
      setAudiosElementsSrc();
    }  
  }
  if(radioAudiosElement && radioAudiosElement.current) {
    radioAudiosElement.current.onended = async () => {
      setScheduledRadioAudioData(false);
    }
  }

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

  const _setSocketScheduledAudioData = (audio_data) => {
    setScheduledRadioAudioData(audio_data);
    let scheduled_audio_viewed = localStorage.getItem('scheduled_audio_viewed');
    if(!scheduled_audio_viewed || scheduled_audio_viewed === 'false') {
      localStorage.setItem('scheduled_audio_viewed', true);
      _setView('scheduled_audio', audio_data.id);
    }
  }

  const onChatMessage = (data) => {
    let newChatMessagesList = [...chatMessages];
    newChatMessagesList.push(data);
    setChatMessages(newChatMessagesList);
  }

  const onRadioAudio = async (data) => {
    try {
       /*
        const audioCtx = new AudioContext();
        console.log(data.file);
        const decodedBuffer = await audioCtx.decodeAudioData(data.file);
        const newSource =  audioCtx.createBufferSource();
        newSource.buffer = decodedBuffer;
        newSource.connect( audioCtx.destination );
        newSource.start(0);
      */

      let audio_emision_filenames = JSON.parse(localStorage.getItem('audio_emision_filenames'));
      let first_emision_audio_play_done = localStorage.getItem('first_emision_audio_play_done');
      if(audio_emision_filenames) {
        if(!audio_emision_filenames.includes(data.filename)) {
          audio_emision_filenames.push(data.filename);
          localStorage.setItem('audio_emision_filenames', JSON.stringify(audio_emision_filenames));
          if(!first_emision_audio_play_done || first_emision_audio_play_done === 'false') {
            localStorage.setItem('first_emision_audio_play_done', true);
            await setAudiosElementsSrc();;
          }
        }
      }

    } catch(err) {
      console.log(err)
    }
    
  }

  const onEmisionScheduledAudio = (data) => {
    if(data.radio_audio) {
      if(localStorage.getItem('scheduled_audio_viewed') === 'false') {
        _setSocketScheduledAudioData(data.audio_data);
      }
    }
  }

  const onSocketConnection = () => {
    const engine = socket.io.engine;
    console.log("Socket Connection"); // x8WIv7-mJelg7on_ALbx
    socket.on("radioAudio", onRadioAudio); 
    socket.on("emisionScheduledAudio", onEmisionScheduledAudio); 
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
    const formattedDate = getEmisionFormattedDate({fecha_inicio: fechaInicio});
    setEmisionTimeStr(formattedDate);
    if(fechaInicio) {
        setTimeout(() => {
            getEmissionTime();
        }, 1000);
    }
  }

  const setEmisionValues = (data) => {
    let radioEspectadorMensajes = [];
    if(data.radio_emision) {
      setRecordData(data.radio_emision);
      setRecordID(data.radio_emision.id);
      setTitulo(data.radio_emision.titulo);
      setDescripcion(data.radio_emision.descripcion);
      setFechaInicio(new Date(data.radio_emision.fecha_inicio));
      data.radio_emision.radio_espectador_mensajes.map((msg) => {
        radioEspectadorMensajes.push({
          user_id: msg.user_id,
          username: msg.username,
          content: msg.content,
          time: msg.fecha_envio
        })
      })
      setChatMessages(radioEspectadorMensajes);
    }
    if(data.emision_audio && scheduledAudioViewedMemo == false) {
      setScheduledRadioAudioData(data.emision_audio);
    }
  }

  const searchCurrentEmision = () => {
    setBlockUI(true);
    const token = localStorage.getItem('token');
    const config = {headers:{'authorization': token}};
    const url = `${consts.backend_base_url}/api/emision/api/current`;
    axios.get(url, config).then((response) => {
        console.log(response);
        setEmisionValues(response.data);
        setBlockUI(false);
    }).catch((err) => {
        if(err.response) {
          setNotificationMsg(err.response.data.message);
          setNotificationType('error');
          setShowNotification(true);
          setBlockUI(false);
        }
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

  const setAudiosElementsSrc = async () => {
    let endpoint = `getCurrentEmisionAudio`;
    let filenameList = JSON.parse(localStorage.getItem('audio_emision_filenames'));
    if(emisionAudiosElement && emisionAudiosElement.current) {
      if(filenameList.length > 0) {
        emisionAudiosElement.current.src = `${consts.backend_base_url}/api/files/${endpoint}/${filenameList[0]}`;
        localStorage.setItem('audio_emision_filenames', JSON.stringify(filenameList.filter(e => e != filenameList[0])));
        await emisionAudiosElement.current.load();
        await emisionAudiosElement.current.play();
        return;
      }
    }
    localStorage.setItem('first_emision_audio_play_done', false);
  }

  const _handleSlider = (event, newValue) => {
    setSliderVolumeVal(newValue);
    if(radioAudiosElement.current) {
      radioAudiosElement.current.volume = newValue/100;
    }
    if(emisionAudiosElement.current) {
      emisionAudiosElement.current.volume = newValue/100;
    }
  }

  
  const _setView = (type="emision", id=0) => {
    if(id != 0 && !isNaN(id)) {
      let bodyData = {};
      if(type === "emision") {
        bodyData = {is_emision: true};
      }
      if(type === "scheduled_audio") {
        bodyData = {scheduled_audio_emision_id: id, is_emision: false};
      }
      if(bodyData != {}) {
        axios.post(`${consts.backend_base_url}/api/emision/api/view`, bodyData)
        .then((response) => {
         console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
      }
    }
  }

  useEffect(() => {
    try {
      if(scheduledRadioAudioData) {
        if(radioAudiosElement && radioAudiosElement.current && !scheduledAudioViewedMemo) {
            radioAudiosElement.current.src = `${consts.backend_base_url}/api/files/currentScheduledRadioAudio`;
            radioAudiosElement.current.currentTime = scheduledRadioAudioData.audio_played_current_time;
            radioAudiosElement.current.load();
            radioAudiosElement.current.play();
            localStorage.setItem('scheduled_audio_viewed', true);
            setScheduledAudioViewed(true);
        }
      } else {
        if(radioAudiosElement && radioAudiosElement.current) {
          radioAudiosElement.current.src = "";
          localStorage.setItem('scheduled_audio_viewed', false);
          setScheduledAudioViewed(false);
        }
      }
    } catch( err) {
      setScheduledRadioAudioData(false);
      localStorage.setItem('scheduled_audio_viewed', false);
      setScheduledAudioViewed(false);
    }
  }, [scheduledRadioAudioData]);


  useEffect(() => {
    if(!recordID) {
      setGrid1With(12);
      setGrid2With(0);
    }
    if(recordID) {
      setGrid1With(8);
      setGrid2With(4);
    }
  }, [recordID]);


  useEffect(() => {
    getEmissionTime();
  }, [fechaInicio]);

  useEffect(() => {
    searchCurrentEmision();
    setUsersVals();
    localStorage.setItem('first_emision_audio_play_done', false);
  }, []);

  if(socket) {
    const audio_emision_filenames = localStorage.getItem('audio_emision_filenames');
    if(!audio_emision_filenames) {
      localStorage.setItem('audio_emision_filenames', JSON.stringify([]));
    }
    socket.on("connect", onSocketConnection);
    socket.on("disconnect", onSocketDisconnection);
  }

  return (
    <Fragment>
      <OnlineRadioNavbar userID={userID}/>
      <ContainerComponent>
        <Container maxWidth="md">
        <Grid Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={grid1Width}>
              <br />
              <h1 style={{'color': '#00b0ff', 'fontSize': '40px', 'fontWeight': '700'}}>Radio Online</h1>
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
                    <Grid item xs={2} className="text-left">
                      <ImgIcon src={IconButton} alt="React Logo" className="radio-online-icon"/>
                    </Grid>
                    <Grid item xs={10} className="text-right p-0 m-0">
                      {
                        scheduledRadioAudioData && !recordID &&
                        <Fragment>
                          <h2 style={{'color': 'white', 'fontSize': '1.6rem', backgroundColor: 'rgba(0, 0, 0, .5)', padding: '10px', borderRadius: '5px'}}>
                            {scheduledRadioAudioData.radio_audio.author.name} - {scheduledRadioAudioData.radio_audio.title}
                          </h2>
                        </Fragment>
                        
                      }
                      {
                        recordID &&
                        <Fragment>
                          <div style={{backgroundColor: 'rgba(0, 0, 0, .5)', padding: '10px', borderRadius: '5px'}}>
                            <h2 style={{'color': 'white', 'fontSize': '1.6rem'}}>
                              {emisionTimeStr}
                            </h2>
                            <br />
                              {
                                scheduledRadioAudioData &&
                                <h2 style={{'color': 'white', 'fontSize': '1.2rem'}}>
                                {scheduledRadioAudioData.radio_audio.author.name} - {scheduledRadioAudioData.radio_audio.title}
                                </h2>
                              }
                          </div>
                          <audio ref={emisionAudiosElement} type="audio/mp3" className='d-none'></audio>
                          <audio ref={radioAudiosElement} type="audio/mp3" className='d-none'></audio>
                        </Fragment>
                      }
                      {
                        !recordID &&
                        <audio ref={radioAudiosElement} type="audio/mp3"></audio>
                      }
                      <div className="d-flex justify-between flex-row w-100 items-center mt-4">
                        <VolumeDown />
                          <Slider sx={{width: '80%', marginLeft: '20px', marginRight: '20px', padding: '0 !important'}} aria-label="Volúmen" value={sliderVolumeVal} onChange={_handleSlider} />
                        <VolumeUp />
                      </div>
                    </Grid>
                  </Grid>
              </Container>
              <br />
              <div className='text-justify'>
                <h2 style={{'fontSize': '25px', 'fontWeight': '700', 'color': '#424242'}}>{titulo}</h2>
                <br />
                {
                  descripcion &&
                  parser(descripcion)
                }
              </div>
          </Grid>
          {
            recordID &&
            <Grid item xs={grid2Width} className="text-left">
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
          }
        </Grid>
        </Container>
      </ContainerComponent>
    </Fragment>
  )
};

export default OnlineRadio;
