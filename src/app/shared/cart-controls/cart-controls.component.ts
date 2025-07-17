import { Component, EventEmitter, Injectable, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cart-controls',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart-controls.component.html',
    styleUrls: ['./cart-controls.component.css']
})


export class CartControlsComponent {
    @Input() product: any;
    @Input() userId!: number;
    @Input() cartMap!: Map<number, number>;

    @Output() cartUpdated = new EventEmitter<void>();

    constructor(
        private cartService: CartService,
        private toastr: ToastrService
    ) { }

    getQuantity(): number {
        return this.cartMap.get(this.product.id) || 0;
    }

    isInCart(): boolean {
        return this.cartMap.has(this.product.id);
    }


    addToCart(): void {
        const cartItem = {
            userId: this.userId,
            productId: this.product.id,
            quantity: 1
        };
        this.cartService.addToCart(cartItem).subscribe({
            next: (res: any) => {
                this.cartService.fetchCart(this.userId);
                this.toastr.success(res.message, "Cart");
                this.cartUpdated.emit();
                this.cartService.notifyCartUpdated();
            },
            error: (err: any) => {
                console.error("Error adding to cart", err);
            }
        });
    }

    increase(): void {
        const payload = {
            userId: this.userId,
            productId: this.product.id,
            delta: 1
        };
        this.cartService.updateCartItem(payload).subscribe(() => {
            this.cartService.fetchCart(this.userId);
            this.cartUpdated.emit();
            this.cartService.notifyCartUpdated();
        });
    }

    decrease(): void {
        const payload = {
            userId: this.userId,
            productId: this.product.id,
            delta: -1
        };
        this.cartService.updateCartItem(payload).subscribe(() => {
            this.cartService.fetchCart(this.userId);
            this.cartUpdated.emit();
            this.cartService.notifyCartUpdated();
        });
    }
}
