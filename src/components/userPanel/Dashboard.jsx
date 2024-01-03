import { React, useState, useContext, useEffect, Fragment } from 'react'
import axios from "axios";
import { Container, Box} from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import Inicio from './Inicio';
import AppBar from './AppBar';
import SideBar from './SideBar';
import SimpleNotification from '../generales/SimpleNotification';
import AppContext from '../../context/App';
import styledComponents from '../styled';
/**/
import EmisionPanel from './emisionPanel/EmisionPanel';
import Estudiantes from './estudiantesPanel/Estudiantes';
import EstudianteForm from './estudiantesPanel/EstudianteForm';
import Profesores from './profesoresPanel/Profesores';
import ProfesorForm from './profesoresPanel/ProfesorForm';
import Secciones from './seccionesPanel/Secciones';
import SeccionForm from './seccionesPanel/SeccionForm';
import Pnfs from './pnfsPanel/Pnfs';
import PnfForm from './pnfsPanel/PnfForm';
import Proyectos from './proyectosPanel/Proyectos';
import ProyectoForm from './proyectosPanel/ProyectoForm';
import Noticias from './noticiasPanel/Noticias';
import NoticiaForm from './noticiasPanel/NoticiaForm';
import CategoriasNoticias from './categoriasNoticiasPanel/CategoriasNoticias';
import CategoriaNoticiaForm from './categoriasNoticiasPanel/CategoriaNoticiaForm';
import Grabaciones from './grabacionesPanel/Grabaciones';
import GrabacionForm from './grabacionesPanel/GrabacionForm';
import Suscripciones from './suscripcionesPanel/Suscripciones';
import SuscripcionForm from './suscripcionesPanel/SuscripcionForm';
import Usuarios from './usuariosPanel/Usuarios';
import UsuarioForm from './usuariosPanel/UsuarioForm';
//estadisticas
import InteraccionWebsite from './estadisticasPanel/InteraccionWebsite';
import VistasWebsite from './estadisticasPanel/VistasWebsite';
//
import IniciosSesionLogs from './auditoria/iniciosSesionLogs';
import Logs from './auditoria/Logs';
import Footer from './Footer';
import Autores from './autorPanel/Autores';
import AutorForm from './autorPanel/AutorForm';

const paneles = {
    emision_panel: EmisionPanel,
    inicio: Inicio,
    estudiantes: Estudiantes,
    estudiante_form: EstudianteForm,
    profesores: Profesores,
    profesor_form: ProfesorForm,
    secciones: Secciones,
    seccion_form: SeccionForm,
    pnfs: Pnfs,
    pnf_form: PnfForm,
    proyectos: Proyectos,
    proyecto_form: ProyectoForm,
    noticias: Noticias,
    noticia_form: NoticiaForm,
    categorias_noticias: CategoriasNoticias,
    categoria_noticia_form: CategoriaNoticiaForm,
    grabaciones: Grabaciones,
    grabacion_form: GrabacionForm,
    autores: Autores,
    autor_form: AutorForm,
    suscripciones: Suscripciones,
    suscripcion_form: SuscripcionForm,
    suscripciones_web: Suscripciones,
    usuarios: Usuarios,
    usuario_form: UsuarioForm,
    inicios_sesion: IniciosSesionLogs,
    logs: Logs,
    interaccionWebsite: InteraccionWebsite,
    nVisitasWebsite: VistasWebsite
}

const Dashboard = ({sessionVals, panelName}) => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [sideBarXs, setSideBarXs] = useState(4);
    const [contentScreenXs, setContentScreenXs] = useState(8);
    const [personData, setPersonData] = useState({});
    let Panel = paneles[panelName];

    useEffect(() => {
        if(isSideBarOpen) {
            setSideBarXs(2);
            setContentScreenXs(10);
        }
        if(!isSideBarOpen) {
            setSideBarXs(0);
            setContentScreenXs(12);
        }
    }, [isSideBarOpen]);

    useEffect(() => {
        let persondata = {};
        if(sessionVals.userData) {
            if(sessionVals.userData.person) {
                persondata = sessionVals.userData.person;
            }
        }
        setPersonData(persondata);
    }, [sessionVals]);

    return (
        <Box sx={{ flexGrow: 1 }} marginBottom={'0'}>
            <AppBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}></AppBar>
            <Box sx={{ flexGrow: 1 }} marginBottom={'0'}>
                <Grid  container spacing={2} marginBottom={'0'}>
                    <Grid item xs={sideBarXs}>
                        {isSideBarOpen ? <SideBar /> : <Fragment/>}
                    </Grid>
                    <Grid item xs={contentScreenXs} marginBottom={'0'}>
                        <Container className='p-0 w-100' style={{height: '100%'}}>
                            {
                                panelName != 'suscripciones_web' &&
                                <Panel className='p-0 m-0 w-100'/>
                            }

                            {
                                (panelName == 'suscripciones_web' || panelName == 'suscripciones_web_form')  &&
                                <Panel className='p-0 m-0 w-100' tipoDomain="portal_noticias"/>
                            }  
                        </Container>
                        <Footer/>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
