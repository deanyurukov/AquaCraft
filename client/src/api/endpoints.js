const baseUrl = import.meta.env.VITE_LOCAL_SERVER_PATH || import.meta.env.VITE_DEPLOYED_SERVER_PATH;

export const endpoints = {
    register: `${baseUrl}/users/register`,
    login: `${baseUrl}/users/login`,
    logout: `${baseUrl}/users/logout`,
    getAuth: `${baseUrl}/users/getAuth`,
    getUserData: `${baseUrl}/users/userData`,
    changeUserData: `${baseUrl}/users/changeUserData`,
    changeUserPassword: `${baseUrl}/users/changeUserPassword`,

    getAllByUserId: `${baseUrl}/products/cart/get`,
    addToCart: (productId) => `${baseUrl}/products/cart/add/${productId}`,
    getOneProduct: (productId) => `${baseUrl}/products/${productId}`,
    addFav: (productId) => `${baseUrl}/products/favorites/add/${productId}`,
    removeFav: (productId) => `${baseUrl}/products/favorites/remove/${productId}`,
    getFav: `${baseUrl}/products/favorites/get`,
    getAllProducts: `${baseUrl}/products/get/all`,
    
    addOrder: `${baseUrl}/orders/add`,
    getOrders: `${baseUrl}/orders/getByUser`,
    getAllOrders: `${baseUrl}/orders/all`,
    completeOrder: (orderId) => `${baseUrl}/orders/complete/${orderId}`,
    getOneOrder: (orderId) => `${baseUrl}/orders/${orderId}`,
    
    addProduct: `${baseUrl}/admin/create`,
    export: `${baseUrl}/admin/export`,
    changeProduct: (productId) => `${baseUrl}/admin/change/${productId}`,
    changeInStock: (productId) => `${baseUrl}/admin/changeInStock/${productId}`,
    delete: (productId) => `${baseUrl}/admin/delete/${productId}`,
};