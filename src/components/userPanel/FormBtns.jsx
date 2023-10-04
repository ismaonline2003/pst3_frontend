import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';


const FormBtns = ({setUnlockFields, handleConfirmarBtn, handleCancelarBtn}) => {
    const [ showConfirmEditBtn, setShowConfirmEditBtn ] = useState(false);

    const _handleEditarBtn = () => {
        setUnlockFields(true);
        setShowConfirmEditBtn(true);
    }

    const _handleCancelarBtn = () => {
        handleCancelarBtn();
        setUnlockFields(false);
        setShowConfirmEditBtn(false);
    }

    const _handleConfirmarBtn = (e) => {
        let confirmarBtn = handleConfirmarBtn(e);
        if(confirmarBtn.status == 'success') {
            setUnlockFields(false);
            setShowConfirmEditBtn(false);
        }

        
    }

    return (
        <div className='m-10 w-100'>
            {
                !showConfirmEditBtn && 
                <Button variant="contained" onClick={(e) => _handleEditarBtn(e)}>Editar</Button>
            }
            {
                showConfirmEditBtn && 
                <div className='d-flex justify-center align-middle'>
                    <Button variant="contained" color="success" onClick={(e) => _handleConfirmarBtn(e)} style={{marginLeft: '10px'}}>Confirmar</Button>
                    <Button variant="outlined" color="secondary" onClick={(e) => _handleCancelarBtn()} style={{marginLeft: '10px'}}>Cancelar</Button>
                </div>
            }
        </div>
    )
}

export default FormBtns;
