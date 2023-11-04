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

const trayectoVals = [
    {
      value: '0',
      label: 'Inicial',
    },
    {
      value: '1',
      label: '1',
    },
    {
      value: '2',
      label: '2',
    },
    {
        value: '3',
        label: '3',
    },
    {
        value: '4',
        label: '4',
    },
    {
        value: '5',
        label: '5',
    }
];

const turnoVals = [
    {
      value: '1',
      label: 'Mañana',
    },
    {
      value: '2',
      label: 'Tarde',
    },
    {
      value: '3',
      label: 'Noche',
    }
];

const SeccionForm = ({}) => {
    const [reLoad, setReload] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showFormBtns, setShowFormBtns] = useState(true);
    const [seccion, setSeccion] = useState(undefined);
    const [nombre, setNombre] = useState("");
    const [year, setYear] = useState((new Date).getFullYear());
    const [trayecto, setTrayecto] = useState("1");
    const [turno, setTurno] = useState("1");
    const [pnfId, setPnfID] = useState(false);
    const [pnfName, setPnfName] = useState("");
    const [carrerasUniversitarias, setCarrerasUniversitarias] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog ] = useState(false);
    const [recordFound, setRecordFound] = useState(false);
    const [newId, setNewId] = useState(0);
    const { id } = useParams();
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [unlockFields, setUnlockFields] = useState(false);
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;

    const recordValidations = () =>  {
        let objReturn = {'status': 'success', 'data': {}, 'msg': ''};
        const pnfRecord = carrerasUniversitarias.filter(record => record.id == pnfId);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        if(nombre.trim() == "") {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'Se debe definir un nombre para la sección.'};
            return objReturn;
        }
        setNombre(nombre.trim());
        if(nombre.length > 6) {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'El nombre de la sección no debe sobrepasar los 6 caracteres.'};
            return objReturn;
        }
        if(isNaN(year)) {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'El año debe ser un valor numérico'};
            return objReturn;
        }
        if(year > currentYear) {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'El año no puede ser mayor al año actual.'};
            return objReturn;
        }
        if(!["0", "1", "2", "3", "4", "5"].includes(trayecto)) {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'El trayecto debe ser Inicial, 1, 2, 3, 4 o 5'};
            return objReturn;
        }
        if(!["1", "2", "3"].includes(turno)) {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'El turno debe ser "Mañana", "Tarde", o "Noche"'};
            return objReturn;
        }
        if(pnfRecord.length == 0 && pnfId != false) {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'Debe seleccionar un pnf válido.'};
            return objReturn;
        }
        return objReturn;
    }

    const searchCarrerasUniversitarias = () => {
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/carrera_universitaria`;
        axios.get(url, config).then((response) => {
            setCarrerasUniversitarias(response.data)
        }).catch((err) => {
            setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
            setNotificationType('error');
            setShowNotification(true);
        });
    }

    const searchSeccion = () => {
        setBlockUI(true);
        if(id != "0") {
            const token = localStorage.getItem('token');
            const config = {headers:{ authorization: token}};
            let url = `${consts.backend_base_url}/api/seccion/${id}`;
            axios.get(url, config).then((response) => {
                console.log(response);
                setNombre(response.data.nombre);
                setYear(response.data.year);
                setTrayecto(response.data.trayecto);
                setTurno(response.data.turno);
                setPnfID(response.data.carrera_universitarium.id);
                setPnfName(response.data.carrera_universitarium.nombre);
                setRecordFound(true);
                setSeccion(response.data);
                searchCarrerasUniversitarias();
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
            searchCarrerasUniversitarias();
            setUnlockFields(true);
            setBlockUI(false);
        }
    }

    const updateSeccionData = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        let body = {
            pnf_id: pnfId,
            year: parseInt(year),
            trayecto: trayecto,
            turno: turno,
            nombre: nombre
        };
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/seccion/${id}`;
        axios.put(url, body, config).then((response) => {
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

    const createSeccion = () => {
        setBlockUI(true);
        console.log(carrerasUniversitarias[0].id)
        const token = localStorage.getItem('token');
        let pnfIDInt = pnfId;
        if(id == "0" && pnfId == false) {
            setPnfID(carrerasUniversitarias[0].id);
            pnfIDInt = carrerasUniversitarias[0].id;
        }
        let pnfData = carrerasUniversitarias.filter(item => item.id == pnfIDInt);
        let body = {
            pnf_id: pnfIDInt,
            year: parseInt(year),
            trayecto: trayecto,
            nombre: nombre,
            turno: turno,
            pnf_data: pnfData[0]
        };
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/seccion`;
        axios.post(url, body, config).then((response) => {
            response.data.carrera_universitarium = pnfData[0];
            setNombre(response.data.nombre);
            setYear(response.data.year);
            setTrayecto(response.data.trayecto);
            setTurno(response.data.turno);
            setPnfID(response.data.carrera_universitarium.id);
            setPnfName(response.data.carrera_universitarium.nombre);
            setNewId(response.data.id);
            setSeccion(response.data);
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
            if(seccion != undefined) {
                updateSeccionData();
            } else {
                createSeccion();
            }
        }
        return confirmarBtnReturn;
    }

    const _resetSeccionData = () => {
        setNombre(seccion.nombre);
        setYear(seccion.year);
        setTrayecto(seccion.trayecto);
        setTurno(seccion.turno);
        setPnfID(seccion.carrera_universitarium.id);
        setPnfName(seccion.carrera_universitarium.nombre);
        setNewId(seccion.id);
    }

    const handleCancelarBtn = (e) => {
        if(id != '0') {
            _resetSeccionData();
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
        let url = `${consts.backend_base_url}/api/seccion/${id}`;
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
        searchSeccion();
    }, []);

    useEffect(() => {
        let pnfData = carrerasUniversitarias.filter(item => item.id == pnfId);
        setPnfName(pnfData.nombre);
    }, [pnfId]);

    return (
        <div className='m-4'>
            {
                id == '0' && recordFound && 
                <div className='text-center mb-10'>
                    <StyledH1>Crear una nueva sección</StyledH1>
                </div>
            }
            {
                id != '0' && recordFound &&
                <div className='text-center mb-10'>
                    <StyledH1>Actualizar Sección</StyledH1>
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
                reLoad && <Navigate to={`/dashboard/secciones/${newId}`} />
            }
            {
                redirect && <Navigate to="/dashboard/secciones" />
            }
            {
                recordFound && 
                <FormContainer>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="nombre" label="Nombre" disabled variant="outlined" value={nombre}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="nombre" label="Nombre" variant="outlined" defaultValue={nombre} onChange={(e) => setNombre(e.target.value)}/>
                            </FormControl>
                        }
                        {
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="trayecto" label="Trayecto" disabled variant="outlined" value={trayecto}/>
                            </FormControl>
                        }
                        {
                            unlockFields &&
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="trayecto" select label="Trayecto" defaultValue={trayecto ? trayecto : "0"} onChange={(e) => setTrayecto(e.target.value)}>
                                    {trayectoVals.map((option) => (
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
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="turno" label="Turno" disabled variant="outlined" value={getTurnoName(turno)}/>
                            </FormControl>
                        }
                        {
                            unlockFields &&
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="turno" select label="Turno" defaultValue={turno ? turno : "1"} onChange={(e) => setTurno(e.target.value)}>
                                    {turnoVals.map((option) => (
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
                                <TextField id="year" label="Año" disabled variant="outlined" value={year}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                                <TextField id="year" label="Año" variant="outlined" type="number" defaultValue={year} onChange={(e) => parseInt(setYear(e.target.value))}/>
                            </FormControl>
                        }
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            !unlockFields &&
                            <FormControl sx={{ m: 1, width: '90%' }} variant="outlined">
                                <TextField id="turno" label="Turno" disabled variant="outlined" value={pnfName}/>
                            </FormControl>
                        }
                        {
                            unlockFields && carrerasUniversitarias.length > 0 &&
                            <FormControl sx={{ m: 1, width: '90%' }} variant="outlined">
                                <TextField id="carrera_universitaria" select label="Carrera" defaultValue={pnfId ? pnfId : carrerasUniversitarias[0].id} onChange={(e) => setPnfID(e.target.value)}>
                                    {carrerasUniversitarias.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        }
                    </div>
                </FormContainer>
            }

            {
                !recordFound && 
                <FormContainer>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="nombre" label="Nombre" variant="outlined" defaultValue={""} onChange={(e) => setNombre(e.target.value)}/>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="trayecto" select label="Trayecto" defaultValue={"0"} onChange={(e) => setTrayecto(e.target.value)}>
                                {trayectoVals.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="turno" select label="Turno" defaultValue={"1"} onChange={(e) => setTurno(e.target.value)}>
                                {turnoVals.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="year" label="Año" variant="outlined" type="number" defaultValue={(new Date).getFullYear()} onChange={(e) => parseInt(setYear(e.target.value))}/>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '90%' }} variant="outlined">
                            <TextField id="carrera_universitaria" select label="Carrera" defaultValue={""}  onChange={(e) => setPnfID(parseInt(e.target.value))}>
                                {carrerasUniversitarias.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
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

export default SeccionForm;
