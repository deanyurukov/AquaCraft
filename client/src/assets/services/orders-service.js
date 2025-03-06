import { endpoints } from "../api/endpoints.js";

export default {
    addOrder: async (name, town, phone, email, deliveryWay) => {
        try {
            const response = await fetch(endpoints.addOrder, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken"))
                },
                body: JSON.stringify({
                    name: name.trim(),
                    town: town.trim(),
                    phone: phone.trim(),
                    email: email.trim(),
                    deliveryWay,
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
    getOrdersByUser: async () => {
        try {
            const response = await fetch(endpoints.getOrders, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken"))
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
    getOrderById: async (orderId) => {
        try {
            const response = await fetch(endpoints.getOneOrder(orderId), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": JSON.parse(localStorage.getItem("accessToken"))
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
            return undefined;
        }
    }
};