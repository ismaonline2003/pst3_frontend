import { useState, useEffect, useContext } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import axios from "axios";
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormBtns from '../FormBtns';
import PersonaForm from '../PersonaForm';
import personaFieldsValidations from '../../../helpers/personaFieldsValidations';
import sequelizeImg2Base64 from '../../../helpers/sequelizeImg2Base64';
import getFormattedDate from '../../../helpers/getFormattedDate';
import styledComponents from '../../styled'
import FormContainer from '../FormContainer'
import noEncontrado from '../../../icons/no-encontrado.jpg'
import Button from '@mui/material/Button';
import DeleteDialog from '../../generales/DeleteDialog';

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
            year_ingreso: yearIngreso
        };
        formData.append('data', JSON.stringify(body));
        const config = {headers:{'authorization': token, 'Content-Type': 'multipart/form-data'}};
        let url = `${consts.backend_base_url}/api/estudiante/${id}`;
        axios.put(url, formData, config).then((response) => {
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
            year_ingreso: yearIngreso
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
        setFotoCarnetObj(undefined);
        if(estudiante.person.foto_carnet_filename) {
            //const base64Img = sequelizeImg2Base64(response.data.person.foto_carnet);
            //setFotoCarnetStr(base64Img.b64str);
            setFotoCarnetStr(`${consts.backend_base_url}/api/files/getFile/${estudiante.person.foto_carnet_filename}`);
        }
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

    useEffect(() => {
        searchEstudiante();
    }, []);

    useEffect(() => {
        setNroExpediente(`${yearIngreso ? yearIngreso: ""}-${ci ? ci : ""}`);
    }, [yearIngreso, ci]);

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
