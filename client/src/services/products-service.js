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
    addOne: async (title, images, price, description, inStock, company, type, typeDetails) => {
        try {
            const response = await fetch(endpoints.addProduct, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": JSON.parse(localStorage.getItem('accessToken')),
                },
                body: JSON.stringify({
                    title,
                    images,
                    price,
                    description,
                    inStock,
                    company,
                    type,
                    typeDetails
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
    },
    changeInStock: async (id, changedStock) => {
        try {
            const response = await fetch(endpoints.changeInStock(id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": JSON.parse(localStorage.getItem('accessToken')),
                },
                body: JSON.stringify({
                    changedStock
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
    },
    delete: async (id) => {
        try {
            const response = await fetch(endpoints.delete(id), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": JSON.parse(localStorage.getItem('accessToken')),
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
    changeOne: async (id, title, images, price, description, inStock, company, type, typeDetails) => {
        try {
            const response = await fetch(endpoints.changeProduct(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": JSON.parse(localStorage.getItem('accessToken')),
                },
                body: JSON.stringify({
                    title,
                    images,
                    price,
                    description,
                    inStock,
                    company,
                    type,
                    typeDetails
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
    },
    export: async () => {
        try {
            const response = await fetch(endpoints.export, {
                method: 'GET',
                headers: {
                    "X-Authorization": JSON.parse(localStorage.getItem('accessToken')),
                }
            });

            const blob = await response.blob();

            if (!response.ok) {
                throw new Error(data.message);
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "report.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
        catch (err) {
            console.error(err);
            return [undefined, err.message];
        }
    },
};