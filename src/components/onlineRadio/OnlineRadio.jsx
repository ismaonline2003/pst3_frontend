import { React, useState, useContext, useEffect, useRef } from 'react'
import { io } from "socket.io-client";
import axios from "axios";
import styledComponents from '../styled';
import { Container, FormGroup, FormControl, InputLabel, Input, Button } from '@mui/material';
import { styled } from '@mui/system';
import consts from '../../settings/consts';
import AppContext from '../../context/App';
import IconButton from '../../icons/radio-online-icon.svg'
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

const ContainerComponent = styled('div')({
  padding: '20px'
});


const OnlineRadio = ({}) => {
  const [ audioBlobURL, setAudioBlobURL ] = useState("");
  //const playElement = useRef();
  const H1 = styledComponents.radioOnlineh1;
  const ImgIcon = styledComponents.radioOnlineIcon;
  const socket = io(consts.ws_server_url);
  const sendMessage = () => {
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

  const onSocketConnection = () => {
    const engine = socket.io.engine;
    console.log("Socket Connection"); // x8WIv7-mJelg7on_ALbx
    socket.on("radioAudio", onRadioAudio); 
  };

  const onSocketDisconnection = () => {
    console.log("onSocketDisconnection");
    console.log(socket.id); // undefined
  }

  socket.on("connect", onSocketConnection);
  socket.on("disconnect", onSocketDisconnection);

  return (
    <ContainerComponent>
      <Container maxWidth="md">
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={8}>
            <br />
            <h1 style={{'color': '#00b0ff', 'fontSize': '40px', 'fontWeight': '700'}}>AgroOnline UPTCMS</h1>
            <br />
            <div>
              <Button variant="contained" color="success">Suscribete</Button>
            </div>
            <br />
            <Container maxWidth="xl" className="bg-teal-300  p-6 rounded-md">
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={6} className="text-left">
                    <ImgIcon src={IconButton} alt="React Logo" className="radio-online-icon"/>
                  </Grid>
                  <Grid item xs={6} className="text-right p-0 m-0">
                  <h2 style={{'color': 'white', 'fontSize': '50px'}}>29:54</h2>
                  </Grid>
                </Grid>
            </Container>
            <br />
            <div className='text-justify'>
              <h2 style={{'fontSize': '25px', 'fontWeight': '700', 'color': '#424242'}}>Descripción</h2>
              <p>
              <br />
              Lorem ipsum dolor sit amet consectetur adipiscing elit lectus, donec tellus dui litora vehicula felis cursus mus elementum, at rutrum libero augue a sodales senectus. Commodo tortor porttitor nunc vitae tellus convallis facilisi phasellus, sapien penatibus dictumst conubia ad tristique urna donec laoreet, mollis nascetur iaculis nisl dui pellentesque hac. Gravida non tellus malesuada dui ridiculus leo semper sem, interdum et nisl hendrerit donec conubia senectus praesent lectus, convallis purus odio ligula sociis duis ultricies.
                <br />
                <br />
              Odio pharetra montes torquent hac dis tempor molestie at ultrices augue ad, auctor nascetur arcu vel placerat vivamus mi tellus donec egestas. Dis at hac magna orci fermentum eros commodo nisi enim, potenti integer pulvinar eu interdum praesent sodales himenaeos. Maecenas nullam facilisis enim nascetur magna turpis aliquet morbi ultricies curabitur fusce consequat interdum purus hac duis litora, varius habitant tristique nulla phasellus malesuada rutrum ante senectus hendrerit mollis donec in fermentum vestibulum mauris.
              <br />
              </p>
            </div>
        </Grid>
        <Grid item xs={4} className="text-left">
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
              <h3 className='font-bold'>Chat En Vivo</h3>
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <div>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Usuario 1
                    </Typography>
                    {" — Me encantan la naturaleza"}
                  </div>
                }
              />
            </ListItem>
            <Divider/>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <div>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Usuario 2
                    </Typography>
                    {" — Tremenda Canción"}
                  </div>
                }
              />
            </ListItem>
            <Divider/>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <div>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Usuario 3
                    </Typography>
                    {" — Que opinan sobre la explotación de los recursos naturales en el Esquibo?"}
                  </div>
                }
              />
            </ListItem>
            <Divider/>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <div>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Usuario 4
                    </Typography>
                    {" — Holaaa"}
                  </div>
                }
              />
            </ListItem>
            <Divider/>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <div>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Usuario 4
                    </Typography>
                    {" — Me puedes dar algunas recomendaciones para mantener mi jardin?"}
                  </div>
                }
              />
            </ListItem>
            <Divider/>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <div>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Usuario 5
                    </Typography>
                    {" — Saludos cordiales"}
                  </div>
                }
              />
            </ListItem>
            <Divider/>
            <br />
            <ListItem alignItems="flex-start">
                <div className="w-100 p-0">
                  <TextField
                      id="textarea-chat"
                      label="Mensaje"
                      multiline
                      rows={4}
                      variant="filled"
                      defaultValue="Escribe tu Mensaje"
                      className='w-100'
                    />
                    <br />
                    <br />
                    <Button variant="contained" color="info" endIcon={<SendIcon />}>
                      Enviar
                    </Button>
                </div>
            </ListItem>
          </List>
        </Grid>
      </Grid>
      </Container>
    </ContainerComponent>
  )
};

export default OnlineRadio;
