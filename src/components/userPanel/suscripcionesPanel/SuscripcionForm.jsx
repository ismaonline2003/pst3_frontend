import { useState, useEffect, useContext, Fragment } from 'react';
import { useParams, Navigate, Link, useLocation } from 'react-router-dom';
import axios from "axios";

//material ui
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';

//own
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import FormBtns from '../FormBtns';
import sequelizeImg2Base64 from '../../../helpers/sequelizeImg2Base64';
import getFormattedDate from '../../../helpers/getFormattedDate';
import styledComponents from '../../styled'
import FormContainer from '../FormContainer'
import noEncontrado from '../../../icons/no-encontrado.jpg'
import getTurnoName from '../../../helpers/getTurnoName';
import DeleteDialog from '../../generales/DeleteDialog';

const tipoSuscripcionLabels = {
    "radio": "Radio",
    "portal_noticias": "Portal de Noticias"
}

const activeSwitchLabel = { inputProps: { 'aria-label': 'Desactivar' } };


const SuscripcionForm = ({tipoDomain}) => {
    //logic
    const [reLoad, setReload] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showFormBtns, setShowFormBtns] = useState(true);
    const [recordData, setRecordData] = useState(false);
    const location = useLocation();
    const { hash, pathname, search } = location;

    //bd values
    const [usuarioID, setUsuarioID] = useState(false);
    const [usuarioData, setUsuarioData] = useState({});
    const [nombre, setNombre] = useState("");
    const [fechaSuscripcion, setFechaSuscripcion] = useState(undefined);
    const [username, setUsername] = useState("");
    const [tipo, setTipo] = useState("radio");
    const [activa, setActiva] = useState(true);

    //Ui fields
    
    const [ personasList, setPersonasList ] = useState([]);
    const [ personaSelected, setPersonaSelected ] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog ] = useState(false);
    const [recordFound, setRecordFound] = useState(false);
    const [newId, setNewId] = useState(0);
    const [tipoSuscripcion, setTipoSuscripcion] = useState("radio");
    const { id } = useParams();
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [unlockFields, setUnlockFields] = useState(false);
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;

    const _getTipoSuscripcion = () => {
        let tipoSuscripcionStr = "radio"
        const tipoSuscripcion = pathname.split('/');
        if(tipoSuscripcion[2] == 'suscripciones_web_form') {
            tipoSuscripcionStr = 'portal_noticias';
        }
        return tipoSuscripcionStr;
    }

    const _setRecordData = (data) => {
        setRecordData(data);
        setNombre(`${data.user.person.name} ${data.user.person.lastname} - C.I: ${data.user.person.ci_type}-${data.user.person.ci}`);
        setUsuarioData(data.user);
        setUsuarioID(data.user_id);
        setFechaSuscripcion(new Date(data.fecha_suscripcion));
        setUsername(data.username);
        setTipo(data.tipo);
        setActiva(data.activa);
    }

    const searchPersonas = (val) => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/suscripcion/api/searchPersonas?tipo=${_getTipoSuscripcion()}&value=${val}`;
        axios.get(url, config).then((response) => {
            setPersonasList(response.data);
            setBlockUI(false);
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const recordValidations = () =>  {
        let objReturn = {'status': 'success', 'data': {}, 'msg': ''};
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        if(id == '0') {
            if(username.trim() == "") {
                objReturn = {'status': 'failed', 'data': {}, 'msg': 'Se debe definir un nombre de usuario.'};
                return objReturn;
            }
            setUsername(username.trim());
    
            if(!personaSelected) {
                objReturn = {'status': 'failed', 'data': {}, 'msg': 'Se debe seleccionar una persona.'};
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
            let url = `${consts.backend_base_url}/api/suscripcion/${id}`;
            axios.get(url, config).then((response) => {
                //set record data
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
        let body = {
            activa: activa,
            tipo: _getTipoSuscripcion()
        };
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/suscripcion/${id}`;
        axios.put(url, body, config).then((response) => {
            //set record data
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
            user_id: false,
            id_persona: personaSelected,
            username: username,
            tipo: _getTipoSuscripcion()
        };
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/suscripcion`;
        axios.post(url, body, config).then((response) => {
            //set record data
            _setRecordData(response.data);
            setNotificationMsg("El registro fue creado exitosamente!!");
            setNotificationType('success');
            setShowNotification(true);
            setNewId(response.data.id);
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
        let url = `${consts.backend_base_url}/api/suscripcion/${id}`;
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
        console.log(tipoDomain);
        searchRecord();
        if(tipoDomain == 'portal_noticias') {
            setTipoSuscripcion('portal_noticias');
        }
    }, []);

    return (
        <div className='m-4'>
            {
                id == '0' && recordFound && 
                <div className='text-center mb-10'>
                    <StyledH1>Crear una Nueva Suscripción</StyledH1>
                </div>
            }
            {
                id != '0' && recordFound &&
                <div className='text-center mb-10'>
                    <StyledH1>Actualizar Suscripción</StyledH1>
                </div>
            }
            {
                recordFound && showFormBtns && 
                <FormBtns 
                    setUnlockFields={setUnlockFields} 
                    handleConfirmarBtn={handleConfirmarBtn} 
                    handleCancelarBtn={handleCancelarBtn} 
                    showEditBtn={true ? id == '0' : false}
                    deleteApplies={true}
                    handleDeleteBtn={handleDeleteBtn}
                />
            }
            {
                reLoad && <Navigate to={`/dashboard/suscripciones/${newId}`} />
            }
            {
                redirect && <Navigate to="/dashboard/suscripciones" />
            }
            {
                recordFound && 
                <FormContainer>
                    
                        {
                            id != '0' && 
                            <Fragment>
                                {
                                    recordData.activa &&
                                    <div className='d-flex flex-row flex-wrap'>
                                        <p style={{margin: '10px', fontWeight: '500', fontSize: '1.5rem'}} className="text-green-600"><strong>Status</strong>: Activa</p>
                                    </div>
                                }
                                {
                                    !recordData.activa &&
                                    <div className='d-flex flex-row flex-wrap'>
                                        <p style={{margin: '10px', fontWeight: '500', fontSize: '1.5rem'}} className="text-red-600"><strong>Status</strong>: Desactivada</p>
                                    </div>
                                }
                                <div className='d-flex flex-row flex-wrap'>
                                    <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                        <TextField id="tipo_suscripcion" label="Tipo de Suscripción" disabled variant="outlined" value={tipoSuscripcionLabels[tipo]}/>
                                    </FormControl>
                                </div>
                                <div className='d-flex flex-row flex-wrap'>
                                    <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                        <TextField id="persona" label="Persona" disabled variant="outlined" value={nombre}/>
                                    </FormControl>
                                </div>
                                <div className='d-flex flex-row flex-wrap'>
                                    <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                        <TextField id="username" label="Nombre de Usuario" disabled variant="outlined" value={username}/>
                                    </FormControl>
                                </div>
                                {
                                    activa &&
                                    <div>
                                        <span>¿Desea Desactivar la suscripción?</span>
                                        <Switch {...activeSwitchLabel} onClick={() => setActiva(!activa)}/>
                                    </div>
                                }
                            </Fragment>
                        }
                    {
                        recordFound && id == '0' && 
                        <Fragment>
                            <div className='d-flex flex-row flex-wrap'>
                                <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                    <TextField id="persona_search" label="Busque a la persona" variant="outlined" onBlur={(e) => searchPersonas(e.target.value)}/>
                                </FormControl>
                                <FormControl sx={{ m: 1, width: '90%' }} variant="outlined">
                                    <TextField id="persona_select" select label="Seleccione a la persona" onChange={(e) => setPersonaSelected(parseInt(e.target.value))}>
                                        {personasList.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.name} C.I: {option.ci_type}-{option.ci}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
                            </div>
                            <div className='d-flex flex-row flex-wrap'>
                                <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                    <TextField id="username" label="Nombre de Usuario" variant="outlined" onChange={(e) => setUsername(e.target.value)}/>
                                </FormControl>
                            </div>
                        </Fragment>
                    }
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
                        <StyledH2 className='mt-5'>La Suscripción no fue encontrada</StyledH2>
                        <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                            <Link to={"/dashboard/suscripciones"}>
                                <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Volver</Button>
                            </Link>
                        </div>
                    </div>
                </FormContainer>
            }


        </div>
    )
}

export default SuscripcionForm;
