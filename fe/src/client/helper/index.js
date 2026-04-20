import moment from 'moment'
export default {
    formatPrice(value, minimum = 2, maximum = 2) {
        try {
           return new Intl.NumberFormat('en-US',
                {
                    minimumFractionDigits: minimum,
                    maximumFractionDigits: maximum
                })
                .format(Number(value))
        }
        catch (error) {
            console.log(err)
            return value;
        }
    },

    formatDate(value) {
        return moment(new Date(value)).format('HH:mm:ss')
    },

    formatDateTime(value) {
        return moment(new Date(value)).format('YYYY-MM-DD HH:mm:ss')
    }
}