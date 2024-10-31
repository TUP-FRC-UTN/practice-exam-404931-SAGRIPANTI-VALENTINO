import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {

  service : ApiService = inject(ApiService)

  order: FormGroup = new FormGroup({
    nombre : new FormControl(''),
    email : new FormControl(''),
    productos: new FormArray([]),
    total : new FormControl(''),
    orderCode : new FormControl(''),
    timestamp : new FormControl('')
  })

  get productos() {
    return this.order.controls['productos'] as FormArray
  }
  agregarProducto() {
    const producto = new FormGroup({
      nombre : new FormControl(''),
      cantidad : new FormControl(''),
      precio : new FormControl(''),
      stock : new FormControl('')
    })
    this.productos.push(producto)
  }
  quitarProducto(index : number) {
    this.productos.removeAt(index)
  }
  sendForm() {
    console.log("Esto es en formFGropu: " + this.order);

    if (this.order.valid) {
      const order = this.order.value as Order
      console.log("Esto es casteado a Order: " + order);
      
      this.service.postOrder(order)
    }
    
  }
}
