import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import AppContext from '../../context/App';
import BoostrapModal from './BoostrapModal';

const DeleteDialog = ({showDeleteDialog, setShowDeleteDialog, handleDeleteConfirm}) => {
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const _handleBtnConfirm = () => {
        setShowDeleteDialog(false);
        handleDeleteConfirm();
    }
    return (
        <BoostrapModal 
            props={[
                'xl',
                showDeleteDialog,
                setShowDeleteDialog,
                (<h5>Eliminar</h5>),
                (
                    <div>
                        ¿Usted está seguro de eliminar este registro?
                    </div>
                ),
                (
                    <div>
                        <Button variant="contained" autoFocus onClick={(e) => _handleBtnConfirm()} color="success" style={{marginLeft: '10px'}}>
                            Confirmar
                        </Button>
                        <Button variant="outlined" autoFocus onClick={(e) => setShowDeleteDialog(false)} color="primary" style={{marginLeft: '10px'}}>
                            Cancelar
                        </Button>
                    </div>
                )
            ]}
        />
    )
}

export default DeleteDialog;
