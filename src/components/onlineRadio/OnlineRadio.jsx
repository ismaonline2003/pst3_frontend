import { React, useState, useContext, useEffect, useRef } from 'react'
import { io } from "socket.io-client";
import axios from "axios";
import { Container, FormGroup, FormControl, InputLabel, Input, Button } from '@mui/material';
import { styled } from '@mui/system';
import consts from '../../settings/consts';
import AppContext from '../../context/App';

const ContainerComponent = styled('div')({
  padding: '20px'
});


const OnlineRadio = ({}) => {
  const [ audioBlobURL, setAudioBlobURL ] = useState("");
  //const playElement = useRef();
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
    console.log(socket.id); // undefined
  }

  socket.on("connect", onSocketConnection);
  socket.on("disconnect", onSocketDisconnection);

  return (
    <ContainerComponent>
      <Container maxWidth="sm">
        <h1>Reproductor de Radio</h1>
      </Container>
    </ContainerComponent>
  )
};

export default OnlineRadio;
