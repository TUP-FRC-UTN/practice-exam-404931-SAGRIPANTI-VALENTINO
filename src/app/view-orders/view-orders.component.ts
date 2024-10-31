import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Order } from '../models/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css'
})
export class ViewOrdersComponent implements OnInit{
  
  serviceOrder : ApiService = inject(ApiService)

  allOrders : Order[] = []

  search : string | undefined

  ngOnInit(): void {
    this.serviceOrder.getOrders().subscribe(data => {
      this.allOrders = data
    })
  }

  onChanges() {

  }
}
