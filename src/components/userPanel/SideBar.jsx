import * as React from 'react';
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


export default function NestedList() {
  const [openAcademico, setOpenAcademico] = React.useState(false);
  const [openNoticias, setOpenNoticias] = React.useState(false);
  const [openRadio, setOpenRadio] = React.useState(false);
  const [openSistema, setOpenSistema] = React.useState(false);
  const [openEstadisticas, setOpenEstadisticas] = React.useState(false);

  const handleClick = () => {
    setOpenAcademico(!openAcademico);
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', marginRigth: '0 !important'}}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Panel de Usuario
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
                <Link to="/dashboard/suscripciones">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Suscripciones" />
                    </ListItemButton>
                </Link>
            </List>
        </Collapse>
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
                <Link to="/dashboard/estadisticas/interaccionWebsite">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Interacción Website" />
                    </ListItemButton>
                </Link>
                <Link to="/dashboard/estadisticas/nVisitasWebsite">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Número de visitas Website" />
                    </ListItemButton>
                </Link>
                <Link to="/dashboard/estadisticas/visitasCategoriaWebsite">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Visitas por categoria Website" />
                    </ListItemButton>
                </Link>
                <Link to="/dashboard/estadisticas/visitasArticuloWebsite">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Visitas por articulo Website" />
                    </ListItemButton>
                </Link>
                <Link to="/dashboard/estadisticas/visitasMensualesWebsite">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Visitantes Mensuales Website" />
                    </ListItemButton>
                </Link>
                <Link to="/dashboard/estadisticas/likesWebsite">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Likes Website" />
                    </ListItemButton>
                </Link>
                <Link to="/dashboard/estadisticas/comentariosWebsite">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Comentarios Website" />
                    </ListItemButton>
                </Link>
                <Link to="/dashboard/estadisticas/visitasRadioOnline">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Visitas Radio Online" />
                    </ListItemButton>
                </Link>
                <Link to="/dashboard/estadisticas/timepoSintonizacionRadio">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Tiempo de Sintonización Radio" />
                    </ListItemButton>
                </Link>
                <Link to="/dashboard/estadisticas/nSuscripcionesRadio">
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Número de Suscripciones Radio" />
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
    </List>
  );
}