import { Product } from "./product";

export interface Order {
    id: string,
    customerName: string,
    email: string,
    products: Product[],
    total: number,
    orderCode: string
    timestamp: Date
}