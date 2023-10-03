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
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Panel de Usuario
        </ListSubheader>
      }
    >
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
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Profesores" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Secciones" />
                </ListItemButton>
            </List>
        </Collapse>
        {/*Sección de Proyectos*/}
        <ListItemButton>
            <ListItemIcon>
                <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary="Proyectos" />
        </ListItemButton>
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
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Noticias" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Categorías de Noticias" />
                </ListItemButton>
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
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Emisiones" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Suscripciones" />
                </ListItemButton>
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
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Relación Oyentes/Suscripciones" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Tiempo de visualización" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Visitas al Portal" />
                </ListItemButton>
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
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Usuarios" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Permisologías" />
                </ListItemButton>
            </List>
        </Collapse>
    </List>
  );
}