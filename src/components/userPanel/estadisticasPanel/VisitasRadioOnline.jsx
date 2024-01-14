import * as React from 'react';
import { useState, useEffect, useContext, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement, 
    ArcElement,
    Colors
  } from 'chart.js'

import { Line, Bar, Pie } from 'react-chartjs-2'


//material UI
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReplayIcon from '@mui/icons-material/Replay';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

//own
import SearchBar from '../SearchBar';
import styledComponents from '../../styled';
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import getTurnoName from '../../../helpers/getTurnoName';


const searchBarParameters = [
    { value: 'ref', label: 'Referencia', type: "number"},
    { value: 'nombre', label: 'Nombre', type: "search"}
];
const searchSelectValues = [];

const periods = [
    {
        label: 'Hoy',
        value: 'today'
    },
    {
        label: 'Ayer',
        value: 'yesterday'
    },
    {
        label: 'Ultima Semana',
        value: 'lastWeek'
    },
    {
        label: 'Ultimos 14 dias',
        value: 'last14days'
    },
    {
        label: 'Ultimos Mes',
        value: 'lastMonth'
    },
    {
        label: 'Ultimos 60 dias',
        value: 'last60days'
    },
    {
        label: 'Ultimos 90 dias',
        value: 'last90days'
    },
    {
        label: 'Ultimos 120 dias',
        value: 'last120days'
    },
    {
        label: 'Ultimos 6 meses',
        value: 'last6Months'
    },
    {
        label: 'Ultimo Año',
        value: 'lastYear'
    },
    {
        label: 'Establecer Periodos',
        value: 'periodDates'
    }
]

export default function VisitasRadioOnline({}) {
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [ visitasRadioConfig, setVisitasRadioConfig ] = useState(false);
    const [ suscripcionesRadioConfig, setSuscripcionesRadioConfig ] = useState(false);
    //
    const [ suscripcionesPeriodSelected, setSuscripcionesPeriodSelected] = useState("today");
    const [ suscripcionesPeriodDate1, setSuscripcionesPeriodDate1] = useState("");
    const [ suscripcionesPeriodDate2, setSuscripcionesPeriodDate2] = useState("");  

    //
    const [ tendenciaTraficoPeriodSelected, setTendenciaTraficoPeriodSelected] = useState("today");
    const [ tendenciaTraficoPeriodDate1, setTendenciaTraficoPeriodDate1] = useState("");
    const [ tendenciaTraficoPeriodDate2, setTendenciaTraficoPeriodDate2] = useState("");
    
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        ArcElement,
        Colors,
        Title,
        Tooltip,
        Legend
    )
    

    const setVisitasRadio = (data) => {
        let visitorsDataSetVals = [];
        let visitsDataSetVals = [];
        let labels = [];

        for(let i = 0; i < data.length; i++) {
            let visitors_num = 0;
            let visits = 0;
            if(data[i][1].visitors) {
                visitors_num = data[i][1].visitors;               
            }
            if(data[i][1].visits) {
                visits = data[i][1].visits;               
            }
            labels.push(data[i][0]);
            visitorsDataSetVals.push(visitors_num);
            visitsDataSetVals.push(visits);
        }

        setVisitasRadioConfig({
            labels: labels,
            datasets: [
                {
                    label: 'Visitantes',
                    data: visitorsDataSetVals,
                    fill: false,
                    borderColor: '#41a8ec',
                    tension: 0.1
                },
                {
                    label: 'Visitas',
                    data: visitsDataSetVals,
                    fill: false,
                    borderColor: '#fe6687',
                    tension: 0.1
                }
            ]
        })
    }

    const setRadioSuscripciones = (data) => {
        let visitasDataSetVals = [];
        let labels = [];

        for(let i = 0; i < data.length; i++) {
            labels.push(data[i][0]);
            visitasDataSetVals.push(data[i][1]);
        }

        setSuscripcionesRadioConfig({
            labels: labels,
            datasets: [
                {
                    label: 'Visitas',
                    data: visitasDataSetVals,
                    fill: false,
                    borderColor: '#41a8ec',
                    tension: 0.1
                }
            ]
        })
    }

    const getRadioSuscripciones = async () => {
        setBlockUI(true);
        if(!suscripcionesPeriodSelected) {
            setBlockUI(false);
            setNotificationMsg("Debe seleccionar una opción.");
            setNotificationType('warning');
            setShowNotification(true);
            return;
        }
        if(suscripcionesPeriodSelected === 'periodDates') {
            if(!suscripcionesPeriodDate1) {
                setBlockUI(false);
                setNotificationMsg("Debe seleccionar una fecha de inicio.");
                setNotificationType('warning');
                setShowNotification(true);
                return;
            }
            if(!suscripcionesPeriodDate2) {
                setBlockUI(false);
                setNotificationMsg("Debe seleccionar una fecha de fin.");
                setNotificationType('warning');
                setShowNotification(true);
                return;
            }
        }
        const token = localStorage.getItem('token');
        const config = {headers: {'authorization': token}};
        const query =  `option=${suscripcionesPeriodSelected}&date_1=${suscripcionesPeriodDate1}&date_2=${suscripcionesPeriodDate2}`;
        const url = `${consts.backend_base_url}/api/estadisticas/suscripcionesRadio?${query}`;
        try {
            const response = await axios.get(url, config);
            setRadioSuscripciones(response.data.data);
        } catch(err) {
            setBlockUI(false);
            setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
            setNotificationType('error');
            setShowNotification(true);
        }
        setBlockUI(false);
    }

    const getVisitasRadio = async () => {
        setBlockUI(true);
        if(!tendenciaTraficoPeriodSelected) {
            setBlockUI(false);
            setNotificationMsg("Debe seleccionar una opción.");
            setNotificationType('warning');
            setShowNotification(true);
            return;
        }
        if(tendenciaTraficoPeriodSelected === 'periodDates') {
            if(!tendenciaTraficoPeriodDate1) {
                setBlockUI(false);
                setNotificationMsg("Debe seleccionar una fecha de inicio.");
                setNotificationType('warning');
                setShowNotification(true);
                return;
            }
            if(!tendenciaTraficoPeriodDate2) {
                setBlockUI(false);
                setNotificationMsg("Debe seleccionar una fecha de fin.");
                setNotificationType('warning');
                setShowNotification(true);
                return;
            }
        }
        const token = localStorage.getItem('token');
        const config = {headers: {'authorization': token}};
        const query =  `option=${tendenciaTraficoPeriodSelected}&date_1=${tendenciaTraficoPeriodDate1}&date_2=${tendenciaTraficoPeriodDate2}`;
        const url = `${consts.backend_base_url}/api/estadisticas/visitasRadio?${query}`;
        try {
            const response = await axios.get(url, config);
            setVisitasRadio(response.data.data);
        } catch(err) {
            setBlockUI(false);
            setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
            setNotificationType('error');
            setShowNotification(true);
        }
        setBlockUI(false);
    }

    const getGeneralData = async (allDataUpdate=true) => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers: {'authorization': token}};
        const url = `${consts.backend_base_url}/api/estadisticas/radioOnlineGeneral`;
        try {
            const response = await axios.get(url, config);
            setVisitasRadio(response.data.data.visitas_radio);
            setRadioSuscripciones(response.data.data.suscripciones_radio);
        } catch(err) {
            console.log(err);
            setBlockUI(false);
            setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
            setNotificationType('error');
            setShowNotification(true);
        }
        setBlockUI(false);
    }


    useEffect(() => {
        getGeneralData();
    }, [])

    return (
        <React.Fragment>
            <br /> 
            <StyledH1>Estadísticas Radio Online</StyledH1>
            <br />
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: '2rem', fontWeight: '700'}} color="text.primary" gutterBottom>
                        Tendencia del Tráfico Diario
                    </Typography>
                    {
                        visitasRadioConfig &&
                        <Line
                            datasetIdKey='tendencia_trafico_diario'
                            data={visitasRadioConfig}
                        />
                    }
                </CardContent>
                <CardActions className="p-4 d-flex justify-left flex-row flex-wrap">
                    <FormControl sx={{ m: 1, width: '250px' }} variant="outlined">
                        <TextField size="small" id="periodos" select label="Periodos" defaultValue={"today" ? periods : tendenciaTraficoPeriodSelected} 
                            onChange={(e) => {
                                setTendenciaTraficoPeriodDate1("");
                                setTendenciaTraficoPeriodDate2("");
                                setTendenciaTraficoPeriodSelected(e.target.value);
                            }}>
                            {periods.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                    {
                        tendenciaTraficoPeriodSelected === 'periodDates' &&
                        <Fragment>
                            <FormControl sx={{ m: 1, width: '250px' }} variant="outlined">
                                <TextField size="small" id="date_1" label="Fecha Inicio" variant="outlined" type="date" 
                                    defaultValue={new Date()} onChange={(e) => setTendenciaTraficoPeriodDate1(e.target.value)}/>
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '250px' }} variant="outlined">
                                <TextField size="small" id="date_2" label="Fecha Fin" variant="outlined" type="date" 
                                    defaultValue={new Date()} onChange={(e) => setTendenciaTraficoPeriodDate2(e.target.value)}/>
                            </FormControl>
                        </Fragment>
                    }
                    <Button size="small" onClick={(e) => getVisitasRadio()}>Actualizar <ReplayIcon></ReplayIcon></Button>
                </CardActions>
            </Card>
            <br />
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: '2rem', fontWeight: '700'}} color="text.primary" gutterBottom>
                        Suscripciones en el tiempo
                    </Typography>
                    {
                        suscripcionesRadioConfig &&
                        <Line
                            datasetIdKey='tendencia_trafico_diario'
                            data={suscripcionesRadioConfig}
                        />
                    }
                </CardContent>
                <CardActions className="p-4 d-flex justify-left flex-row flex-wrap">
                    <FormControl sx={{ m: 1, width: '250px' }} variant="outlined">
                        <TextField size="small" id="periodos" select label="Periodos" defaultValue={"today" ? periods : suscripcionesPeriodSelected} 
                            onChange={(e) => {
                                setSuscripcionesPeriodDate1("");
                                setSuscripcionesPeriodDate2("");
                                setSuscripcionesPeriodSelected(e.target.value);
                            }}>
                            {periods.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                    {
                        suscripcionesPeriodSelected === 'periodDates' &&
                        <Fragment>
                            <FormControl sx={{ m: 1, width: '250px' }} variant="outlined">
                                <TextField size="small" id="date_1" label="Fecha Inicio" variant="outlined" type="date" 
                                    defaultValue={new Date()} onChange={(e) => setSuscripcionesPeriodDate1(e.target.value)}/>
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '250px' }} variant="outlined">
                                <TextField size="small" id="date_2" label="Fecha Fin" variant="outlined" type="date" 
                                    defaultValue={new Date()} onChange={(e) => setSuscripcionesPeriodDate2(e.target.value)}/>
                            </FormControl>
                        </Fragment>
                    }
                    <Button size="small" onClick={(e) => getRadioSuscripciones()}>Actualizar <ReplayIcon></ReplayIcon></Button>
                </CardActions>
            </Card>
        </React.Fragment>
    );
}