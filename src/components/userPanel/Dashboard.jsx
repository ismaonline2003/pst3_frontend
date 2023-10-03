import { React, useState, useContext, useEffect, Fragment } from 'react'
import axios from "axios";
import { Container, Box} from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import EmisionPanel from './emisionPanel/EmisionPanel';
import Estudiantes from './estudiantesPanel/Estudiantes';
import Inicio from './Inicio';
import AppBar from './AppBar';
import SideBar from './SideBar';
import SimpleNotification from '../generales/SimpleNotification';
import AppContext from '../../context/App';
import styledComponents from '../styled';

const paneles = {
    emision_panel: EmisionPanel,
    inicio: Inicio,
    estudiantes: Estudiantes
}

const Dashboard = ({sessionVals, panelName}) => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [sideBarXs, setSideBarXs] = useState(4);
    const [contentScreenXs, setContentScreenXs] = useState(8);
    const [personData, setPersonData] = useState({});
    const [notificationMsg, setNotificationMsg] = useState("");
    const [notificationType, setNotificationType] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const { blockUI, setBlockUI} = useContext(AppContext);
    let Panel = paneles[panelName];

    useEffect(() => {
        if(isSideBarOpen) {
            setSideBarXs(4);
            setContentScreenXs(8);
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

    useEffect(() => {
        console.log('showNotification', showNotification);
    }, [showNotification]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}></AppBar>
            <Box sx={{ flexGrow: 1 }}>
                <Grid  container spacing={2}>
                    <Grid item xs={sideBarXs}>
                        {isSideBarOpen ? <SideBar /> : <Fragment/>}
                    </Grid>
                    <Grid item xs={contentScreenXs}>
                        <Container>
                        <AppContext.Provider value={{blockUI, setBlockUI, setShowNotification, setNotificationMsg, setNotificationType}}>
                            {
                                (
                                    <div className='fixed right-4'>
                                        <SimpleNotification 
                                            message={notificationMsg}
                                            type={notificationType}
                                        />
                                    </div>
                                ) ? showNotification == true : ""
                            }
                            <Panel/>
                        </AppContext.Provider>
                        </Container>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
