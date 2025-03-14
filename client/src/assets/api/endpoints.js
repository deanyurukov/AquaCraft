// const baseUrl = "http://localhost:5001";
const baseUrl = "https://aqua-craft-server.vercel.app";

export const endpoints = {
    register: `${baseUrl}/users/register`,
    login: `${baseUrl}/users/login`,
    logout: `${baseUrl}/users/logout`,
    getAuth: `${baseUrl}/users/getAuth`,
    getUserData: `${baseUrl}/users/userData`,
    changeUserData: `${baseUrl}/users/changeUserData`,
    changeUserPassword: `${baseUrl}/users/changeUserPassword`,
    getAllProducts: `${baseUrl}/products/getAll`,
    getAllByUserId: `${baseUrl}/products/get/id`,
    addOrder: `${baseUrl}/addOrder`,
    getOrders: `${baseUrl}/orders/getByUser`,
    getOneOrder: (orderId) => `${baseUrl}/orders/${orderId}`,
    getOneProduct: (productId) => `${baseUrl}/products/${productId}`,
    addToCart: (productId) => `${baseUrl}/products/addToCart/${productId}`,
    addFav: (productId) => `${baseUrl}/products/favorites/add/${productId}`,
    removeFav: (productId) => `${baseUrl}/products/favorites/remove/${productId}`,
    getFav: `${baseUrl}/products/favorites/get`,
    addProduct: `${baseUrl}/products/addOne`,
    changeProduct: (productId) => `${baseUrl}/products/change/${productId}`,
    changeInStock: (productId) => `${baseUrl}/products/changeInStock/${productId}`,
    delete: (productId) => `${baseUrl}/products/delete/${productId}`
};