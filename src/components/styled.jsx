import { styled } from '@mui/system';
const styledComponents = {
    dahsboardPanelh1: styled('h1')({
        color: 'blue',
        fontSize: '2rem',
        fontWeight: '700'
    }),
    dahsboardPanelh2: styled('h2')({
        color: 'blue',
        fontSize: '1.6rem',
        fontWeight: '700'
    }),
    fotoCarnetBig: styled('img')({
        width: '200px', 
        height: '200px', 
        margin: '0 auto', 
        borderRadius:"50%"
    }),
    fotoCarnetBigEdit: styled('div')({
        width: '200px', 
        height: '200px', 
        margin: '0 auto', 
        borderRadius:"50%",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        cursor: 'pointer',
        position: 'relative'
    }),
    fotoCarnetBigEditLayer: styled('div')({
        width: '200px', 
        height: '200px', 
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
        alignItems: 'center'
    }),
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