import * as React from 'react';
import { useState, useContext, useEffect, memo, useCallback, Fragment } from 'react';
import axios from "axios";

//web socket
import { io } from "socket.io-client";

//Materia UI
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import SubjectIcon from '@mui/icons-material/Subject';
//text editor
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from '@tiptap/extension-text-align';
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField
} from "mui-tiptap";


//own
import styledComponents from '../../styled';
import ListaCanciones from './ListaCanciones';
import CanalesAudio from './CanalesAudio';
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import getEmisionFormattedDate from '../../../helpers/getEmisionFormattedDate';

TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
});
const extensions = [StarterKit, Document, Heading, Paragraph, TextAlign]
const defaultContent = `<p>Hola</p>`;


export default function EmisionPanel({}) {
    const StyledH1 = styledComponents.dahsboardPanelh1;

    const [recordData, setRecordData] = useState({});
    const [ titulo, setTitulo ] = useState("");
    const [ descripcion, setDescripcion ] = useState("Hola Mundo!!");
    const [ fechaInicio, setFechaInicio ] = useState(false);
    const [ state, setState ] = useState("offline");
    const [ emisionID, setEmisionID ] = useState(false);
    const [ emisorID, setEmisorID] = useState(false);
    const [ currentUserID, setCurrentUserID] = useState(false);
    const [ emisionTimeStr, setEmisionTimeStr ] = useState("");
    const editor = useEditor({extensions,defaultContent});
    const socket = io(consts.ws_server_url);
    const [ cancionesList, setCancionesList ] = useState([]);
    const [ onlineTime, setOnlineTime] = useState("");
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);

    if(editor) {
        editor.setEditable(descripcion);
    }

    
    const setEmisionValues = (data) => {
        setRecordData(data);
        setEmisionID(data.id);
        setEmisorID(data.id_emisor);
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setFechaInicio(new Date(data.fecha_inicio));
        setState('online');
    }

    const searchCurrentEmision = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{'authorization': token}};
        const url = `${consts.backend_base_url}/api/grabacion/api/emisionActual`;
        axios.get(url, config).then((response) => {
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

    const _recordValidations = () => {
        let objReturn = {'status': 'success', 'data': {}, 'msg': ''};
        if(titulo.trim() == "") {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'La emisión de radio debe tener un título válido'};
            return objReturn;
        }
        if(descripcion.trim() == "") {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'La emisión de radio debe tener una descripción válida'};
            return objReturn;
        }
        return objReturn;
    }

    const _handleiniciarEmisionBtn = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const validations = _recordValidations();
        if(validations.status != 'success') {
            setNotificationMsg(validations.msg);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
            return;
        }
        let body = {
            titulo: titulo,
            descripcion: editor.getHTML(),
            status_actual: "en_emision"
        };
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/grabacion`;
        axios.post(url, body, config).then((response) => {
            //set record data
            setEmisionValues(response.data);
            setNotificationMsg("La emisión ha sido iniciada exitosamente!!");
            setNotificationType('success');
            setShowNotification(true);
            setBlockUI(false);
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const _handleBtnActualizar = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const validations = _recordValidations();
        if(validations.status != 'success') {
            setNotificationMsg(validations.msg);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
            return;
        }
        let body = {
            titulo: titulo,
            descripcion: editor.getHTML()
        };
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/grabacion/${emisionID}`;
        axios.put(url, body, config).then((response) => {
            //set record data
            setNotificationMsg("Los datos de la emisión ha sido actualizada exitosamente!!");
            setNotificationType('success');
            setShowNotification(true);
            setBlockUI(false);
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const _handleBtnFinalizar = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/grabacion/api/finalizar/${emisionID}`;
        console.log(url);
        axios.get(url, config).then((response) => {
            //set record data
            setState('offline');
            setNotificationMsg("La emisión ha sido finalizada exitosamente!!");
            setNotificationType('success');
            setShowNotification(true);
            setBlockUI(false);
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const setEditorContent = () => {
        if (!editor || editor.isDestroyed) {
            return;
        }
        if (!editor.isFocused || !editor.isEditable) {
            if(descripcion != "") {
                queueMicrotask(() => {
                    const currentSelection = editor.state.selection;
                    editor
                    .chain()
                    .setContent(descripcion)
                    .setTextSelection(currentSelection)
                    .run();
                });
            }
        }
    }

    const getEmissionTime = () => { 
        const formattedDate = getEmisionFormattedDate({fecha_inicio: fechaInicio});
        setEmisionTimeStr(formattedDate);
        if(state == 'online') {
            setTimeout(() => {
                getEmissionTime();
            }, 1000);
        }
    }

    useEffect(() => {
        getEmissionTime();
    }, [fechaInicio]);


    useEffect(() => {
        setEditorContent();
    }, [descripcion]);

    const onSocketConnection = () => {
        const engine = socket.io.engine;
        console.log("Socket Connection"); 
    };
  
    const onSocketDisconnection = () => {
      console.log(socket.id); // undefined
    }

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        searchCurrentEmision();
        setCurrentUserID(userData.id);
        socket.on("connect", onSocketConnection);
        socket.on("disconnect", onSocketDisconnection);
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }, []);

    return (
        <React.Fragment>
            <br />
            <StyledH1>Emisión de Radio</StyledH1>
            <br />
            { 
                state == 'offline' && 
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Stack spacing={2} direction="row">
                            <Button variant="contained" color="primary" onClick={(e) => _handleiniciarEmisionBtn()}>Iniciar Emisión</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={3} className="text-center">
                        <Button variant="outlined" color="primary" size="large">Offline</Button>
                    </Grid>
                </Grid>
            }
            { 
                state == 'online' && currentUserID == emisorID &&
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Stack spacing={2} direction="row">
                            <Button variant="contained" color="success" onClick={(e) => _handleBtnActualizar()}>Actualizar</Button>
                            <Button variant="contained" color="error" onClick={(e) => _handleBtnFinalizar()}>Finalizar</Button>
                            <Button variant="contained" color="primary">Notificaciones</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={3} className="text-center">
                        <Button variant="outlined" color="success" size="large">En vivo</Button>
                    </Grid>
                    <Grid item xs={3} className="text-right">
                        <p style={{'fontSize': '30px', 'color': 'red', 'fontWeight': '700'}}>{emisionTimeStr}</p>
                    </Grid>
                </Grid>
            }
            { 
                state == 'online' && currentUserID != emisorID &&
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Button variant="outlined" color="success" size="large">En vivo</Button>
                    </Grid>
                    <Grid item xs={3} className="text-center">
                    </Grid>
                    <Grid item xs={3} className="text-right">
                        <p style={{'fontSize': '30px', 'color': 'red', 'fontWeight': '700'}}>{emisionTimeStr}</p>
                    </Grid>
                </Grid>
            }
            <br />
            <br />
            <br />
            <div className='d-flex flex-row flex-wrap'>
                <CanalesAudio emisionState={state} socket={socket}/>
            </div>
            <br />
            <br />
            <div className='d-flex flex-row flex-wrap'>
                <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                    <TextField id="titulo" label="Título" variant="outlined" value={titulo} onChange={(e) => setTitulo(e.target.value)}/>
                </FormControl>
            </div>
            <div className='d-flex flex-row flex-wrap p-2'>
                <RichTextEditorProvider editor={editor}>
                    <RichTextField
                        controls={
                            <MenuControlsContainer>
                                <MenuSelectHeading />
                                <MenuDivider />
                                <MenuButtonBold />
                                <MenuButtonItalic />
                                <MenuDivider />
                                {
                                    <Fragment>
                                        <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                                            <FormatAlignLeftIcon  style={{color: 'rgba(0, 0, 0, 0.54)'}} />
                                        </button>
                                        <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                                            <FormatAlignCenterIcon style={{color: 'rgba(0, 0, 0, 0.54)'}}  />
                                        </button>
                                        <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                                            <FormatAlignLeftIcon style={{color: 'rgba(0, 0, 0, 0.54)'}}  />
                                        </button>
                                        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
                                            <FormatAlignJustifyIcon  style={{color: 'rgba(0, 0, 0, 0.54)'}} />
                                        </button>
                                        <button onClick={() => editor.chain().focus().setTextAlign().run()}>
                                            <SubjectIcon style={{color: 'rgba(0, 0, 0, 0.54)'}}  />
                                        </button>
                                    </Fragment>
                                }
                                <MenuDivider />
                                {/* Add more controls of your choosing here */}
                            </MenuControlsContainer>
                        }
                    />
                </RichTextEditorProvider>
            </div>
            <br />
            {
                /*
                <ListaCanciones cancionesList={cancionesList} setCancionesList={setCancionesList}/>
                */
            }
        </React.Fragment>
    );
}

