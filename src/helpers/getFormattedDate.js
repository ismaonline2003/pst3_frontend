export default function getFormattedDate(date=false, datetime=false) {
    let dateStr = "";
    if(date instanceof Date) {
        if(!isNaN(date)) {
            dateStr = date.toISOString().slice(0,10).replace(/-/g,"-");
        }
        if(datetime) {
            dateStr =  `${dateStr} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
    }
    return dateStr;
}