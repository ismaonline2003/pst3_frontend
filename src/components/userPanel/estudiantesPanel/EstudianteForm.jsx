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
    const { id } = useParams();
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [unlockFields, setUnlockFields] = useState(false);

    const searchEstudiante = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/estudiante/${id}`;
        axios.get(url, config).then((response) => {
            setEstudiante(response.data);

            setCIType(response.data.person.ci_type);
            setCI(response.data.person.ci);
            setName(response.data.person.name);
            setLastName(response.data.person.lastname);
            setPhone(response.data.person.phone);
            setMobile(response.data.person.mobile);
            setAddress(response.data.person.address);

            setBlockUI(false);
        }).catch((err) => {
          console.log(err);
          setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
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
            address: address
        };
        let confirmarBtnReturn = personaFieldsValidations(personaData);
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
    }

    useEffect(() => {
        searchEstudiante();
    }, []);

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
                unlockFields={unlockFields}
            ></PersonaForm>
        </div>
    )
}

export default EstudianteForm;
