import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
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
    const [estudiante, setEstudiante] = useState(undefined);
    const [ciType, setCIType] = useState("");
    const [ci, setCI] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [yearIngreso, setYearIngreso] = useState(0);
    const [nroExpediente, setNroExpediente] = useState("");
    const [fotoCarnetStr, setFotoCarnetStr] = useState("");
    const [fotoCarnetObj, setFotoCarnetObj] = useState(undefined);
    const { id } = useParams();
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [unlockFields, setUnlockFields] = useState(false);

    const searchEstudiante = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/estudiante/${id}`;
        axios.get(url, config).then((response) => {
            console.log(response.data);
            setEstudiante(response.data);
            setCIType(response.data.person.ci_type);
            setCI(response.data.person.ci);
            setName(response.data.person.name);
            setLastName(response.data.person.lastname);
            setPhone(response.data.person.phone);
            setMobile(response.data.person.mobile);
            setAddress(response.data.person.address);
            setYearIngreso(response.data.year_ingreso);
            setNroExpediente(response.data.nro_expediente);
            if(response.data.person.foto_carnet) {
                const base64Img = sequelizeImg2Base64(response.data.person.foto_carnet);
                setFotoCarnetStr(base64Img.b64str);
            }
            setBlockUI(false);
        }).catch((err) => {
          console.log(err);
          setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
          setNotificationType('error');
          setShowNotification(true);
          setBlockUI(false);
        });
    }

    const updateEstudianteData = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('foto_carnet', fotoCarnetObj);
        let body = {
            id_persona: estudiante.person.id,
            person: {
                ci_type: ciType,
                ci: ci,
                name: name,
                lastname: lastname,
                phone: phone,
                mobile: mobile,
                address: address
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
            address: address
        };
        let confirmarBtnReturn = personaFieldsValidations(personaData);
        if(confirmarBtnReturn.status == 'success') {
            confirmarBtnReturn = estudianteValidations();
            if(confirmarBtnReturn.status == 'success'){
                updateEstudianteData();
            }
        }
        return confirmarBtnReturn;
    }

    const handleCancelarBtn = (e) => {
        setCIType(estudiante.person.ci_type);
        setCI(estudiante.person.ci);
        setName(estudiante.person.name);
        setLastName(estudiante.person.lastname);
        setPhone(estudiante.person.phone);
        setMobile(estudiante.person.mobile);
        setAddress(estudiante.person.address);
        setYearIngreso(estudiante.year_ingreso);
        setNroExpediente(estudiante.nro_expediente);
        setFotoCarnetObj(undefined);
        if(estudiante.person.foto_carnet) {
            const base64Img = sequelizeImg2Base64(estudiante.person.foto_carnet);
            setFotoCarnetStr(base64Img.b64str);
        }
    }

    useEffect(() => {
        searchEstudiante();
    }, []);

    useEffect(() => {
        setNroExpediente(`${yearIngreso ? yearIngreso: ""}-${ci ? ci : ""}`);
    }, [yearIngreso, ci]);

    return (
        <div className='m-10'>
            <FormBtns setUnlockFields={setUnlockFields} handleConfirmarBtn={handleConfirmarBtn} handleCancelarBtn={handleCancelarBtn}/>
            <PersonaForm 
                ciType={ciType} 
                setCIType={setCIType}
                ci={ci} 
                setCI={setCI}
                name={name} 
                setName={setName}
                lastname={lastname}
                setLastName={setLastName} 
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
                    <TextField id="nro_expediente" label="Número de Expediente" disabled variant="outlined" value={nroExpediente}/>
                </FormControl>
            </div>
        </div>
    )
}

export default EstudianteForm;
