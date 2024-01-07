import * as React from 'react';
import { useState, useEffect } from 'react';
//styledComponents
import styledComponents from '../../styled';
//consts
import consts from '../../../settings/consts'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';

const defaultMicrophoneIconColor = 'primary';
const defaultMicrophoneIconStyles = {fontSize: '4rem'};
const hoverMicrophoneIconStyles = {fontSize: '5rem', transition: '.3s ease all', cursor: 'pointer', borderRadius: '50%'};


export default function CanalesAudio({emisionState, socket}) {
    console.log('emisionState', emisionState);
    const StyledH2 = styledComponents.dahsboardPanelh2;
    const [ canalesList, setCanalesList] = useState([{
        id: `canal-audio-1`,
        nro: 1,
        device_id: "",
        active: false,
        currentDataAvailable: []
    }]);
    const [ selectedCanalID, setSelectedCanalID] = useState(false);
    const [ wsObj, setWswsObj ] = useState(undefined);
    const [ microphoneIconStyles, setMicrophoneIconStyles ] = useState(defaultMicrophoneIconStyles);
    const [ microphoneIconColor, setMicrophoneIconColor ] = useState(defaultMicrophoneIconColor);

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
                        }, 5000);
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

    const _onClickKeyboardVoiceIcon = (canal) => {
        if(canal) {
            activarDispositivo(canal.id);
            setSelectedCanalID(canal.id);
            setMicrophoneIconColor('error');
        }
    }

    const _onMouseOverKeyboardVoiceIcon = (e) => {
        setMicrophoneIconStyles(hoverMicrophoneIconStyles);
        if(!selectedCanalID) {
            setMicrophoneIconColor('warning');
        }
    }

    const _onMouseOutKeyboardVoiceIcon = (e) => {
        setMicrophoneIconStyles(defaultMicrophoneIconStyles);
        if(!selectedCanalID) {
            setMicrophoneIconColor('primary');
        }
    }

    return (
        <React.Fragment>
            <div className='d-flex justify-center text-center'>
                {
                    emisionState == 'online'  &&
                    <KeyboardVoiceIcon style={microphoneIconStyles} 
                        variant="contained" 
                        color={microphoneIconColor}
                        disableElevation 
                        onMouseOver={(e) => _onMouseOverKeyboardVoiceIcon(e)}
                        onMouseOut={(e) => _onMouseOutKeyboardVoiceIcon(e)}
                        onClick={(e) => _onClickKeyboardVoiceIcon(canalesList[0])}
                    >
                        Activar
                    </KeyboardVoiceIcon>
                }
            </div>
            <br />
        </React.Fragment>
    );
}
