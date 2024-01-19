import { useState, useEffect, useContext } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import axios from "axios";
//Material UI
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

//own
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import FormBtns from '../FormBtns';
import PersonaForm from '../PersonaForm';
import personaFieldsValidations from '../../../helpers/personaFieldsValidations';
import sequelizeImg2Base64 from '../../../helpers/sequelizeImg2Base64';
import getFormattedDate from '../../../helpers/getFormattedDate';
import styledComponents from '../../styled'
import FormContainer from '../FormContainer'
import noEncontrado from '../../../icons/no-encontrado.jpg'
import DeleteDialog from '../../generales/DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';

const ci_vals = [
    {
      value: 'V',
      label: 'V',
    },
    {
      value: 'J',
      label: 'J',
    },
    {
      value: 'E',
      label: 'E',
    },
    {
        value: 'P',
        label: 'P',
      }
];


const EstudianteForm = ({}) => {
    const [reLoad, setReload] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showFormBtns, setShowFormBtns] = useState(true);
    const [estudiante, setEstudiante] = useState(undefined);
    const [estudianteFound, setEstudianteFound] = useState(true);
    const [ciType, setCIType] = useState("V");
    const [ci, setCI] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastName] = useState("");
    const [sexo, setSexo] = useState("M");
    const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [phone, setPhone] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [yearIngreso, setYearIngreso] = useState(0);
    const [nroExpediente, setNroExpediente] = useState("");
    const [fotoCarnetStr, setFotoCarnetStr] = useState("");
    const [fotoCarnetObj, setFotoCarnetObj] = useState(undefined);
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false);
    const [newId, setNewId] = useState(0);
    const { id } = useParams();
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [unlockFields, setUnlockFields] = useState(false);
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;

    //
    const [ enrollments, setEnrollments] = useState([]);
    const [ newEnrollments, setNewEnrollments] = useState([]);
    const [ deleteEnrollments, setDeleteEnrollments] = useState([]);
    const [ sectionsFound, setSectionsFound] = useState([]);
    const [ sectionsSearchVal, setSectionsSearchVal] = useState("");
    const [ selectedSection, setSelectedSection] = useState(false);

    const searchEstudiante = () => {
        setBlockUI(true);
        if(id != "0") {
            const token = localStorage.getItem('token');
            const config = {headers:{ authorization: token}};
            let url = `${consts.backend_base_url}/api/estudiante/${id}`;
            axios.get(url, config).then((response) => {
                setEstudiante(response.data);
                setCIType(response.data.person.ci_type ? response.data.person.ci_type : "V");
                setCI(response.data.person.ci);
                setName(response.data.person.name);
                setLastName(response.data.person.lastname);
                setSexo(response.data.person.sexo ? response.data.person.sexo : "M");
                setFechaNacimiento(new Date(response.data.person.birthdate));
                setPhone(response.data.person.phone);
                setMobile(response.data.person.mobile);
                setAddress(response.data.person.address);
                setYearIngreso(response.data.year_ingreso);
                setNroExpediente(response.data.nro_expediente);
                console.log(response);
                setEnrollments(response.data.inscripcions);
                if(response.data.person.foto_carnet_filename) {
                    //const base64Img = sequelizeImg2Base64(response.data.person.foto_carnet);
                    //setFotoCarnetStr(base64Img.b64str);
                    setFotoCarnetStr(`${consts.backend_base_url}/api/files/getFile/${response.data.person.foto_carnet_filename}`);
                }
                setBlockUI(false);
            }).catch((err) => {
                if(err.response.status == 404) {
                    setEstudianteFound(false);
                } else {
                    setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
                    setNotificationType('error');
                    setShowNotification(true);
                }
                setBlockUI(false);
            });
        } else {
            setUnlockFields(true);
            setBlockUI(false);
        }
    }

    const updateEstudianteData = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        let foto_carnet = fotoCarnetObj;
        if(fotoCarnetObj == 'sin_foto') {
            foto_carnet = undefined;
        }
        formData.append('foto_carnet', foto_carnet);
        let body = {
            updateFotoCarnet: true ? fotoCarnetObj != undefined : false,
            id_persona: estudiante.person.id,
            person: {
                ci_type: ciType,
                ci: ci,
                name: name,
                lastname: lastname,
                phone: phone,
                mobile: mobile,
                address: address,
                birthdate: getFormattedDate(fechaNacimiento),
                sexo: sexo
            },
            nro_expediente: nroExpediente,
            year_ingreso: yearIngreso,
            nuevas_secciones: newEnrollments,
            secciones_eliminar: deleteEnrollments
        };
        formData.append('data', JSON.stringify(body));
        const config = {headers:{'authorization': token, 'Content-Type': 'multipart/form-data'}};
        let url = `${consts.backend_base_url}/api/estudiante/${id}`;
        axios.put(url, formData, config).then((response) => {
            setBlockUI(false);
            setNotificationMsg(response.data.message);
            setNotificationType('success');
            setShowNotification(true);
            setTimeout(() => {
                window.location.reload(true);
            }, 500);
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const createEstudiante = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        let foto_carnet = fotoCarnetObj;
        if(fotoCarnetObj == 'sin_foto') {
            foto_carnet = undefined;
        }
        formData.append('foto_carnet', foto_carnet);
        let body = {
            uploadFotoCarnet: true ? fotoCarnetObj != undefined : false,
            person: {
                ci_type: ciType,
                ci: ci,
                name: name,
                lastname: lastname,
                phone: phone,
                mobile: mobile,
                address: address,
                birthdate: getFormattedDate(fechaNacimiento),
                sexo: sexo
            },
            nro_expediente: nroExpediente,
            year_ingreso: yearIngreso,
            secciones: newEnrollments
        };
        formData.append('data', JSON.stringify(body));
        const config = {headers:{'authorization': token, 'Content-Type': 'multipart/form-data'}};
        let url = `${consts.backend_base_url}/api/estudiante`;
        axios.post(url, formData, config).then((response) => {
            setEstudiante(response.data);
            setCIType(response.data.person.ci_type);
            setCI(response.data.person.ci);
            setName(response.data.person.name);
            setLastName(response.data.person.lastname);
            setFechaNacimiento(new Date(response.data.person.birthdate));
            setSexo(response.data.person.sexo);
            setPhone(response.data.person.phone);
            setMobile(response.data.person.mobile);
            setAddress(response.data.person.address);
            setYearIngreso(response.data.year_ingreso);
            setNroExpediente(response.data.nro_expediente);
            setEnrollments(response.data.inscripcions);
            if(response.data.person.foto_carnet_filename) {
                //const base64Img = sequelizeImg2Base64(response.data.person.foto_carnet);
                //setFotoCarnetStr(base64Img.b64str);
                setFotoCarnetStr(`${consts.backend_base_url}/api/files/getFile/${response.data.person.foto_carnet_filename}`);
            }
            setBlockUI(false);
            setNotificationMsg("El estudiante fue creado satisfactoriamente!!");
            setNotificationType('success');
            setNewId(response.data.id);
            setShowNotification(true);
            setReload(true);
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const estudianteValidations = () => {
        let objReturn = {status: 'success', msg: ''}
        let currentDate = new Date();
        if(yearIngreso < 1990) {
            objReturn = {status: 'error', msg: "El año de ingreso debe ser mayor o igual a 1990"};
        }
        if(yearIngreso > currentDate.getFullYear()) {
            objReturn = {status: 'error', msg: "El año de ingreso no puede ser mayor que el año actual"};
        }
        return objReturn;
    }
    
    const handleConfirmarBtn = (e) => {
        let personaData = {
            ci_type: ciType,
            ci: ci,
            name: name,
            lastname: lastname,
            phone: phone,
            mobile: mobile,
            address: address,
            birthdate: fechaNacimiento,
            sexo: sexo
        };
        let confirmarBtnReturn = personaFieldsValidations(personaData);
        if(confirmarBtnReturn.status == 'success') {
            confirmarBtnReturn = estudianteValidations();
            if(confirmarBtnReturn.status == 'success'){
                if(estudiante != undefined) {
                    updateEstudianteData();
                } else {
                    createEstudiante();
                }
            }
        }
        return confirmarBtnReturn;
    }

    const _resetEstudianteData = () => {
        setCIType(estudiante.person.ci_type);
        setCI(estudiante.person.ci);
        setName(estudiante.person.name);
        setLastName(estudiante.person.lastname);
        setSexo(estudiante.person.sexo);
        setFechaNacimiento(new Date(estudiante.person.birthdate));
        setPhone(estudiante.person.phone);
        setMobile(estudiante.person.mobile);
        setAddress(estudiante.person.address);
        setYearIngreso(estudiante.year_ingreso);
        setNroExpediente(estudiante.nro_expediente);
        setEnrollments(estudiante.inscripcions);
        setFotoCarnetObj(undefined);
        if(estudiante.person.foto_carnet_filename) {
            //const base64Img = sequelizeImg2Base64(response.data.person.foto_carnet);
            //setFotoCarnetStr(base64Img.b64str);
            setFotoCarnetStr(`${consts.backend_base_url}/api/files/getFile/${estudiante.person.foto_carnet_filename}`);
        }
        setDeleteEnrollments([]);
        setNewEnrollments([]);
        setSectionsSearchVal("");
        setSectionsFound([]);
        setSelectedSection(false);
    }

    const handleCancelarBtn = (e) => {
        if(id != '0') {
            _resetEstudianteData();
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
        let url = `${consts.backend_base_url}/api/estudiante/${id}`;
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

    const _handleBtnAddEnrollment = () => {
        const obj = {
            id: selectedSection,
            name: ""
        }
        if(!selectedSection) {
            setNotificationMsg("Debe seleccionar una sección.");
            setNotificationType('warning');
            setShowNotification(true);
            return;
        }
        if(enrollments.filter(e => e.id === selectedSection).length > 0) {
            setNotificationMsg("El estudiante ya tiene una inscripción registrada a la sección seleccionada.");
            setNotificationType('error');
            setShowNotification(true);
            return;
        }
        obj.name = sectionsFound.filter(e => e.id === selectedSection)[0].name;
        setNewEnrollments([...newEnrollments, obj]);
        setSectionsSearchVal("");
        setSectionsFound([]);
        setSelectedSection(false);
    }

    const _deleteEnrollment =  (enrollment_id=0, is_new=true) => {
        console.log(newEnrollments.filter(e => e.id != enrollment_id));
        if(!is_new) {
            setDeleteEnrollments([...deleteEnrollments, ...enrollments.filter(e => e.id === enrollment_id)]);
            setEnrollments(enrollments.filter(e => e.id != enrollment_id));
        }
        if(is_new) {
            setNewEnrollments(newEnrollments.filter(e => e.id != enrollment_id));
        }
    }

    useEffect(() => {
        searchEstudiante();
    }, []);

    useEffect(() => {
        setNroExpediente(`${yearIngreso ? yearIngreso: ""}-${ci ? ci : ""}`);
    }, [yearIngreso, ci]);

    useEffect(() => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/seccion/api/seccionPorNombre/${sectionsSearchVal}`;
        axios.get(url, config).then((response) => {
            setSectionsFound(response.data);
            setBlockUI(false);
        }).catch((err) => {
            if(err.response.status == 404) {
                setSectionsFound([]);
            } else {
                setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
                setNotificationType('error');
                setShowNotification(true);
            }
            setBlockUI(false);
        });
    }, [sectionsSearchVal]);

    return (
        <div className='m-4'>
            {
                id == '0' && estudianteFound && 
                <div className='text-center mb-10'>
                    <StyledH1>Crear un nuevo Estudiante</StyledH1>
                </div>
            }
            {
                id != '0' && estudianteFound &&
                <div className='text-center mb-10'>
                    <StyledH1>Actualizar Estudiante</StyledH1>
                </div>
            }
            {
                estudianteFound && showFormBtns && 
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
                reLoad && <Navigate to={`/dashboard/estudiantes/${newId}`} />
            }
            {
                redirect && <Navigate to="/dashboard/estudiantes" />
            }
            {
                estudianteFound && 
                <FormContainer>
                    <PersonaForm 
                        ciType={ciType} 
                        setCIType={setCIType}
                        ci={ci} 
                        setCI={setCI}
                        name={name} 
                        setName={setName}
                        lastname={lastname}
                        setLastName={setLastName} 
                        fechaNacimiento={fechaNacimiento}
                        setFechaNacimiento={setFechaNacimiento}
                        sexo={sexo}
                        setSexo={setSexo} 
                        phone={phone}
                        setPhone={setPhone} 
                        mobile={mobile}
                        setMobile={setMobile} 
                        address={address}
                        setAddress={setAddress}
                        fotoCarnetStr={fotoCarnetStr}
                        setFotoCarnetStr={setFotoCarnetStr}
                        fotoCarnetObj={fotoCarnetObj}
                        setFotoCarnetObj={setFotoCarnetObj}
                        unlockFields={unlockFields}
                    ></PersonaForm>
                    <div className='d-flex flex-row flex-wrap'>
                    {
                        !unlockFields && 
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="year_ingreso" label="Año de Ingreso" disabled variant="outlined" value={yearIngreso}/>
                        </FormControl>
                    }
                    {
                        unlockFields && 
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="year_ingreso" label="Año de Ingreso" variant="outlined" defaultValue={yearIngreso} onChange={(e) => {setYearIngreso(e.target.value)}}/>
                        </FormControl>
                    }

                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="nro_expediente" label="Número de Expediente" disabled variant="standard" value={nroExpediente}/>
                        </FormControl>
                    </div>
                </FormContainer>
            }
            <br />
                <FormContainer>
                    <StyledH2>Registro de Inscripciones</StyledH2>
                    <br />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" style={{width: '80%'}}><strong>Sección</strong></TableCell>
                                    <TableCell align="left" style={{width: '20%'}}><strong>Eliminar</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {enrollments.map((row) => (
                                <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                    {row.seccion.nombre} - Trayecto: {row.seccion.trayecto} - PNF: {row.seccion.carrera_universitarium.nombre_pnf} - Año: {row.seccion.year}
                                    </TableCell>
                                    <TableCell align="left" style={{width: '20%'}}>
                                        {
                                            unlockFields && 
                                            <DeleteIcon sx={{fontSize: '2rem;', cursor:'pointer'}}  onClick={(e) => _deleteEnrollment(row.id, false)}></DeleteIcon>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                            {newEnrollments.map((row) => (
                                <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left" style={{width: '20%'}}>
                                        {
                                            unlockFields && 
                                            <DeleteIcon sx={{fontSize: '2rem;', cursor:'pointer'}}  onClick={(e) => _deleteEnrollment(row.id, true)}></DeleteIcon>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            {
                                unlockFields && 
                                <TableRow
                                    key={'add-new-enrrollment-row'}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" colSpan="2">
                                            <div className='w-100 d-flex justify-center flex-row flex-wrap'>
                                                <FormControl sx={{ m: 1, width: '35%' }} variant="outlined">
                                                    <TextField size="small" id="search_section" label="Buscar Sección" variant="outlined" onChange={(e) => {setSectionsSearchVal(e.target.value)}}/>
                                                </FormControl>
                                                <FormControl sx={{ m: 1, width: '35%' }} variant="outlined">
                                                    <TextField size="small" id="secciones" select label="Secciones" defaultValue={""} onChange={(e) => setSelectedSection(e.target.value)}>
                                                        {
                                                            sectionsFound.map((option) => (
                                                                <MenuItem key={option.id} value={option.id}>
                                                                    {option.name}
                                                                </MenuItem>
                                                            ))
                                                        }
                                                    </TextField>
                                                </FormControl>
                                                <Button size="small" variant="contained" sx={{width: '20%', marginTop: '15px'}} color="success" onClick={(e) => _handleBtnAddEnrollment()}>Agregar</Button>
                                            </div>
                                        </TableCell>
                                </TableRow>
                            }
                        </Table>
                    </TableContainer>
                </FormContainer>          
            {
                !estudianteFound && 
                <FormContainer>
                    <div className='text-center'>
                        <img src={noEncontrado} alt="no-encontrado" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                        <StyledH2 className='mt-5'>El estudiante no fue encontrado</StyledH2>
                        <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                            <Link to={"/dashboard/estudiantes"}>
                                <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Volver</Button>
                            </Link>
                        </div>
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

export default EstudianteForm;
