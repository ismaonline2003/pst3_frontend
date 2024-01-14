import { React, useState, useContext, useEffect, Fragment } from 'react'
import { Container, Box} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';

//own
import Inicio from './Inicio';
import AppBar from './AppBar';
import SideBar from './SideBar';
import SimpleNotification from '../generales/SimpleNotification';
import AppContext from '../../context/App';
import styledComponents from '../styled';
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

//
import IniciosSesionLogs from './auditoria/iniciosSesionLogs';
import Logs from './auditoria/Logs';
import Footer from './Footer';
import Autores from './autorPanel/Autores';
import AutorForm from './autorPanel/AutorForm';
import RadioAudioList from './radioAudioPanel/RadioAudioList';
import RadioAudioForm from './radioAudioPanel/RadioAudioForm';
import EmisionAudioList from './emisionAudioPanel/EmisionAudioList';

//
//estadisticas
import VistasWebsite from './estadisticasPanel/VistasWebsite';
import VistasCategoriasWebsite from './estadisticasPanel/VistasCategoriasWebsite';
import VisitasArticuloWebsite from './estadisticasPanel/VisitasArticuloWebsite';
import VisitasRadioOnline from './estadisticasPanel/VisitasRadioOnline';
import SuscripcionesRadio from './estadisticasPanel/SuscripcionesRadio';

//Mi Perfil
import MiPerfil from './MiPerfil';

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
    radio_audio_list: RadioAudioList,
    radio_audio_form: RadioAudioForm,
    emision_audio: EmisionAudioList,
    suscripcion_form: SuscripcionForm,
    suscripciones: Suscripciones,
    usuarios: Usuarios,
    usuario_form: UsuarioForm,
    inicios_sesion: IniciosSesionLogs,
    logs: Logs,
    //estadisticas
    visitasWebsite: VistasWebsite,
    visitasCategoriaWebsite: VistasCategoriasWebsite,
    visitasArticuloWebsite: VisitasArticuloWebsite,
    visitasRadioOnline: VisitasRadioOnline,
    suscripcionesRadio: SuscripcionesRadio,
    //mi perfil
    mi_perfil: MiPerfil
}

const Dashboard = ({sessionVals, panelName}) => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [sideBarXs, setSideBarXs] = useState(4);
    const [contentScreenXs, setContentScreenXs] = useState(8);
    const [userRol, setUserRol] = useState("");
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
            setUserRol(sessionVals.userData.rol);
        }
        setPersonData(persondata);
    }, [sessionVals]);

    return (
        <Box sx={{ flexGrow: 1 }} marginBottom={'0'}>
                <AppBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}></AppBar>
                <Grid  container spacing={0} marginBottom={'0'}  >
                    <Grid item xs={sideBarXs} >
                            {isSideBarOpen ? <SideBar userRol={userRol} personData={personData}/> : <Fragment/>}
                    </Grid>
                    <Grid item xs={contentScreenXs} marginBottom={'0'}>
                        <Container className='p-0 w-100'>
                            {
                                panelName == 'inicio' &&
                                <Panel className='p-0 m-0 w-100' userRol={userRol}/>
                            }

                            {
                                !['inicio', 'suscripciones_web', 'suscripciones_web_form'].includes(panelName) &&
                                <Panel className='p-0 m-0 w-100'/>
                            }

                            {
                               ['suscripciones_web', 'suscripciones_web_form'].includes(panelName) &&
                                <Panel className='p-0 m-0 w-100' tipoDomain="portal_noticias"/>
                            }  
                        </Container>
                    </Grid>
                </Grid>
        </Box>
    );
};

export default Dashboard;
