import * as React from 'react';
import { useState } from 'react';
import styledComponents from '../../styled';
import ListaCanciones from './ListaCanciones';
import CanalesAudio from './CanalesAudio';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';





export default function EmisionPanel({}) {
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const [ cancionesList, setCancionesList ] = useState([]);

    return (
        <React.Fragment>
            <br />
            <StyledH1>Emisión de Radio</StyledH1>
            <br />
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" color="error">Terminar</Button>
                        <Button variant="contained" color="secondary">Pausar</Button>
                        <Button variant="contained" color="primary">Enviar Notificaciones</Button>
                    </Stack>
                </Grid>
                <Grid item xs={3} className="text-center">
                    <Button variant="outlined" color="success" size="large">En vivo</Button>
                </Grid>
                <Grid item xs={3} className="text-right">
                    <p style={{'fontSize': '30px', 'color': 'red', 'fontWeight': '700'}}>30:07 Minutos</p>
                </Grid>
            </Grid>
            <br />
            {
                /*
                <ListaCanciones cancionesList={cancionesList} setCancionesList={setCancionesList}/>
                */
            }
            <br />
            <CanalesAudio/>
        </React.Fragment>
    );
}

