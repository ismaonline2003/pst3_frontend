import { React } from 'react';
import { Link } from 'react-router-dom';
import styled from './styled'
import UptecmLogo from '../icons/uptecm-logo.png'
import MinisterioEducUniverstiaria from '../icons/cintillo_mppeuct.png'

const PublicHeader = ({}) => {
    return (
        <div className='w-100 d-flex justify-between flex-row text-center p-2 border shadow' >
                <div style={{width: '25%', textAlign: 'center',  alignContent: 'center', alignItems: 'center', display: 'inline-block'}}>
                    <img 
                        src={UptecmLogo} 
                        alt="uptecm-logo" 
                        style={{width: '80px', display: 'text'}} 
                    />
                </div>
                <div 
                    style={{width: '50%', margin: '0 auto', alignContent: 'center', alignItems: 'center', display: 'inline-block'}}
                >
                    <p className='font-bold'>
                    República Bolivariana de Venezuela<br />
                    Ministerio del Poder Popular para la Educación Universitaria<br />
                    Universidad Politécnica Territorial de Caracas "Mariscal Sucre"<br />
                    </p>
                </div>
                <div className='inline-block' style={{width: '25%'}}>
                </div>
        </div>
    )
};

export default PublicHeader;