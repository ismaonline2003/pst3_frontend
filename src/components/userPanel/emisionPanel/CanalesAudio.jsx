import * as React from 'react';
import { useState } from 'react';
//styledComponents
import styledComponents from '../../styled';
//consts
import consts from '../../../settings/consts'
//tabla
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
//botones
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
//web socket
import { io } from "socket.io-client";


export default function CanalesAudio({}) {
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const [ canalesList, setCanalesList] = useState([]);
    const [ wsObj, setWswsObj ] = useState(undefined);
    const socket = io(consts.ws_server_url);
    const onSocketConnection = () => {
      const engine = socket.io.engine;
      console.log("Socket Connection"); 
      // x8WIv7-mJelg7on_ALbx
      //socket.on("radio_audio", onRadioAudio); 
    };

    const onSocketDisconnection = () => {
      console.log(socket.id); // undefined
    }

    socket.on("connect", onSocketConnection);
    socket.on("disconnect", onSocketDisconnection);
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

    const activarDispositivo = (canalID) => {    
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            let canal = canalesList.filter(value => value.id == canalID);
            if(stream.id) {
                if(canal.length > 0) {
                    let dataAvailable = {};
                    canal[0].device_id = stream.id;
                    canal[0].device_media_recorder = new MediaRecorder(stream);

                    canal[0].device_media_recorder.ondataavailable = function (ev) {
                        dataAvailable = ev.data;
                    }

                    canal[0].device_media_recorder.onstop = (ev) => {

                        if(canal[0].active == true) {
                            let audioData = new Blob([dataAvailable],{ 'type': 'audio/mp3;' });
                            audioData.arrayBuffer().then((buffer) => {
                                socket.emit('MicroAudio', {'audioData': buffer});
                                dataAvailable = {};
                                canal[0].device_media_recorder.start();
                            })
                        }

                    }

                    canal[0].device_media_recorder.onstart = (ev) => {
                        setTimeout(() => {
                            canal[0].device_media_recorder.stop();
                        }, 9000);
                    }

                    canal[0].device_media_recorder.start();
                    canal[0].active = true;
                }
            }
          })
          .catch((err) => {
            console.log(err.name, err.message, err.cause);
          });
    };

    const eliminarCanal = (id) => {
        let newCanalesList = [];
        let i = 0;
        canalesList.map((item, index) => {
            if(item.id != id) {
                i += 1;
                newCanalesList.push({
                    id:`canal-audio-${i}`,
                    nro: i,
                    device_id: "",
                    active: false,
                    currentDataAvailable: []
                });
            }
        });
        setCanalesList(newCanalesList);
    };

    const agregarCanal = () => {
        let newCanalesList = [...canalesList];
        newCanalesList.push({
            id: `canal-audio-${canalesList.length+1}`,
            nro: canalesList.length+1,
            device_id: "",
            active: false,
            currentDataAvailable: []
        });
        setCanalesList(newCanalesList);
    };

    React.useEffect(() => {
        let localStorageCanalesAudio = localStorage.getItem('canalesAudio');
        if(![null, '', undefined].includes(localStorageCanalesAudio)) {
            setCanalesList(JSON.parse(localStorageCanalesAudio));
        }
    }, [])

    return (
        <React.Fragment>
            <StyledH1>Canales de Dispositivos de Audio</StyledH1>
            <br />
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell align="center">#</TableCell>
                    <TableCell align="center">Activar</TableCell>
                    <TableCell align="center">Eliminar</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {canalesList.map((row) => (
                    <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="center">{row.nro}</TableCell>
                        <TableCell align="center">
                            {/*
                                <Button variant="contained" disableElevation color="warning">
                                    Activar Dispositivo
                                </Button>
                                <AudioRecorder 
                                    onRecordingComplete={addAudioElement}
                                    showVisualizer={true}
                                    audioTrackConstraints={{
                                        noiseSuppression: true,
                                        echoCancellation: true,
                                    }} 
                                    downloadFileExtension="mp3"
                                />
                            */}

                            <Button variant="contained" disableElevation color="warning" onClick={(e) => activarDispositivo(row.id)}>
                                Activar
                            </Button>
                        </TableCell>
                        <TableCell align="center">
                            <IconButton aria-label="delete" onClick={(e) => eliminarCanal(row.id)}>
                                <DeleteIcon/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow
                    key={"add-canal-audio-row"}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right">
                            <Fab color="primary" aria-label="add"  onClick={(e) => agregarCanal()}>
                                <AddIcon />
                            </Fab>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </TableContainer>
        </React.Fragment>
    );
}
