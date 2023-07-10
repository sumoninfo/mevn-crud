import moment from "moment";

const filters = {
    upperCase(string) {
        if (string === '') {
            return "";
        }
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    dateFormat(date) {
        if (date === '') {
            return "";
        }
        return moment(date).format('lll');
    }
}
export default filters;
