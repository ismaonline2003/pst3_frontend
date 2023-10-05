import { useState, useEffect, useContext, useRef } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import styledComponents from '../styled';
import imgValidations from '../../helpers/imgValidations';
import MenuItem from '@mui/material/MenuItem';
import AppContext from '../../context/App';
import getBase64 from '../../helpers/getBase64'

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

const PersonaForm = ({
        ciType,
        setCIType,
        ci, 
        setCI,
        name, 
        setName,
        lastname, 
        setLastName,
        phone, 
        setPhone,
        mobile, 
        setMobile,
        address, 
        setAddress,
        fotoCarnetStr,
        setFotoCarnetStr,
        fotoCarnetObj,
        setFotoCarnetObj,
        unlockFields
    }) => {

    const [ showEditFotoCarnet, setShowEditFotoCarnet] = useState(false);
    const fotoCarnetInput = useRef(null)
    const FotoCarnet = styledComponents.fotoCarnetBig;
    const FotoCarnetEdit = styledComponents.fotoCarnetBigEdit;
    const FotoCarnetEditLayer = styledComponents.fotoCarnetBigEditLayer;
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);

    if(fotoCarnetInput && fotoCarnetInput.current) {
        fotoCarnetInput.current.onchange = (e) => {
            const validations = imgValidations(e.target.files[0]);
            if(validations.status != 'success') {
                setNotificationMsg(validations.msg);
                setNotificationType('error');
                setShowNotification(true);
                e.target.value = "";
            } else {
                let url = window.URL.createObjectURL(e.target.files[0]);
                setFotoCarnetStr(url);
                setFotoCarnetObj(e.target.files[0])
            }
        } 
    }
    return (
        <div>
            {
                unlockFields && 
                <div>
                    <div className='d-flex flex-row flex-wrap mb-4'>
                        <FotoCarnetEdit 
                            style={{backgroundImage: `url('${fotoCarnetStr}')`}}   
                            onMouseEnter={() => setShowEditFotoCarnet(true)} 
                            onMouseLeave={() => setShowEditFotoCarnet(false)}>
                            {
                                showEditFotoCarnet &&
                                <FotoCarnetEditLayer
                                    onClick={(e) => fotoCarnetInput.current.click()}
                                >
                                    <p>Click Aqui para cambiar la foto</p>
                                    <input type="file" id="fotoCarnetImage" ref={fotoCarnetInput} hidden
                                    />
                                </FotoCarnetEditLayer>
                            }
                        </FotoCarnetEdit>
                        
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '20%' }} variant="outlined">
                            <TextField
                                id="ci_type"
                                select
                                label="Tipo de Cédula"
                                defaultValue={ciType ? ciType : "V"}
                                onChange={(e) => setCIType(e.target.value)}
                                >
                                {ci_vals.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                                </TextField >
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '70%' }} variant="outlined">
                            <TextField id="ci" label="Cédula" variant="outlined" type="number" defaultValue={ci}
                                onChange={(e) => setCI(e.target.value)}
                            />
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="name" label="Nombre" variant="outlined" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="lastname" label="Apellido" variant="outlined" defaultValue={lastname}  onChange={(e) => setLastName(e.target.value)}/>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="phone" label="Teléfono" variant="outlined" defaultValue={phone} onChange={(e) => setPhone(e.target.value)}/>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="mobile" label="Móvil" variant="outlined" defaultValue={mobile} onChange={(e) => setMobile(e.target.value)}/>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            <TextField id="address" label="Dirección" variant="outlined" defaultValue={address} onChange={(e) => setAddress(e.target.value)}/>
                        </FormControl>
                    </div>
                </div>
            }
            {
                !unlockFields && 
                <div>
                    <div className='d-flex flex-row flex-wrap text-center mb-4'>
                        <FotoCarnet src={fotoCarnetStr} alt="foto-carnet"/>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '20%' }} variant="outlined">
                            <TextField
                                id="ci_type"
                                select
                                label="Tipo de Cédula"
                                defaultValue={ciType ? ciType : "V"}
                                disabled
                                >
                                {ci_vals.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                                </TextField>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '70%' }} variant="outlined">
                            <TextField id="ci" label="Cédula" variant="outlined" disabled type="number" value={ci}
                            />
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '45%' }}>
                            <TextField id="name" label="Nombre" disabled value={name}/>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '45%' }}>
                            <TextField id="lastname" label="Apellido" disabled value={lastname}/>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="phone" label="Teléfono" disabled variant="outlined" value={phone}/>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '45%' }} variant="outlined">
                            <TextField id="mobile" label="Móvil" disabled variant="outlined" value={mobile}/>
                        </FormControl>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            <TextField id="address" label="Dirección" disabled variant="outlined" value={address}/>
                        </FormControl>
                    </div>
                </div>

            }
            
        </div>
    )
}

export default PersonaForm;