import { useState, useEffect, useContext, Fragment } from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import AppContext from '../../context/App';

const readoOnlyActions = [
    { icon: <CalendarMonthIcon />, name: 'Crear', state: 'create' },
    { icon: <BorderColorIcon />, name: 'Editar', state: 'update' },
    { icon: <DeleteIcon />, name: 'Eliminar', state: 'delete' }
];

const confirmActions = [
    { icon: <SaveIcon />, name: 'Guardar', state: 'confirm' },
    { icon: <ReplayIcon />, name: 'Cancelar', state: 'cancel' }
];

const ListBtns = ({
        status,
        setStatus,
        handleConfirmarBtn, 
        handleCancelarBtn, 
        ReadyOnly
    }) => {
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    
    const _handleCancelarBtn = () => {
        handleCancelarBtn();
        setStatus('readonly');
    }

    const _handleConfirmarBtn = () => {
        let confirmarBtn = handleConfirmarBtn();
        if(confirmarBtn.status === 'success') {
            setStatus('readonly');
        }
        if(confirmarBtn.status != 'success') {
            setNotificationMsg(confirmarBtn.msg);
            setNotificationType('error');
            setShowNotification(true);
        }
    }

    const _setStatus = (newStatus) => {
        if(newStatus === 'confirm') {
            _handleConfirmarBtn();
            return;
        }
        if(newStatus === 'cancel') {
            _handleCancelarBtn();
            return;
        }
        setStatus(newStatus);
    }

    return (
        <Fragment>
            {
                status == 'readonly' && !ReadyOnly &&
                <div className='mb-2 w-100 rounded border border-slate-500 p-4 border-opacity-20 bg-slate-50'>
                <Button variant="contained" onClick={(e) => _setStatus('create')} style={{marginLeft: '10px'}} color="success">Crear</Button>
                <Button variant="contained" onClick={(e) => _setStatus('delete')} style={{marginLeft: '10px'}} color="error">Eliminar</Button>
                </div>
            }
            {
                status != 'readonly' && !ReadyOnly &&
                <div className='mb-2 w-100 rounded border border-slate-500 p-4 border-opacity-20 bg-slate-50'>
                <Button variant="contained" onClick={(e) => _setStatus('confirm')} style={{marginLeft: '10px'}} color="success">Confirmar</Button>
                <Button variant="contained" onClick={(e) => _setStatus('cancel')} style={{marginLeft: '10px'}} color="secondary">Cancelar</Button>
                </div>
            }
        </Fragment>
    )
}

export default ListBtns;
