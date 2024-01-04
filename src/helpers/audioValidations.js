export default function audioValidations(file) {
    let objReturn = {status: 'success', msg: ''}
    if(!["audio/mp3", "audio/mpeg"].includes(file.type)) {
        objReturn = {status: 'error', msg: 'El audio debe estar en formato mp3.'}
        return objReturn;
    }
    if(file.size > 524300000) {
        objReturn = {status: 'error', msg: 'El audio debe tener un peso máximo de 50 mb (megabytes).'}
        return objReturn;
    }
    return objReturn;
}