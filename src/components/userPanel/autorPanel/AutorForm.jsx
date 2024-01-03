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

const AutorForm = ({}) => {
    //logic
    const [reLoad, setReload] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showFormBtns, setShowFormBtns] = useState(true);
    const [recordData, setRecordData] = useState(false);

    //bd values
    const [nombre, setNombre] = useState("");

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
        setRecordData(data);
        setNombre(data.name);
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
            let url = `${consts.backend_base_url}/api/autor/${id}`;
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
        const body = {name: nombre};
        const config = {headers:{'authorization': token}};
        const url = `${consts.backend_base_url}/api/autor/${id}`;
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
        let body = {name: nombre};
        const config = {headers:{'authorization': token}};
        const url = `${consts.backend_base_url}/api/autor`;
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
        const url = `${consts.backend_base_url}/api/autor/${id}`;
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
                id == '0' && recordFound && 
                <div className='text-center mb-10'>
                    <StyledH1>Crear un nuevo Autor</StyledH1>
                </div>
            }
            {
                id != '0' && recordFound &&
                <div className='text-center mb-10'>
                    <StyledH1>Actualizar Autor</StyledH1>
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
                reLoad && <Navigate to={`/dashboard/autores/${newId}`} />
            }
            {
                redirect && <Navigate to="/dashboard/autores" />
            }
            {
                recordFound && 
                <FormContainer>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="nombre" label="Nombre" disabled variant="outlined" value={nombre}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="nombre" label="Nombre" variant="outlined" defaultValue={nombre} onChange={(e) => setNombre(e.target.value)}/>
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
                        <StyledH2 className='mt-5'>El Autor no fue encontrado</StyledH2>
                        <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                            <Link to={"/dashboard/autores"}>
                                <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Volver</Button>
                            </Link>
                        </div>
                    </div>
                </FormContainer>
            }


        </div>
    )
}

export default AutorForm;
