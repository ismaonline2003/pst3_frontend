import * as React from 'react';
import { useState } from 'react';
import styledComponents from '../../styled';
import ListaCanciones from './ListaCanciones';
import CanalesAudio from './CanalesAudio';

export default function EmisionPanel({}) {
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const [ cancionesList, setCancionesList ] = useState([]);

    return (
        <React.Fragment>
            <StyledH1>Emisión de Radio</StyledH1>
            <br />
            <ListaCanciones cancionesList={cancionesList} setCancionesList={setCancionesList}/>
            <br />
            <CanalesAudio/>
        </React.Fragment>
    );
}

