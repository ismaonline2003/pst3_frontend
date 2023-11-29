export default function getFormattedDate(date) {
    let dateStr = "";
    if(date instanceof Date) {
        if(!isNaN(date)) {
            dateStr = date.toISOString().slice(0,10).replace(/-/g,"-");
        }
    }
    return dateStr;
}