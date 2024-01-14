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
import DeleteIcon from '@mui/icons-material/Delete';

//own
import AppContext from '../../context/App';
import consts from '../../settings/consts';
import FormBtns from './FormBtns';
import PersonaForm from './PersonaForm';
import personaFieldsValidations from '../../helpers/personaFieldsValidations';
import sequelizeImg2Base64 from '../../helpers/sequelizeImg2Base64';
import getFormattedDate from '../../helpers/getFormattedDate';
import styledComponents from '../styled'
import FormContainer from './FormContainer'
import noEncontrado from '../../icons/no-encontrado.jpg'
import DeleteDialog from '../generales/DeleteDialog';

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


const MiPerfil = ({}) => {
    const [reLoad, setReload] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showFormBtns, setShowFormBtns] = useState(true);

    const [recordData, setRecordData] = useState([]);

    //Persona
    const [ciType, setCIType] = useState("");
    const [ci, setCI] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastName] = useState("");
    const [sexo, setSexo] = useState("M");
    const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [phone, setPhone] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [yearIngreso, setYearIngreso] = useState(0);
    const [fotoCarnetStr, setFotoCarnetStr] = useState("");
    const [fotoCarnetObj, setFotoCarnetObj] = useState(undefined);

    //Usuario
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    
    //
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false);
    const [newId, setNewId] = useState(0);
    const { id } = useParams();
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [unlockFields, setUnlockFields] = useState(false);
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;

    //
    
    const setPerfilInfo = () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setRecordData(userData);
        setCIType(userData.person.ci_type);
        setCI(userData.person.ci);
        setName(userData.person.name);
        setLastName(userData.person.lastname);
        setSexo(userData.person.sexo);
        setFechaNacimiento(new Date(userData.person.birthdate));
        setPhone(userData.person.phone);
        setMobile(userData.person.mobile);
        setAddress(userData.person.address);
        setYearIngreso(userData.person.year_ingreso);
        //setUsername(userData.);
        setEmail(userData.login);

        if(userData.person.foto_carnet_filename) {
            //const base64Img = sequelizeImg2Base64(response.data.person.foto_carnet);
            //setFotoCarnetStr(base64Img.b64str);
            setFotoCarnetStr(`${consts.backend_base_url}/api/files/getFile/${userData.person.foto_carnet_filename}`);
        }
    }


    const updateRecordData = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        const config = {headers:{'authorization': token, 'Content-Type': 'multipart/form-data'}};
        const url = `${consts.backend_base_url}/api/users/api/myProfile/${recordData.id}`;
        const body = {
            ci_type: ciType,
            ci: ci,
            name: name,
            lastname: lastname,
            phone: phone,
            mobile: mobile,
            address: address,
            birthdate: fechaNacimiento.toISOString(),
            sexo: sexo
        };

        let foto_carnet = fotoCarnetObj;
        if(!fotoCarnetObj) {
            foto_carnet = undefined;
        }

        formData.append('foto_carnet', foto_carnet);
        formData.append('data', JSON.stringify(body));

        axios.put(url, formData, config).then((response) => {
            if(response.data.foto_carnet_filename) {
                console.log(response.data);
                body.foto_carnet_filename = response.data.foto_carnet_filename;
            }
            console.log({...recordData, ...{person: body}});
            localStorage.setItem('userData', JSON.stringify({...recordData, ...{person: body}}));
            setBlockUI(false);
            setNotificationMsg(response.data.message);
            setNotificationType('success');
            setShowNotification(true);
            /*
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);
            */
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
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
            if(recordData) {
                    updateRecordData();
            }
        }
        return confirmarBtnReturn;
    }

    const _resetRecordData = () => {
        setPerfilInfo();
    }

    const handleCancelarBtn = (e) => {
        if(id != '0') {
            _resetRecordData();
        } else {
            setRedirect(true);
        }
    }

    useEffect(() => {
        setPerfilInfo();
    }, []);

    return (
        <div className='m-4'>
            {
                id != '0' && recordData &&
                <div className='text-center mb-10'>
                    <StyledH1>Mi Perfil</StyledH1>
                </div>
            }
            {
                recordData && showFormBtns && 
                <FormBtns 
                    setUnlockFields={setUnlockFields} 
                    handleConfirmarBtn={handleConfirmarBtn} 
                    handleCancelarBtn={handleCancelarBtn} 
                    showEditBtn={true ? id == '0' : false}
                    deleteApplies={false}
                />
            }
            {
                redirect && <Navigate to="/dashboard" />
            }
            {
                recordData && 
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
                    <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                        <TextField id="email" label="Email" disabled variant="outlined" value={email}/>
                    </FormControl>
                    </div>
                </FormContainer>
            }
            {
                !recordData && 
                <FormContainer>
                    <div className='text-center'>
                        <img src={noEncontrado} alt="no-encontrado" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                        <StyledH2 className='mt-5'>El perfil no fue encontrado</StyledH2>
                        <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                            <Link to={"/dashboard"}>
                                <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Volver</Button>
                            </Link>
                        </div>
                    </div>
                </FormContainer>
            }
        </div>
    )
}

export default MiPerfil;
