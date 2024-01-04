import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import axios from "axios";

//material UI
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

//own
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import audioValidations from '../../../helpers/audioValidations';
import FormBtns from '../FormBtns';
import styledComponents from '../../styled'
import FormContainer from '../FormContainer'
import noEncontrado from '../../../icons/no-encontrado.jpg'
import DeleteDialog from '../../generales/DeleteDialog';

const source_vals = [
    {
      value: 'yt',
      label: 'Youtube',
    },
    {
      value: 'local',
      label: 'Computadora'
    }
];

const type_vals = [
    {
      value: 'cancion',
      label: 'Canción',
    },
    {
      value: 'record',
      label: 'Grabación'
    }
];

const source_labels = {
    yt: 'Youtube',
    local: 'Computadora'
}

const type_labels = {
    cancion: 'Canción',
    record: 'Grabación'
}


const RadioAudioForm = ({}) => {
    //logic
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [reLoad, setReload] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showFormBtns, setShowFormBtns] = useState(true);
    const [showEditBtn, setShowEditBtn] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog ] = useState(false);
    const [recordFound, setRecordFound] = useState(false);
    const [newId, setNewId] = useState(0);
    const { id } = useParams();
    const [unlockFields, setUnlockFields] = useState(false);

    //bd values
    const [recordData, setRecordData] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [source, setSource] = useState("yt");
    const [type, setType] = useState("cancion");
    const [ytUrl, setYtUrl] = useState("");
    const [filename, setFilename] = useState("");
    const [file, setFile] = useState(undefined);
    const [autorID, setAutorID] = useState(false);
    const [autor, setAutor] = useState(false);
    const [autores, setAutores] = useState([]);
    const [autorSearchVal, setAutorSearchVal] = useState("");
    const audioFile = useRef(null);

    //Ui fields
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;

    if(audioFile && audioFile.current) {
        audioFile.current.onchange = (e) => {
            const validations = audioValidations(e.target.files[0]);
            if(validations.status != 'success') {
                setNotificationMsg(validations.msg);
                setNotificationType('error');
                setShowNotification(true);
                e.target.value = "";
            } else {
                setFile(e.target.files[0]);
            }
        } 
    }

    const _setRecordData = (data) => {
        setRecordData(data);
        setTitulo(data.title);
        setSource(data.source);
        setType(data.type);
        setFilename(data.filename);
        setAutorID(data.id_autor);
        setAutor(data.author.name);
        setYtUrl(data.yt_url);
    }

    const recordValidations = () =>  {
        let objReturn = {'status': 'success', 'data': {}, 'msg': ''};
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        if(titulo.trim() == "") {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'Se debe definir un titulo para el audio.'};
            return objReturn;
        }
        if(source === 'local') {
            if(audioFile.current.files.length == 0) {
                objReturn = {'status': 'failed', 'data': {}, 'msg': 'Cuando la fuente es "Computadora" debe hacer la carga del audio.'};
                return objReturn;
            }
        }
        return objReturn;
    }

    const searchRecord = () => {
        setBlockUI(true);
        if(id != "0") {
            const token = localStorage.getItem('token');
            const config = {headers:{ authorization: token}};
            let url = `${consts.backend_base_url}/api/radio_audio/${id}`;
            axios.get(url, config).then((response) => {
                _setRecordData(response.data);
                setRecordFound(true);
                setBlockUI(false);
            }).catch((err) => {
                if(err.response.status == 404) {
                    setRecordFound(false);
                } else {
                    setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
                    setNotificationType('error');
                    setShowNotification(true);
                }
                setBlockUI(false);
            });
        } else {
            setRecordFound(true);
            setUnlockFields(true);
            setBlockUI(false);
        }
    }

    const updateRecordData = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const body = {
            title: titulo,
            id_autor: autorID,
            source: source,
            type: type,
            yt_url: ytUrl
        };
        const config = {headers:{'authorization': token}};
        const url = `${consts.backend_base_url}/api/radio_audio/${id}`;
        axios.put(url, body, config).then((response) => {
            setTimeout(() => {
                window.location.reload(true);
            }, 500);
            setBlockUI(false);
            setNotificationMsg(response.data.message);
            setNotificationType('success');
            setShowNotification(true);
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const createRecord = async () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        let body = {
            title: titulo,
            id_autor: autorID,
            source: source,
            type: type,
            yt_url: ""
        };

        if(source === 'yt') {
            body.yt_url = ytUrl;
        }

        if(source === 'local') {
            formData.append('file', audioFile.current.files[0]);
        }
        formData.append('data', JSON.stringify(body));

        const config = {headers: {'authorization': token, 'Content-Type': 'multipart/form-data'}};
        const url = `${consts.backend_base_url}/api/radio_audio`;
        try {
            const response = await axios.post(url, formData, config);
            //set record data
            setNotificationMsg("El audio fue registrado exitosamente!!");
            setNotificationType('success');
            setShowNotification(true);
            setNewId(response.data.id);
            setReload(true);
            setBlockUI(false);
            setTimeout(() => {
                window.location.reload(true);
            }, 500);
            return true;
        } catch(err) {
            setRecordFound(true);
            setBlockUI(false);
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            return false;
        }
    }

    const handleConfirmarBtn = async () => {
        let confirmarBtnReturn = {'status': 'success', 'message': '', 'data': {}};
        confirmarBtnReturn = recordValidations();
        if(confirmarBtnReturn.status == 'success') {
            if(recordData != false) {
                updateRecordData();
            } else {
                const createRecordRes = await createRecord();
                if(!createRecordRes) {
                    confirmarBtnReturn = {'status': 'error', 'message': '', 'data': {}};
                }
            }
        }
        return confirmarBtnReturn;
    }

    const handleCancelarBtn = (e) => {
        if(id != '0') {
            _setRecordData(recordData);
        } else {
            setRedirect(true);
        }
    }

    const handleDeleteBtn = () => {
        setShowDeleteDialog(true);
    }

    const handleDeleteConfirm = (e) => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{'authorization': token}};
        const url = `${consts.backend_base_url}/api/radio_audio/${id}`;
        axios.delete(url, config).then((response) => {
            setBlockUI(false);
            setNotificationMsg(response.data.message);
            setNotificationType('success');
            setShowNotification(true);
            setShowFormBtns(false);
            setTimeout(() => {
                setRedirect(true);
            }, 5000);
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const searchAutorRecords = () => {
        if(autorSearchVal) {
            const token = localStorage.getItem('token');
            const config = {headers:{ authorization: token}};
            let url = `${consts.backend_base_url}/api/autor?value=${autorSearchVal}&parameter=name&limit=25`;
            axios.get(url, config).then((response) => {
                setAutores(response.data);
                setRecordFound(true);
                setBlockUI(false);
            }).catch((err) => {
                if(err.response.status == 404) {
                    setRecordFound(false);
                } else {
                    setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
                    setNotificationType('error');
                    setShowNotification(true);
                }
                setBlockUI(false);
            });
        } else {
            setAutores([]);
        }
    }

    useEffect(() => {
        searchRecord();
        if(id === '0') {
            setShowEditBtn(true);
        }
    }, []);

    useEffect(() => {
        searchAutorRecords();
    }, [autorSearchVal]);

    return (
        <div className='m-4'>
            {
                id == '0' && recordFound && 
                <div className='text-center mb-10'>
                    <StyledH1>Registrar un Nuevo Audio de Radio</StyledH1>
                </div>
            }
            {
                id != '0' && recordFound &&
                <div className='text-center mb-10'>
                    <StyledH1>Actualizar Audio de Radio</StyledH1>
                </div>
            }
            {
                recordFound && showFormBtns && 
                <FormBtns 
                    setUnlockFields={setUnlockFields} 
                    handleConfirmarBtn={handleConfirmarBtn} 
                    handleCancelarBtn={handleCancelarBtn} 
                    showEditBtn={showEditBtn}
                    deleteApplies={true}
                    handleDeleteBtn={handleDeleteBtn}
                />
            }
            {
                reLoad && <Navigate to={`/dashboard/radioAudio/${newId}`} />
            }
            {
                redirect && <Navigate to="/dashboard/radioAudio" />
            }
            {
                recordFound && 
                <FormContainer>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="titulo" label="Titulo" disabled variant="outlined" value={titulo}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="titulo" label="Titulo" variant="outlined" defaultValue={titulo} onChange={(e) => setTitulo(e.target.value)}/>
                            </FormControl>
                        }
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="autor" label="Autor" disabled variant="outlined" value={autor}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '40%' }} variant="outlined">
                                <TextField id="autor_search" label="Autor Busqueda" variant="outlined" onMouseLeave={(e) => setAutorSearchVal(e.target.value)}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '50%' }} variant="outlined">
                                <TextField id="autor" select label="Autores" defaultValue={autorID ? autorID : ""} onChange={(e) => setAutorID(e.target.value)}>
                                    {autores.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        }
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            id != '0' &&
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="source" label="Fuente" disabled variant="outlined" value={source_labels[source]}/>
                            </FormControl>
                        }
                        {
                            unlockFields && id == '0' &&
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="source" select label="Fuente" defaultValue={source ? source : "yt"} onChange={(e) => setSource(e.target.value)}>
                                    {source_vals.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        }
                        {
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="type" label="Tipo" disabled variant="outlined" value={type_labels[type]}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="type" select label="Tipo" defaultValue={type ? type : "cancion"} onChange={(e) => setType(e.target.value)}>
                                    {type_vals.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        }
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            source == 'yt' && id != '0' &&
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="yt_url" label="Url de Youtube" disabled variant="outlined" value={ytUrl}/>
                            </FormControl>
                        }
                        {
                            unlockFields && id == '0' && source == 'yt' &&
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="yt_url" label="Url de Youtube" variant="outlined" onChange={(e) => setYtUrl(e.target.value)}/>
                            </FormControl>
                        }
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            unlockFields && id == '0' && source == 'local' &&
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <input type="file" id="audio_file" ref={audioFile}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                        hover:cursor-pointer
                                    "
                                />
                            </FormControl>
                        }
                    </div>
                </FormContainer>
            }
            {
                showDeleteDialog &&
                <DeleteDialog showDeleteDialog={showDeleteDialog} setShowDeleteDialog={setShowDeleteDialog} handleDeleteConfirm={handleDeleteConfirm}></DeleteDialog>
            }
            {
                (!recordFound && id != 0) && 
                <FormContainer>
                    <div className='text-center'>
                        <img src={noEncontrado} alt="no-encontrado" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                        <StyledH2 className='mt-5'>El Audio de Radio no fue encontrado</StyledH2>
                        <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                            <Link to={"/dashboard/radioAudio"}>
                                <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Volver</Button>
                            </Link>
                        </div>
                    </div>
                </FormContainer>
            }


        </div>
    )
}

export default RadioAudioForm;
