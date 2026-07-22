import type { AddProduct, AdminLoginData } from "../type"
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

export const updateOrderStatus = (orderId:string, data: string) => {
  return api.get("/order/status", {orderId, data});
};