import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Order } from '../models/order';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit{
  
  serviceOrder : ApiService = inject(ApiService)

  order: FormGroup = new FormGroup({
    nombre : new FormControl(''),
    email : new FormControl(''),
    productos: new FormArray([]),
    total : new FormControl(''),
    orderCode : new FormControl(''),
    timestamp : new FormControl('')
  })

  allProducts: Product[] = []
  ngOnInit(): void {
    this.serviceOrder.getProducts().subscribe(data => {
      this.allProducts = data
    })
  }

  get productos() {
    return this.order.controls['productos'] as FormArray
  }
  agregarProducto() {
    const producto = new FormGroup({
      productId: new FormControl(''),
      cantidad: new FormControl(''),
      stock: new FormControl(''),
      precio: new FormControl('')
    });
    this.productos.push(producto);
  }
  

  quitarProducto(index : number) {
    this.productos.removeAt(index)
  }
  sendForm() {
    console.log("Esto es en formFGropu: " + this.order);

    if (this.order.valid) {
      const order = this.order.value as Order
      console.log("Esto es casteado a Order: " + order);
      
      this.serviceOrder.postOrder(order).subscribe({
        next: () => {
          alert("Orden creada con exito!")
          this.order.reset()
        },
        error: (error) => {
          alert("Hubo un error al querer crear la orden...")
          console.error(error)
        }
      })
    }
    
  }
}
