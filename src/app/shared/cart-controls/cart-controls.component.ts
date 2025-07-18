import { Component, EventEmitter, Injectable, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth';

@Component({
    selector: 'app-cart-controls',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart-controls.component.html',
    styleUrls: ['./cart-controls.component.css']
})


export class CartControlsComponent implements OnInit, OnDestroy {
    userId!: number | null;
    @Input() product: any;
    @Input() cartMap!: Map<number, number>;
    private userSub!: Subscription;

    @Output() cartUpdated = new EventEmitter<void>();

    constructor(
        private cartService: CartService,
        private toastr: ToastrService,
        private authService: AuthService
    ) { }


    ngOnInit(): void {
        this.userSub = this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.userId = user.id ?? null;
                this.cartService.fetchCart(this.userId);
            } else {
                this.userId = null;
                this.cartMap.clear();
                this.cartUpdated.emit();
            }
        });

    }

    getQuantity(): number {
        console.log('chekc userId:', this.userId);
        return this.cartMap.get(this.product.id) || 0;
    }

    isInCart(): boolean {
        return this.cartMap.has(this.product.id);
    }


    addToCart(): void {
        if (this.userId === null || this.userId === undefined) {
            this.toastr.error('Usuario no autenticado');
            return;
        }

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

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
