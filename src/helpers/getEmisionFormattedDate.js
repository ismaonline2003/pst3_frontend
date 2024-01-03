export default function getEmisionFormattedDate(data={}) {
    let timeStr = "";
    if(data.fecha_inicio) {
        const currentTime = new Date();
        const diff = currentTime.getTime() - data.fecha_inicio.getTime();
        const secondsDiff = diff/ 1000;
        const minutesDiff = secondsDiff/60;
        const hourDiff = minutesDiff/60;
        let hoursInt = parseInt(`${hourDiff}`.split('.')[0]);
        let minutesInt = parseInt(`${minutesDiff}`.split('.')[0]);
        let hours = hoursInt;
        let minutes = parseInt(minutesDiff - (hoursInt*60));
        let seconds = parseInt(secondsDiff - (minutesInt*60));

        if(hours < 10) {
            hours = `0${hours}`;
        }

        if(minutes < 10) {
            minutes = `0${minutes}`;
        }

        if(seconds < 10) {
            seconds = `0${seconds}`;
        }
        timeStr = `${hours}:${minutes}:${seconds}`;
    }
    return timeStr;
}