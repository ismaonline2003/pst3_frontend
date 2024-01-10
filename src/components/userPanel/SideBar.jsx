import * as React from 'react';
import {Fragment} from 'react';
import { Link } from 'react-router-dom';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

//Imported icons
import SchoolIcon from '@mui/icons-material/School';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import RadioIcon from '@mui/icons-material/Radio';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import HomeIcon from '@mui/icons-material/Home';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Chip, Stack } from '@mui/material';

export default function NestedList({userRol, personData}) {
  const [openPerfil, setOpenPerfil] = React.useState(false);
  const [openAcademico, setOpenAcademico] = React.useState(false);
  const [openNoticias, setOpenNoticias] = React.useState(false);
  const [openRadio, setOpenRadio] = React.useState(false);
  const [openSistema, setOpenSistema] = React.useState(false);
  const [openEstadisticas, setOpenEstadisticas] = React.useState(false);

  const handleClick = () => {
    setOpenAcademico(!openAcademico);
  }; 

  const handleCerrarSesionBtn = () => {
    localStorage.setItem('token', '');
    localStorage.setItem('token_exp_time', '');
    localStorage.setItem('userData', '{}');
    setTimeout(() => {
      window.location.reload(true);
    }, 500);
  };
  
  
  React.useEffect(() =>{
    console.log(personData);
  }, [])
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', marginRigth: '0 !important'}}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
        </ListSubheader>
      }
    >   
        <Link to="/dashboard">
            <ListItemButton>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inicio" />
            </ListItemButton>
        </Link>
        <ListItemButton onClick={(e) => setOpenPerfil(!openPerfil)}>
            <ListItemIcon>
                <AccountCircle sx={{fontSize: '2rem'}}/>
            </ListItemIcon>
            <ListItemText >
                { 
                    userRol === 'A' &&
                    <Chip label="Administrador" color="error" size="small"/>
                }
                { 
                    userRol === 'P' &&
                    <Chip label="Profesor" color="primary" size="small"/>
                }
                { 
                    userRol === 'ER' &&
                    <Chip label="Emisor" color="secondary" size="small"/>
                }
            </ListItemText>
            {openPerfil ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPerfil} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <Link to="/dashboard/miPerfil">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Mi Perfil" />
                    </ListItemButton>
                </Link>
                <ListItemButton sx={{ pl: 4 }} onClick={(e) => handleCerrarSesionBtn()}>
                    <ListItemText primary="Cerrar Sesión" />
                </ListItemButton>
            </List>
        </Collapse>
        {
            ['A', 'P'].includes(userRol) &&
            
            <Fragment>
                {/*Sección de Datos Académicos*/}
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary="Datos Académicos" />
                    {openAcademico ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openAcademico} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to="/dashboard/estudiantes">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Estudiantes" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/profesores">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Profesores" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/secciones">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Secciones" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/pnfs">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="PNFS" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>
                {/*Sección de Proyectos*/}
                <Link to="/dashboard/proyectos">
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountTreeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Proyectos" />
                    </ListItemButton>
                </Link>
                {/*Sección de Datos de Portal de Noticias*/}
                <ListItemButton onClick={() => setOpenNoticias(!openNoticias)}>
                    <ListItemIcon>
                        <NewspaperIcon />
                    </ListItemIcon>
                    <ListItemText primary="Portal de Noticias" />
                    {openNoticias ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openNoticias} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to="/dashboard/noticias">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Noticias" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/categorias_noticias">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Categorías de Noticias" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>
            </Fragment>
        }
        {
            ['A', 'ER'].includes(userRol) &&
            <Fragment>
                {/*Sección de Radio Online*/}
                <ListItemButton onClick={() => setOpenRadio(!openRadio)}>
                    <ListItemIcon>
                        <RadioIcon />
                    </ListItemIcon>
                    <ListItemText primary="Radio Online" />
                    {openRadio ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openRadio} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to="/dashboard/radioOnlineEmision">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Nueva Emisión" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/grabaciones">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Grabaciones" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/autores">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Autores" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/radioAudio">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Audios" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/emisionAudio">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Programación" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/suscripciones">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Suscripciones" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>
            </Fragment>
        }
        {
            ['A'].includes(userRol) &&
            <Fragment>        
                {/*Estadísticas*/}
                <ListItemButton onClick={() => setOpenEstadisticas(!openEstadisticas)}>
                    <ListItemIcon>
                        <LeaderboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Estadísticas" />
                    {openEstadisticas ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openEstadisticas} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to="/dashboard/estadisticas/visitasWebsite">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Website" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/estadisticas/visitasRadioOnline">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Radio Online" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>
                {/*Sección de Sistema*/}
                <ListItemButton onClick={() => setOpenSistema(!openSistema)}>
                    <ListItemIcon>
                        <WysiwygIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sistema" />
                    {openSistema ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSistema} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to="/dashboard/usuarios">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Usuarios" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/iniciosSesion">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Inicios de Sesión" />
                            </ListItemButton>
                        </Link>
                        <Link to="/dashboard/logs">
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Logs" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>
            </Fragment>
        }
    </List>
  );
}