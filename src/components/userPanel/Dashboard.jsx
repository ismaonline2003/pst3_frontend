import { React, useState, useContext, useEffect, Fragment } from 'react'
import axios from "axios";
import { Container, Box} from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import EmisionPanel from './emisionPanel/EmisionPanel';
import Inicio from './Inicio';
import AppBar from './AppBar';
import SideBar from './SideBar';

const paneles = {
    emision_panel: EmisionPanel,
    inicio: Inicio
}

const Dashboard = ({sessionVals, panelName}) => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [sideBarXs, setSideBarXs] = useState(4);
    const [contentScreenXs, setContentScreenXs] = useState(8);
    const [personData, setPersonData] = useState({});
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
                             {/*Style="width: 100%, margin-top: 1rem"*/}
                                <Panel/>
                        </Container>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
