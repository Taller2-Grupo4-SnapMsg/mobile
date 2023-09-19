import axios from "axios";

const login = async (credentials) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/login`,
            credentials
        );

        return response.data;
    } catch (error) {
        // Mostrar los errores relevantes al usuario.
        // Los mensajes de error deberian usar un lenguaje 
        // que el usuario comprenda. 
        // Mostrar los mensajes de error del back, 
        // unicamente si son humanamente legibles.
        const message = (error.response?.data?.error
            // || error.message
            || 'Service is not available at the moment')
        console.error(message);
        throw new Error(message)
    }
};

export default login;
