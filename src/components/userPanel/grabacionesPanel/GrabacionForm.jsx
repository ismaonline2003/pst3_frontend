import { useState, useEffect, useContext } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import axios from "axios";
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormBtns from '../FormBtns';
import sequelizeImg2Base64 from '../../../helpers/sequelizeImg2Base64';
import getFormattedDate from '../../../helpers/getFormattedDate';
import styledComponents from '../../styled'
import FormContainer from '../FormContainer'
import noEncontrado from '../../../icons/no-encontrado.jpg'
import Button from '@mui/material/Button';
import getTurnoName from '../../../helpers/getTurnoName';
import DeleteDialog from '../../generales/DeleteDialog';

const GrabacionForm = ({}) => {
    //logic
    const [reLoad, setReload] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showFormBtns, setShowFormBtns] = useState(true);
    const [recordData, setRecordData] = useState(false);

    //bd values
    const [nombre, setNombre] = useState("");
    const [emisor, setEmisor] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [status, setStatus] = useState("");
    const [duracion, setDuracion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [urlGrabacion, setUrlGrabacion] = useState("");

    //Ui fields
    const [showDeleteDialog, setShowDeleteDialog ] = useState(false);
    const [recordFound, setRecordFound] = useState(false);
    const [newId, setNewId] = useState(0);
    const { id } = useParams();
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [unlockFields, setUnlockFields] = useState(false);
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;

    const _setRecordData = (data) => {
        let duracionMinutos = data.duracion/60;
        if(duracionMinutos != 1) {
            duracionMinutos = `${duracionMinutos} minutos`
        } else {
            duracionMinutos = `${duracionMinutos} minuto`
        }
        setRecordData(data);
        setNombre(data.titulo);
        setEmisor(`${data.user.person.name} ${data.user.person.lastname}`);
        setDescripcion(data.descripcion);
        setStatus("Finalizada");
        setDuracion(duracionMinutos);
        setFechaInicio(getFormattedDate(new Date(data.fecha_inicio)));
        setFechaFin(getFormattedDate(new Date(data.fecha_fin)));
        setUrlGrabacion(`${consts.backend_base_url}/reproducirGrabacion/${data.id}`);
    }

    const recordValidations = () =>  {
        let objReturn = {'status': 'success', 'data': {}, 'msg': ''};
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        if(nombre.trim() == "") {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'Se debe definir un nombre para la sección.'};
            return objReturn;
        }
        setNombre(nombre.trim());

        return objReturn;
    }

    const searchRecord = () => {
        setBlockUI(true);
        if(id != "0") {
            const token = localStorage.getItem('token');
            const config = {headers:{ authorization: token}};
            let url = `${consts.backend_base_url}/api/grabacion/${id}`;
            axios.get(url, config).then((response) => {
                //set record data
                _setRecordData(response.data);
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
        let body = {
            nombre: nombre
        };
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/grabacion/${id}`;
        axios.put(url, body, config).then((response) => {
            //set record data
            _setRecordData(response.data);
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

    const createRecord = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        let body = {
            nombre: nombre
        };
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/grabacion`;
        axios.post(url, body, config).then((response) => {
            //set record data
            _setRecordData(response.data);
            setNotificationMsg("El registro fue creado exitosamente!!");
            setNotificationType('success');
            setShowNotification(true);
            setReload(true);
            setBlockUI(false);
        }).catch((err) => {
            console.log(err);
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const handleConfirmarBtn = (e) => {
        let confirmarBtnReturn = {'status': 'success', 'message': '', 'data': {}};
        confirmarBtnReturn = recordValidations();
        if(confirmarBtnReturn.status == 'success') {
            if(recordData != false) {
                updateRecordData();
            } else {
                createRecord();
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
        let url = `${consts.backend_base_url}/api/grabacion/${id}`;
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

    useEffect(() => {
        searchRecord();
    }, []);

    return (
        <div className='m-4'>
            {
                <div className='text-center mb-10'>
                    <StyledH1>Grabación</StyledH1>
                </div>
            }
            {
                reLoad && <Navigate to={`/dashboard/grabaciones/${newId}`} />
            }
            {
                redirect && <Navigate to="/dashboard/grabaciones" />
            }
            {
                <FormContainer>
                    <div className='d-flex flex-row flex-wrap'>

                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                            <TextField id="nombre" label="Título" disabled variant="outlined" value={nombre}/>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '31%' }} variant="outlined">
                            <TextField id="Emisor" label="Emisor" disabled variant="outlined" value={emisor}/>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '31%' }} variant="outlined">
                            <TextField id="status" label="Estatus" disabled variant="outlined" value={status}/>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '31%' }} variant="outlined">
                            <TextField id="duracion" label="Duracion" disabled variant="outlined" value={duracion}/>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                            <TextField id="descripcion" label="Descripcion" disabled variant="outlined" value={descripcion}/>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '47%' }} variant="outlined">
                            <TextField id="inicio" label="Inicio" disabled variant="outlined" value={fechaInicio}/>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '47%' }} variant="outlined">
                            <TextField id="fin" label="Fin" disabled variant="outlined" value={fechaFin}/>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap m-4'>
                        <a href={urlGrabacion} target='_blank'>Reproducir la Grabación</a>
                    </div>
                </FormContainer>
            }
            {
                showDeleteDialog &&
                <DeleteDialog showDeleteDialog={showDeleteDialog} setShowDeleteDialog={setShowDeleteDialog} handleDeleteConfirm={handleDeleteConfirm}></DeleteDialog>
            }

        </div>
    )
}

export default GrabacionForm;
