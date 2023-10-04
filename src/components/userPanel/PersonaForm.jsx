import { useState, useEffect, useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';

import MenuItem from '@mui/material/MenuItem';

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
        unlockFields
    }) => {

    const [fotoCarnet, setFotoCarnet] = useState(undefined);

    useEffect(() => {
        console.log(fotoCarnetStr);
    }, []);

    return (
        <div>
            {
                unlockFields && 
                <div>
                    <div className='d-flex flex-row flex-wrap'>
                        <img src={`data:image/png;base64,${fotoCarnetStr}`} alt=""/>
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
                    <div className='d-flex flex-row flex-wrap'>
                        <img src={fotoCarnetStr} alt="" style={{width: '100px', height: '100px'}}/>
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