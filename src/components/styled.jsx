import { styled } from '@mui/system';
const styledComponents = {
    dahsboardPanelh1: styled('h1')({
        color: 'rgb(51 65 85)',
        fontSize: '2rem',
        fontWeight: '700'
    }),
    dahsboardPanelh2: styled('h2')({
        color: 'rgb(51 65 85)',
        fontSize: '1.6rem',
        fontWeight: '700'
    }),
    dahsboardPanelh3: styled('h2')({
        color: 'rgb(51 65 85)',
        fontSize: '1.4rem',
        fontWeight: '400'
    }),
    fotoCarnet: styled('img')(({ theme }) => ({ 
        width: '100px',
        height: '100px',
        margin: '0 auto',
        borderRadius: '50%',
        [theme.breakpoints.up("xs")]: {
            width: '100px',
            height: '100px'
        },
        [theme.breakpoints.up("sm")]: {
            width: '200px',
            height: '200px'
        },
        [theme.breakpoints.up("md")]: {
            width: '200px',
            height: '200px'
        },
        [theme.breakpoints.up("lg")]: {
            width: '200px',
            height: '200px'
        },
        [theme.breakpoints.up("xl")]: {
            width: '200px',
            height: '200px'
        }
    })),
    fotoCarnetEdit: styled('div')(({ theme }) => ({
        width: '100px',
        height: '100px',
        margin: '0 auto', 
        borderRadius:"50%",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        cursor: 'pointer',
        position: 'relative',
        [theme.breakpoints.up("xs")]: {
            width: '100px',
            height: '100px'
        },
        [theme.breakpoints.up("sm")]: {
            width: '200px',
            height: '200px'
        },
        [theme.breakpoints.up("md")]: {
            width: '200px',
            height: '200px'
        },
        [theme.breakpoints.up("lg")]: {
            width: '200px',
            height: '200px'
        },
        [theme.breakpoints.up("xl")]: {
            width: '200px',
            height: '200px'
        }
    })),
    fotoCarnetEditLayer: styled('div')(({ theme }) => ({
        width: '100px',
        height: '100px',
        margin: '0 auto', 
        borderRadius:"50%",
        cursor: 'pointer',
        position: 'absolute',
        top: '1%',
        right: '1%',
        backgroundColor: 'rgba(0,0,0, 0.5)',
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.up("xs")]: {
            width: '100px',
            height: '100px'
        },
        [theme.breakpoints.up("sm")]: {
            width: '200px',
            height: '200px'
        },
        [theme.breakpoints.up("md")]: {
            width: '200px',
            height: '200px'
        },
        [theme.breakpoints.up("lg")]: {
            width: '200px',
            height: '200px'
        },
        [theme.breakpoints.up("xl")]: {
            width: '200px',
            height: '200px'
        }
    })),
    fotoCarnetSmall: styled('img')({
        width: '80px', 
        height: '80px', 
        margin: '0 auto', 
        borderRadius:"50%"
    }),
    StyledErrorNotification: styled('div')({
        fontSize: '1.6rem',
        fontWeight: '700'
    }),
    radioOnlineh1: styled('h1')({
        fontSize: '2rem',
        fontWeight: '700',
        color: '#4FC0D0'
    }),
    radioOnlineIcon: styled('img')({
        width: '100px !important'
    })
};

export default styledComponents;