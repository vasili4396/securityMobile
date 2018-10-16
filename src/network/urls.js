export const API_ENDPOINT = 'http://212.109.194.87/api/'

export const URLS = {
    code: {
        OK: 200
    },
    url: {
        //other
        getShop: API_ENDPOINT + 'other/get_department',
        //auth
        signIn: API_ENDPOINT + 'auth/signin',
        logout: API_ENDPOINT + 'auth/signout',
        updateCSRF: API_ENDPOINT + 'auth/update_csrf',
        //cashier
        workerInfo: API_ENDPOINT + 'timetable/cashier/get_cashier_info',
        setWorkerInfo: API_ENDPOINT + 'timetable/cashier/set_cashier_info',
        getWorkerTimetable: API_ENDPOINT + 'timetable/cashier/get_cashier_timetable'
    }
}

export default URLS