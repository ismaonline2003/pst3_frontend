export default function authenticateToken() {
    const returnDict = {
        token:  localStorage.getItem('token') ?? "",
        expirationTime:  localStorage.getItem('token_exp_time') ?? 0,
        isExpired: false
    }
    const currentTime = new Date();
    if(currentTime.getTime() > returnDict.expirationTime) {
        returnDict.isExpired = true
    }
    return returnDict;
};