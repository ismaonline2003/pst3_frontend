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
    BarElement
  } from 'chart.js'

import { Line, Bar } from 'react-chartjs-2'


//material UI
import VisibilityIcon from '@mui/icons-material/Visibility';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
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

const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
);

            /*
            -today
            -yesterday
            -lastWeek
            -last14days
            -lastMonth
            -last60days
            -last90days
            -last120days
            -last6Months
            -lastYear
            -periodDates
        */

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

export default function VistasWebsite({}) {
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const [ records, setRecords ] = useState([]);
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [ resumenTrafico, setResumenTrafico] = useState(false);
    const [ tendenciaTraficoDiarioConfig, setTendenciaTraficoDiarioConfig ] = useState(false);
    const [ top10CatConfig, setTop10CatConfig ] = useState(false);

    //
    const [ tendenciaTraficoPeriodSelected, setTendenciaTraficoPeriodSelected] = useState("today");
    const [ tendenciaTraficoPeriodDate1, setTendenciaTraficoPeriodDate1] = useState("");
    const [ tendenciaTraficoPeriodDate2, setTendenciaTraficoPeriodDate2] = useState("");
    //
    const [ top10CatPeriodSelected, setTop10CatPeriodSelected] = useState("today");
    const [ top10CatPeriodDate1, setTop10CatPeriodDate1] = useState("");
    const [ top10CatPeriodDate2, setTop10CatPeriodDate2] = useState("");
    const [ top10CatChartTypeSelected, setTop10CatChartTypeSelected] = useState("table");

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Tooltip,
        Legend
    )

    const setTop10CatChartData = (data) => {
        let vals = [];
        let labels = [];

        for(let i = 0; i < data.length; i++) {
            labels.push(`${data[i].category_name} | ${data[i].percentage}%`);
            vals.push(data[i].visits_num);
        }

        setTop10CatConfig({
            labels: labels,
            datasets: [
                {
                    label: 'Top 10 Categorías de Noticias',
                    data: vals,
                    fill: false,
                    borderColor: '#41a8ec',
                    tension: 0.1
                }
            ]
        });
    }

    const setTendenciaTraficoDiarioData = (data) => {
        let visitorsDataSetVals = [];
        let visitsDataSetVals = [];
        let labels = [];
        for(let i = 0; i < data.length; i++) {
            labels.push(data[i][0]);
            visitorsDataSetVals.push(data[i][1].visitors);
            visitsDataSetVals.push(data[i][1].visits);
        }
        console.log('visitorsDataSetVals', visitorsDataSetVals);
        console.log('visitsDataSetVals', visitsDataSetVals);

        setTendenciaTraficoDiarioConfig({
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

    const getTendenciaTraficoDiarioData = async () => {
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
        const url = `${consts.backend_base_url}/api/estadisticas/tendenciaTraficoDiario?${query}`;
        try {
            const response = await axios.get(url, config);
            console.log(response.data)
            setTendenciaTraficoDiarioData(response.data);
        } catch(err) {
            setBlockUI(false);
            setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
            setNotificationType('error');
            setShowNotification(true);
        }
        setBlockUI(false);
    }

    const getGeneralData = async (allDataUpdate=true) => {
        console.log('getGeneralData');
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers: {'authorization': token}};
        const url = `${consts.backend_base_url}/api/estadisticas/visitasWebGeneral`;
        try {
            const response = await axios.get(url, config);
            console.log(response.data.data)
            if(allDataUpdate) {
                setResumenTrafico(response.data.data.resumen_trafico);
                setTendenciaTraficoDiarioData(response.data.data.tendencia_trafico_diario);
            } else {
                setResumenTrafico(response.data.data.resumen_trafico);
            }
        } catch(err) {
            console.log(err);
            setBlockUI(false);
            setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
            setNotificationType('error');
            setShowNotification(true);
        }
        setBlockUI(false);
    }

    const handleSearchBtn = (searchVals) => {

    };

    useEffect(() => {
        getGeneralData();
    }, [])

    return (
        <React.Fragment>
            <br /> 
            <StyledH1>Estadísticas Website</StyledH1>
            <br />
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: '2rem', fontWeight: '700'}} color="text.primary" gutterBottom>
                        Resumen de tráfico
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" width={'50%'}>
                                        <strong>Tiempo</strong>
                                    </TableCell>
                                    <TableCell align="left" width={'25%'}>
                                        <strong>Visitantes</strong>
                                    </TableCell>
                                    <TableCell align="left" width={'25%'}>
                                        <strong>Visitas</strong>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                resumenTrafico && resumenTrafico  &&
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="left" width={'50%'}>
                                           Hoy
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.today.visitors}
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                        { resumenTrafico.today.visits}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" width={'50%'}>
                                           Ayer
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.yesterday.visitors}
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                        {resumenTrafico.yesterday.visits ? resumenTrafico.yesterday.visits : 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" width={'50%'}>
                                           Ultima Semana
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.lastWeek.visitors}
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.lastWeek.visits ? resumenTrafico.lastWeek.visits : 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" width={'50%'}>
                                           Ultimo Mes
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.lastMonth.visitors}
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.lastMonth.visits ? resumenTrafico.lastMonth.visits : 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" width={'50%'}>
                                           Ultimos 60 dias
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.last60days.visitors}
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.last60days.visits ? resumenTrafico.last60days.visits : 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" width={'50%'}>
                                           Ultimos 90 dias
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.last90days.visitors}
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.last90days.visits ? resumenTrafico.last90days.visits : 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" width={'50%'}>
                                           Ultimos 120 dias
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.last120days.visitors}
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.last120days.visits ? resumenTrafico.last120days.visits : 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" width={'50%'}>
                                           Este Año
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.thisYear.visitors}
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.thisYear.visits ? resumenTrafico.thisYear.visits : 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" width={'50%'}>
                                           Ultimo Año
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.lastYear.visitors}
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.lastYear.visits ? resumenTrafico.lastYear.visits : 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" width={'50%'}>
                                           Total
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.total.visitors}
                                        </TableCell>
                                        <TableCell align="left" width={'25%'}>
                                            {resumenTrafico.total.visits ? resumenTrafico.total.visits : 0}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            }
                        </Table>
                    </TableContainer>
                </CardContent>
                <CardActions className="p-4">
                    <Button size="small" onClick={(e) => getGeneralData(false)}>Actualizar <ReplayIcon></ReplayIcon></Button>
                </CardActions>
            </Card>
            <br />
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: '2rem', fontWeight: '700'}} color="text.primary" gutterBottom>
                        Tendencia del Tráfico Diario
                    </Typography>
                    {
                        tendenciaTraficoDiarioConfig &&
                        <Line
                            datasetIdKey='tendencia_trafico_diario'
                            data={tendenciaTraficoDiarioConfig}
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
                    <Button size="small" onClick={(e) => getTendenciaTraficoDiarioData()}>Actualizar <ReplayIcon></ReplayIcon></Button>
                </CardActions>
            </Card>
            <br />
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: '2rem', fontWeight: '700'}} color="text.primary" gutterBottom>
                        Top 10 Categorias
                    </Typography>
                    {
                        tendenciaTraficoDiarioConfig &&
                        <Bar
                            datasetIdKey='tendencia_trafico_diario'
                            data={tendenciaTraficoDiarioConfig}
                        />
                    }
                </CardContent>
                <CardActions className="p-4 d-flex justify-left flex-row flex-wrap">
                    <FormControl sx={{ m: 1, width: '250px' }} variant="outlined">
                        <TextField size="small" id="periodos" select label="Periodos" defaultValue={"today" ? periods : tendenciaTraficoPeriodSelected} 
                            onChange={(e) => {
                                setTop10CatPeriodDate1("");
                                setTop10CatPeriodDate2("");
                                setTop10CatPeriodSelected(e.target.value);
                            }}>
                            {periods.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                    {
                        top10CatPeriodSelected === 'periodDates' &&
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
                    <Button size="small" onClick={(e) => getTendenciaTraficoDiarioData()}>Actualizar <ReplayIcon></ReplayIcon></Button>
                </CardActions>
            </Card>
        </React.Fragment>
    );
}