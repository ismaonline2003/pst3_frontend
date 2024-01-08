import { React, useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ArticleIcon from '@mui/icons-material/Article';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import MicIcon from '@mui/icons-material/Mic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import styled from '../styled'

const Inicio = ({userRol}) => {
    const [userData, setUserData] = useState(false);
    const StyledH1 = styled.dahsboardPanelh1

    useEffect(() => {
        if(localStorage.getItem('userData') != '' && localStorage.getItem('userData') != '{}') {
            setUserData(JSON.parse(localStorage.getItem('userData')));
        }
    }, [])

    return (
        <div className='d-flex justify-around flex-row flex-wrap m-4 mb-10'>
            <div className='text-center m-4'>
                {
                    userData && 
                    <StyledH1>Bienvenido {userData.person.name} {userData.person.lastname}</StyledH1>
                }
            </div>
            {
                ['A', 'ER'].includes(userRol) &&
                <Fragment>
                    <Link  to="/dashboard/estudiantes">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <PeopleAltIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Estudiantes</p>
                            </div>
                        </Button>
                    </Link>
                    <Link  to="/dashboard/pnfs">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <SchoolIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>PNFS</p>
                            </div>
                        </Button>
                    </Link>
                    <Link  to="/dashboard/secciones">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <FormatListBulletedIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Secciones</p>
                            </div>
                        </Button>
                    </Link>
                    <Link  to="/dashboard/proyectos">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <AccountTreeIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Proyectos</p>
                            </div>
                        </Button>
                    </Link>
                    <Link  to="/dashboard/noticias">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <ArticleIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Noticias</p>
                            </div>
                        </Button>
                    </Link>
                </Fragment>
            }
            {
                ['A', 'ER'].includes(userRol) &&
                <Fragment>
                    <Link  to="/dashboard/radioOnlineEmision">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <MicIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Emisión de Radio</p>
                            </div>
                        </Button>
                    </Link>
                    <Link  to="/dashboard/grabaciones">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <RadioButtonCheckedIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Grabaciones</p>
                            </div>
                        </Button>
                    </Link>
                </Fragment>
            }
            {
                ['A'].includes(userRol) &&
                <Fragment>
                    <Link  to="/dashboard/usuarios">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <AccountBoxIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Usuarios</p>
                            </div>
                        </Button>
                    </Link>
                    <Link  to="/dashboard/logs">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <ManageSearchIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Logs</p>
                            </div>
                        </Button>
                    </Link>
                    <Link  to="/dashboard/estadisticas/visitasWebsite">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <VisibilityIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Estadísticas Website</p>
                            </div>
                        </Button>
                    </Link>
                    <Link  to="/dashboard/estadisticas/visitasRadioOnline">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <PodcastsIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Estadísticas Radio</p>
                            </div>
                        </Button>
                    </Link>
                    <Link  to="/dashboard/estadisticas/suscripcionesRadio">
                        <Button variant="outlined" style={{width: '300px', margin: '1rem'}} color="success">
                            <div className='d-flex justify-around flex-column p-4'>
                                <SubscriptionsIcon style={{fontSize: '4rem'}}/>
                                <p style={{fontSize: '1.2rem'}}>Suscripciones Radio</p>
                            </div>
                        </Button>
                    </Link>
                </Fragment>
            }
            <div></div>
            <br />
            <br />
        </div>
    )
};

export default Inicio;