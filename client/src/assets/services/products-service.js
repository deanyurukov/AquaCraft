import { endpoints } from "../api/endpoints.js";

export default {
    getAll: async () => {
        try {
            const response = await fetch(endpoints.getAllProducts, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken")),
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data.data;
        }
        catch (err) {
            console.error(err);
        }
    },
    getOne: async (productId) => {
        try {
            const response = await fetch(endpoints.getOneProduct(productId), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken")),
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data.data;
        }
        catch (err) {
            console.error(err);
        }
    },
    deleteOne: async (productId, message) => {
        if (confirm(message)) {
            try {
                const response = await fetch(endpoints.getOneProduct(productId), {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Authorization": JSON.parse(localStorage.getItem("accessToken")),
                    }
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
        }
    },
    updateOne: async (productId, quantity) => {
        try {
            const response = await fetch(endpoints.getOneProduct(productId), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken")),
                },
                body: JSON.stringify({
                    quantity: Number(quantity),
                }),
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
    getAllByUserId: async () => {
        try {
            const response = await fetch(endpoints.getAllByUserId, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken")),
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data.data;
        }
        catch (err) {
            console.error(err);
        }
    },
    addToFavorites: async (productId) => {
        try {
            const response = await fetch(endpoints.addFav(productId), {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken")),
                }
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
    removeFromFavorites: async (productId) => {
        try {
            const response = await fetch(endpoints.removeFav(productId), {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken")),
                }
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
    getFavorites: async () => {
        let data = {};
        try {
            const response = await fetch(endpoints.getFav, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken")),
                }
            });

            data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            return data.data;
        }
    },
    addToCart: async (id) => {
        try {
            const response = await fetch(endpoints.addToCart(id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": JSON.parse(localStorage.getItem('accessToken')),
                },
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
    addOne: async (title, imageUrl, price, description) => {
        try {
            const response = await fetch(endpoints.addProduct, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": JSON.parse(localStorage.getItem('accessToken')),
                },
                body: JSON.stringify({
                    title,
                    imageUrl,
                    price,
                    description
                })
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
    }
};