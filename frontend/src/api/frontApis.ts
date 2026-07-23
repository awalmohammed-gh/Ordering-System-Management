import type { AddProduct, AdminLoginData, OrderData, PaymentData, UpdateStatus } from "../type"
import { api } from "./axios"


///authentication
export const adminLogin = (data:AdminLoginData) =>{
    return api.post(`/admin/admin-login/`, data)
}

export const adminLogout = () =>{
    return api.post(`/admin/admin-logout/`)
}


//add product
export const createProduct = (data:AddProduct) =>{
    return api.post("/product/create-product", data)
}

export const listProduct = () =>{
    return api.get("/product/list")
}

export const deleteProduct = (id:string) =>{
    return api.delete(`product/remove-product/${id}`)
}


//orders

export const listOrders = () =>{
    return api.get("/order/all-orders")
}

export const updateOrderStatus = (orderId:UpdateStatus, status:UpdateStatus ) => {
  return api.get("/order/status", {orderId, status});
};


export const makeOrder = (data) =>{
    return api.post("/order/place-order", data)
}

export const paymentOrder = (data:PaymentData) =>{
    return api.post("/order/paystack", data)
}