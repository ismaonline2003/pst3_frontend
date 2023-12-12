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

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const UsuarioForm = ({}) => {
    //logic
    const [reLoad, setReload] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showFormBtns, setShowFormBtns] = useState(true);
    const [recordData, setRecordData] = useState(false);

    //bd values
    const [personaID, setPersonaID] = useState(0);
    const [personaData, setPersonaData] = useState({});
    const [login, setLogin] = useState("");
    const [fechaVerificacion, setFechaVerificacion] = useState("");



    //Ui fields
    const [ personaSearchBar, setPersonaSearchBar] = useState("");
    const [ personasList , setPersonasList] = useState([]);
    const [ personaSelected , setPersonaSelected] = useState(false);
    const [ newPassword, setNewPassword] = useState("");
    const [ showNewPassword, setShowNewPassword] = useState(false);
    const [ newPasswordInputType, setNewPasswordInputType] = useState('password');
    const [ newPasswordRepeated, setNewPasswordRepeated] = useState("");
    const [ showNewPasswordRepeated, setShowNewPasswordRepeated] = useState(false);
    const [ newPasswordRepeatedInputType, setNewPasswordRepeatedInputType] = useState('password');


    const [showDeleteDialog, setShowDeleteDialog ] = useState(false);
    const [recordFound, setRecordFound] = useState(false);
    const [newId, setNewId] = useState(0);
    const { id } = useParams();
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [unlockFields, setUnlockFields] = useState(false);
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;

    const _setRecordData = (data) => {
        setRecordData(data);
        setLogin(data.login);
    }

    const recordValidations = () =>  {
        let objReturn = {'status': 'success', 'data': {}, 'msg': ''};
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        if(login.trim() == "") {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'Se debe definir un email valido para el usuario.'};
            return objReturn;
        }
        setLogin(login);

        return objReturn;
    }

    const searchRecord = () => {
        setBlockUI(true);
        if(id != "0") {
            const token = localStorage.getItem('token');
            const config = {headers:{ authorization: token}};
            let url = `${consts.backend_base_url}/api/users/${id}`;
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
            login: login
        };
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/users/${id}`;
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
            login: login
        };
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/users`;
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
        let url = `${consts.backend_base_url}/api/users/${id}`;
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

    const searchPersonas = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/person/personWithoutUser/${personaSearchBar}`;
        axios.get(url, config).then((response) => {
            setPersonasList(response.data);
            setBlockUI(false);
        }).catch((err) => {
          setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
          setNotificationType('error');
          setShowNotification(true);
          setBlockUI(false);
        });
    }

    useEffect(() => {
        searchPersonas();
    }, [personaSearchBar]);

    const _handleShowNewPasswordBtn = (val) => {
        setShowNewPassword(val);

        if(val) {
            setNewPasswordInputType('text');
        }
        if(!val) {
            setNewPasswordInputType('password');
        }
    
      }

      const _handleShowNewPasswordRepeatedBtn = (val) => {
        setShowNewPasswordRepeated(val);
        if(val) {
            setNewPasswordRepeatedInputType('text');
        }
        if(!val) {
            setNewPasswordRepeatedInputType('password');
        }
    
      }

    return (
        <div className='m-4'>
            {
                id == '0' && recordFound && 
                <div className='text-center mb-10'>
                    <StyledH1>Crear un Nuevo Usuario</StyledH1>
                </div>
            }
            {
                id != '0' && recordFound &&
                <div className='text-center mb-10'>
                    <StyledH1>Actualizar Usuario</StyledH1>
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
                reLoad && <Navigate to={`/dashboard/usuarios/${newId}`} />
            }
            {
                redirect && <Navigate to="/dashboard/usuarios" />
            }
            {
                recordFound && id != '0' &&
                <FormContainer>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="login" label="Email" disabled variant="outlined" value={login}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="login" label="Email" variant="outlined" defaultValue={login} onChange={(e) => setLogin(e.target.value)}/>
                            </FormControl>
                        }
                    </div>
                </FormContainer>
            }

            {
                recordFound && id == '0' &&
                <FormContainer>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                            <TextField id="login" label="Email" variant="outlined" defaultValue={""} onChange={(e) => setLogin(e.target.value)}/>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="person" label="Buscar Persona" variant="outlined" defaultValue={""} onBlur={(e) => setPersonaSearchBar(e.target.value)}/>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="personas_list" select label="Personas" defaultValue={""}  onChange={(e) => setPersonaSelected(parseInt(e.target.value))}>
                                {personasList.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.name} {option.lastname} - C.I: {option.ci_type}-{option.ci}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '85%' }} variant="outlined">
                            <TextField id="password" label="Contraseña" type={newPasswordInputType} variant="outlined" defaultValue={""} onChange={(e) => setNewPassword(e.target.value)}/>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '10%' }} variant="outlined">
                            {
                                showNewPassword && 
                                <VisibilityOffIcon style={{fontSize: '1.6rem', marginLeft: '10px', cursor: 'pointer'}} onClick={(e) => _handleShowNewPasswordBtn(!showNewPassword)}/>
                            }
                            {
                                !showNewPassword && 
                                <RemoveRedEyeIcon style={{fontSize: '1.6rem', marginLeft: '10px', cursor: 'pointer'}}  onClick={(e) => _handleShowNewPasswordBtn(!showNewPassword)}/>
                            }
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '85%' }} variant="outlined">
                            <TextField id="password_repeated" label="Repita la Contraseña" type={newPasswordRepeatedInputType} variant="outlined" defaultValue={""} onChange={(e) => setNewPasswordRepeated(e.target.value)}/>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '10%' }} variant="outlined">
                            {
                                showNewPasswordRepeated && 
                                <VisibilityOffIcon style={{fontSize: '1.6rem', marginLeft: '10px', cursor: 'pointer'}} onClick={(e) => _handleShowNewPasswordRepeatedBtn(!showNewPasswordRepeated)}/>
                            }
                            {
                                !showNewPasswordRepeated && 
                                <RemoveRedEyeIcon style={{fontSize: '1.6rem', marginLeft: '10px', cursor: 'pointer'}}  onClick={(e) => _handleShowNewPasswordRepeatedBtn(!showNewPasswordRepeated)}/>
                            }
                        </FormControl>
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

export default UsuarioForm;
