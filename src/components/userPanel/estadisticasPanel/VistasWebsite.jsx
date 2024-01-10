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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

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
    const [ top10CatTable, setTop10CatTable] = useState({dataset: [], total: 0, total_percentage: 0});

    //
    const [ tendenciaTraficoPeriodSelected, setTendenciaTraficoPeriodSelected] = useState("today");
    const [ tendenciaTraficoPeriodDate1, setTendenciaTraficoPeriodDate1] = useState("");
    const [ tendenciaTraficoPeriodDate2, setTendenciaTraficoPeriodDate2] = useState("");
    //
    const [ top10CatPeriodSelected, setTop10CatPeriodSelected] = useState("today");
    const [ top10CatPeriodDate1, setTop10CatPeriodDate1] = useState("");
    const [ top10CatPeriodDate2, setTop10CatPeriodDate2] = useState("");
    const [ top10CatChartTypeSelected, setTop10CatChartTypeSelected] = useState('tabla');

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
    

    const setTop10CatChartData = (data) => {
        let vals = [];
        let labels = [];
        let total = 0;
        let totalPercentage = 0;
        console.log(data);
        for(let i = 0; i < data.length; i++) {
            if(data[i].category_name && data[i].percentage) {
                labels.push(`${data[i].category_name} | ${data[i].percentage}%`);
                totalPercentage += data[i].percentage;
            } else {
                labels.push(`Ninguna`);
            }
            total += parseInt(data[i].visits_num);
            vals.push(parseInt(data[i].visits_num));
        }

        let config = {
            labels: labels,
            datasets: [
                {
                    label: 'Top 10 Categorías de Noticias',
                    data: vals,
                    backgroundColor: ['#41a8ec', '#fe6687'],
                    borderColor: ['#41a8ec', '#fe6687']
                }
            ]
        }

        if(config.datasets.length > 0 && top10CatChartTypeSelected === 'torta') {
            config.datasets[0].backgroundColor = ['#36a2eb', '#ff6384', '#4bc0c0', '#ff9f40', '#9966ff', '#ffcd56', '#c9cbcf', '#31698e', '#8a1a32', '#2b8b8b'];
            config.datasets[0].borderColor = ['#36a2eb', '#ff6384', '#4bc0c0', '#ff9f40', '#9966ff', '#ffcd56', '#c9cbcf', '#31698e', '#8a1a32', '#2b8b8b'];
        }
        if(config.datasets.length > 0 && top10CatChartTypeSelected === 'tabla') {
            setTop10CatTable({dataset: data, total: total, total_percentage: totalPercentage});
        }

        setTop10CatConfig(config);
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

    const getTopCat10Data = async () => {
        setBlockUI(true);
        if(!top10CatPeriodSelected) {
            setBlockUI(false);
            setNotificationMsg("Debe seleccionar una opción.");
            setNotificationType('warning');
            setShowNotification(true);
            return;
        }
        if(top10CatPeriodSelected === 'periodDates') {
            if(!top10CatPeriodDate1) {
                setBlockUI(false);
                setNotificationMsg("Debe seleccionar una fecha de inicio.");
                setNotificationType('warning');
                setShowNotification(true);
                return;
            }
            if(!top10CatPeriodDate2) {
                setBlockUI(false);
                setNotificationMsg("Debe seleccionar una fecha de fin.");
                setNotificationType('warning');
                setShowNotification(true);
                return;
            }
        }
        const token = localStorage.getItem('token');
        const config = {headers: {'authorization': token}};
        const query =  `option=${top10CatPeriodSelected}&date_1=${top10CatPeriodDate1}&date_2=${top10CatPeriodDate2}`;
        const url = `${consts.backend_base_url}/api/estadisticas/top10Categorias?${query}`;
        try {
            const response = await axios.get(url, config);
            console.log(response);
            setTop10CatChartData(response.data);
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
                setTop10CatChartData(response.data.data.top_10_categories);
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
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={top10CatChartTypeSelected} onChange={(e, newVal) => setTop10CatChartTypeSelected(newVal)} aria-label="basic tabs example">{/* top10CatChartTypeSelected */}
                                <Tab label="Tabla" value="tabla" />
                                <Tab label="Barras" value="barras" />
                                <Tab label="Torta" value="torta" />
                            </Tabs>
                        </Box>
                            {
                                top10CatTable && top10CatChartTypeSelected === 'tabla' &&
                                <Box sx={{ p: 3 }}>
                                    <Typography sx={{ fontSize: '2rem', fontWeight: '700'}} color="text.primary" gutterBottom>
                                        Tabla
                                    </Typography>
                                    <br />
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left" width={'50%'}>
                                                        <strong>Categoría</strong>
                                                    </TableCell>
                                                    <TableCell align="left" width={'25%'}>
                                                        <strong>Visitas</strong>
                                                    </TableCell>
                                                    <TableCell align="left" width={'25%'}>
                                                        <strong>Porcentaje</strong>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {
                                                top10CatTable.dataset.map((item) => {
                                                    return(
                                                        <TableRow>
                                                            <TableCell align="left" width={'50%'}>
                                                                {item.category_name}
                                                            </TableCell>
                                                            <TableCell align="left" width={'25%'}>
                                                                {item.visits_num}
                                                            </TableCell>
                                                            <TableCell align="left" width={'25%'}>
                                                                {item.percentage}%
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            }
                                            <TableRow>
                                                <TableCell align="left" width={'50%'}>
                                                   Total
                                                </TableCell>
                                                <TableCell align="left" width={'25%'}>
                                                    {top10CatTable.total}
                                                </TableCell>
                                                <TableCell align="left" width={'25%'}>
                                                    {top10CatTable.total_percentage}%
                                                </TableCell>
                                            </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            }
                            {
                                top10CatConfig && top10CatChartTypeSelected === 'barras' &&
                                <Box sx={{ p: 3 }}>
                                    <Typography sx={{ fontSize: '2rem', fontWeight: '700'}} color="text.primary" gutterBottom>
                                        Barras
                                    </Typography>
                                    <br />
                                    <Bar
                                        datasetIdKey='top-10-cat-barras'
                                        data={top10CatConfig}
                                    />
                                </Box>
                            }
                            {
                                top10CatConfig && top10CatChartTypeSelected === 'torta' &&
                                <Box sx={{ p: 3}}>
                                    <Typography sx={{ fontSize: '2rem', fontWeight: '700'}} color="text.primary" gutterBottom>
                                        Torta
                                    </Typography>
                                    <br />
                                    <Pie
                                        datasetIdKey='top-10-cat-torta'
                                        data={top10CatConfig}
                                    />
                                </Box>
                            }
                    </Box>
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
                    <Button size="small" onClick={(e) => getTopCat10Data()}>Actualizar <ReplayIcon></ReplayIcon></Button>
                </CardActions>
            </Card>
        </React.Fragment>
    );
}