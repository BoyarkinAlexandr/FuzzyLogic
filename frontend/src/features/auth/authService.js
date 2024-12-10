import axios from "axios";


const BACKEND_DOMAIN = "http://localhost:8000"

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`
//const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`




const register = async (userData) => {
    try {
        const response = await axios.post(REGISTER_URL, userData, {
            headers: {
                "Content-type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Response error:', error.response.data);
        } else {
            console.error('Request error:', error.message);
        }
        throw error; // Важно выбросить ошибку, чтобы обработать ее на уровне Redux
    }
}



const authService = { register }


export default authService