import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import AppContext from '../../context/App';

const FormBtns = ({setUnlockFields, handleConfirmarBtn, handleCancelarBtn, showEditBtn, deleteApplies, handleDeleteBtn}) => {
    const [ showConfirmEditBtn, setShowConfirmEditBtn ] = useState(false);
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);

    useEffect(() => {
        setShowConfirmEditBtn(showEditBtn);
    }, []);

    useEffect(() => {
        console.log('showEditBtn', showEditBtn);
        setShowConfirmEditBtn(showEditBtn);
    }, [showEditBtn]);

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
        if(confirmarBtn.status != 'success') {
            setNotificationMsg(confirmarBtn.msg);
            setNotificationType('error');
            setShowNotification(true);
        }
    }

    return (
        <div className='mb-2 w-100 rounded border border-slate-500 p-4 border-opacity-20 bg-slate-50'>
            {
                !showConfirmEditBtn && 
                <Button variant="contained" onClick={(e) => _handleEditarBtn(e)} style={{marginLeft: '10px'}}>Editar</Button>
            }
            {
                showConfirmEditBtn && 
                <div className='d-flex justify-center align-middle'>
                    <Button variant="contained" color="success" onClick={(e) => _handleConfirmarBtn(e)} style={{marginLeft: '10px'}}>Confirmar</Button>
                    <Button variant="outlined" color="secondary" className="bg-white" onClick={(e) => _handleCancelarBtn()} style={{marginLeft: '10px'}}>Cancelar</Button>
                </div>
            }
            {
                !showConfirmEditBtn && deleteApplies && 
                <Button variant="contained" onClick={(e) => handleDeleteBtn()} style={{marginLeft: '10px'}} color="error">Eliminar</Button>
            }
        </div>
    )
}

export default FormBtns;
