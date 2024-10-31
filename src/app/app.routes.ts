import { Routes } from '@angular/router';
import { CreateOrderComponent } from './create-order/create-order.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';

export const routes: Routes = [
    {
        path : "create/order", component: CreateOrderComponent
    },
    {
        path : "orders", component: ViewOrdersComponent
    },
    {
        path : '', component: CreateOrderComponent
    },
    {
        path : "**", component: CreateOrderComponent
    }
];
