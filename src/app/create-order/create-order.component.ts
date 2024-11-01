import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Order } from '../models/order';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit{
  
  serviceOrder : ApiService = inject(ApiService)
  discountDone : Boolean = false

  order: FormGroup = new FormGroup({
    customerName : new FormControl('', [Validators.required, Validators.minLength(3)]),
    email : new FormControl('', [Validators.required, Validators.email], this.validarComprarEmail()),
    products: new FormArray([], [this.validarCantProd(), this.validarProductoUnico()]),
    total : new FormControl(''),
    orderCode : new FormControl(''),
    timestamp : new FormControl(new Date())
  })

  allProducts: Product[] = []
  ngOnInit(): void {
    this.serviceOrder.getProducts().subscribe(data => {
      this.allProducts = data
    })
  }

  get productos() {
    return this.order.controls['products'] as FormArray
  }
  agregarProducto() {
    const producto = new FormGroup({
      productId: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
      stock: new FormControl(''),
      price: new FormControl('')
    });
    this.productos.push(producto);
    this.updateTotal()
    this.productos.setValidators(this.validarProductoUnico())
  }
  

  quitarProducto(index : number) {
    this.productos.removeAt(index)
    this.updateTotal()
  }
  sendForm() {
    this.order.patchValue(
      {
        orderCode : this.generateOrderCode()
      }
    )
    console.log(this.order)

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
  onProductChange(index : number) {
    const selectedProductId = this.productos.at(index).get('productId')?.value;
    const selectedProduct = this.allProducts.find(p => p.id === selectedProductId);

    if (selectedProduct) {

        this.productos.at(index).patchValue({
            price: selectedProduct.price, 
            stock: selectedProduct.stock
        });
    }
    this.updateTotal()
    this.productos.setValidators(this.validarCantProd());
    this.productos.setValidators(this.validarProductoUnico()); //esto para que se aplique al hacer el metodo
  }
  searchNameById(id : string) {
    return this.allProducts.find(p => p.id === id)?.name
  }
  calculateTotal() {
    let total = 0
    this.productos.controls.forEach(p => {
      const cantidad = p.get('quantity')?.value
      const precio = p.get('price')?.value

      total += cantidad * precio
    })
    return total
  }
  updateTotal() {
    const total = this.calculateTotal();
    this.discountDone = total > 1000;
    if (this.discountDone) {
      this.order.patchValue({ total: total * 0.9 })
    } else {
      this.order.patchValue({ total: total }) 
    }
  }
  generateOrderCode() {
    let code = ""
    let name = this.order.controls['customerName'].value as string
    let email = this.order.controls['email'].value as string
    let firstLetterName = name.charAt(0)
    let lastFourLetterEmail = email.slice(-4)
    let time = this.order.controls['timestamp'].value as Date

    code = firstLetterName + lastFourLetterEmail + time.toTimeString().slice(0,4)

    return code
  }
  ///VALIDACIONES SINCRONICAS

  validarCantProd(): ValidatorFn {
    return (control : AbstractControl): ValidationErrors | null => {
      const array = control as FormArray
      return array.length < 1 && array.length > 10 ? {'minProd' : true} : null
    }
  }
  validarProductoUnico(): ValidatorFn {
    return (control : AbstractControl): ValidationErrors | null => {
      const array = control as FormArray
      const ids = array.controls.map(control => control.get("productId")?.value)
      const hasDuplicates = ids.some((id, index) => ids.indexOf(id) !== index)
      return hasDuplicates ? { 'duplicates' : true} : null
    }
  }
  //VALIDACIONES ASINCRONICAS
  validarComprarEmail(): AsyncValidatorFn {
    return (control : AbstractControl): Observable<ValidationErrors | null> => {
      return this.serviceOrder.getOrderByEmail(control.value).pipe(
        map(orders => {
          const recentOrders = orders.filter(order => {
            const orderDate = new Date(order.timestamp)
            const now = new Date()
            return (now.getTime() - orderDate.getTime()) < 24 * 60 * 60 * 1000
          })
          return recentOrders.length > 3 ? {'tooMany' : true} : null
        })
      )
    }
  }
}
