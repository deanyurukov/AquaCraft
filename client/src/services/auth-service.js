import { endpoints } from "../api/endpoints";

export default {
    register: async (username, email, password, re_password) => {
        try {
            if (password !== re_password) {
                throw new Error("Паролите не съвпадат.");
            }
            
            const response = await fetch(endpoints.register, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return [data, undefined];
        }
        catch (err) {
            console.error(err);
            return [undefined, err.message];
        }
    },
    login: async (email, password) => {
        try {
            const response = await fetch(endpoints.login, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return [data, undefined];
        }
        catch (err) {
            console.error(err);
            return [undefined, err.message];
        }
    },
    logout: async () => {
        try {
            const response = await fetch(endpoints.logout, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken")),
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return [data, undefined];
        }
        catch (error) {
            console.error(error);
            return [undefined, error.message];
        }
    },
    getAuth: async () => {
        const accessToken = JSON.parse(localStorage.getItem('accessToken'));

        try {
            const response = await fetch(endpoints.getAuth, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "X-Authorization": accessToken,
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data.isValid;
        }
        catch (err) {
            console.error(err);
            localStorage.removeItem('accessToken');
        }
    },
    getUserData: async () => {
        const accessToken = JSON.parse(localStorage.getItem('accessToken'));

        try {
            const response = await fetch(endpoints.getUserData, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "X-Authorization": accessToken,
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return [data.data, undefined];
        }
        catch (err) {
            console.error(err);
            return [undefined, err.message];
        }
    },
    changeUserData: async (username, email, password) => {
        const accessToken = JSON.parse(localStorage.getItem('accessToken'));
    
        try {
            const response = await fetch(endpoints.changeUserData, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": accessToken
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                })
            });
    
            const data = await response.json();
    
            if ( ! response.ok) {
                throw new Error(data.message);
            }
    
            return [data, undefined];
        }
        catch (err) {
            console.error(err);
            return [undefined, err.message];
        }
    },
    changeUserPassword: async (password, new_password) => {
        const accessToken = JSON.parse(localStorage.getItem('accessToken'));
    
        try {
    
            if (password === "", new_password === "") {
                throw new Error("Попълнете всички полета!");
            }
    
            const response = await fetch(endpoints.changeUserPassword, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": accessToken
                },
                body: JSON.stringify({
                    password,
                    new_password,
                })
            });
    
            const data = await response.json();
    
            if ( ! response.ok) {
                throw new Error(data.message);
            }
    
            return [data, undefined];
        }
        catch (err) {
            console.error(err);
            return [undefined, err.message];
        }
    }
};