import { React } from 'react';
import { Link } from 'react-router-dom';
import styled from '../styled'

const Footer = ({}) => {
    return (
        <div className='d-flex justify-around flex-row flex-wrap p-4 text-center' style={{backgroundColor: 'rgb(242, 254, 242)', position: 'static', bottom: '0', width: '100%'}}>
            <p style={{fontSize: '.9rem', color: 'rgba(0, 0, 0, 0.54)', margin: '0'}}>
                <strong>Sede Principal:</strong> Antímano (Av. Principal de Antímano). Antigua Fosforera, calle Real. Caracas 1000, Dto. Capital, Venezuela<br></br>
                <strong>Redes Sociales:</strong> Instagram: @uptecms_dgc | Facebook: Gestión Comunicacional UPTECMS | Twitter: @UniversidadPms<br></br>
                <strong>Derechos Reservados {(new Date()).getFullYear()} - Universidad Politécnica Territorial de Caracas Mariscal Sucre - RIF G-200024593</strong>
            </p>
        </div>
    )
};

export default Footer;