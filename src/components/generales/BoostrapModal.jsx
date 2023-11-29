import * as React from 'react';
//dialog title
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
//generales
import BootstrapDialog from './BootstrapDialog';
import BootstrapDialogTitle from './BootstrapDialogTitle';

export default function BoostrapModal({props}) {
    const [ maxWidth, showModal, setShowModal, title, children, footer ] = props;
    return (
        <BootstrapDialog
            maxWidth={maxWidth}
            onClose={(e) => setShowModal(false)}
            aria-labelledby="modal-title"
            open={showModal}
        >
        <BootstrapDialogTitle id="modal-title" onClose={(e) => setShowModal(false)}>
            {title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
            {children}
        </DialogContent>
        <DialogActions>
            {footer != undefined && footer}
        </DialogActions>
      </BootstrapDialog>
    )
}