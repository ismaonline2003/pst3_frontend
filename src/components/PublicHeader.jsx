import { React } from 'react';
import { Link } from 'react-router-dom';
import styled from './styled'
import UptecmLogo from '../icons/uptecm-logo.png'
import MinisterioEducUniverstiaria from '../icons/cintillo_mppeuct.png'

const PublicHeader = ({}) => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', flexWrap: 'WRAP'}} className='w-100 p-2 border shadow' >
                <img 
                    src={UptecmLogo} 
                    alt="uptecm-logo" 
                    style={{width: '80px', display: 'block', maxHeight: '100px', margin: '10px'}} 
                />
                <div 
                    style={{width: '50%', textAlign: 'center', alignContent: 'center', alignItems: 'center'}}
                >
                    <p className='font-bold' style={{margin: '0 auto'}}>
                    República Bolivariana de Venezuela<br />
                    Ministerio del Poder Popular para la Educación Universitaria<br />
                    Universidad Politécnica Territorial de Caracas "Mariscal Sucre"<br />
                    SIPPEPRE
                    </p>
                </div>
                <img 
                    src={MinisterioEducUniverstiaria} 
                    alt="uptecm-logo" 
                    style={{width: '100px', display: 'block', maxHeight: '100px', margin: '10px'}} 
                />
        </div>
    )
};

export default PublicHeader;