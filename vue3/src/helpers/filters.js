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
    },
    getImage(image) {
        if (image === '') {
            return "";
        }
        return `${process.env.VUE_APP_API_URL}/${image}`
    }
}
export default filters;
