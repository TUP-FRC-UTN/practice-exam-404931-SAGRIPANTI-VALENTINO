import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Order } from '../models/order';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule, ReactiveFormsModule],
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css'
})
export class ViewOrdersComponent implements OnInit {

  serviceOrder: ApiService = inject(ApiService)

  allOrders: Order[] = []
  filteredData: Order[] = []

  search: FormControl = new FormControl('')

  ngOnInit(): void {
    this.getOrders()
  }

  getOrders() {
    this.serviceOrder.getOrders().subscribe({
      next: (data) => {
        this.allOrders = data
        this.filteredData = data
      },
      error: (error) => {
        console.error("Error", error)
      }
    })

    this.search.valueChanges.subscribe(data => {
      if (data === null || data === '') {
        this.filteredData = this.allOrders
      }
      else {
        this.filteredData = this.allOrders.filter(order => 
            order.customerName.toUpperCase().includes(this.search.value.toUpperCase()) ||
            order.email.toUpperCase().includes(this.search.value.toUpperCase())
        )
      }
    })
  }
}
