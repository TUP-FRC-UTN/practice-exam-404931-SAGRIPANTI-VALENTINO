import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http : HttpClient = inject(HttpClient)
  urlBase : string = "http://localhost:3000"


  getProducts() {
    return this.http.get<Product[]>(`${this.urlBase}/products`)
  }
  getOrders() {
    return this.http.get<Order[]>(`${this.urlBase}/orders`)
  }
  getOrderByEmail(email: string) {
    return this.http.get<Order[]>(`${this.urlBase}/orders?email:` + email)
  }
  postOrder(order: Order) {
    return this.http.post<Order>(`${this.urlBase}/orders`, order)
  }
}
