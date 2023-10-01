import { React, useState, useContext, useEffect, useRef } from 'react'
import { io } from "socket.io-client";
import axios from "axios";
import styledComponents from '../styled';
import { Container, FormGroup, FormControl, InputLabel, Input, Button } from '@mui/material';
import { styled } from '@mui/system';
import consts from '../../settings/consts';
import AppContext from '../../context/App';
import IconButton from '../../icons/radio-online-icon.svg'

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
      <Container maxWidth="sm">
        <H1>Radio Ecológica</H1>
        <br />
        <Container maxWidth="xl" className="bg-teal-400  p-6 rounded-md">
            <h2>Hola Mundo!!</h2>
            <ImgIcon src={IconButton} alt="React Logo" className="radio-online-icon"/>
        </Container>
      </Container>
    </ContainerComponent>
  )
};

export default OnlineRadio;
