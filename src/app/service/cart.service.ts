import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class CartService {
    private apiURL = 'https://localhost:7086/api';

    private cartCountSubject = new BehaviorSubject<number>(0);
    cartCount$ = this.cartCountSubject.asObservable();


    constructor(private http: HttpClient) { }

    fetchCart(userId: any): void {
        const url = `${this.apiURL}/Cart?userId=${userId}`;
        this.http.get<any>(url).subscribe({
            next: (response) => {
                this.cartCountSubject.next(response.totalItems || 0);
            },
            error: (err) => {
                this.cartCountSubject.next(0);
                console.error('Error fetching cart items:', err);
            }
        })
    }


    // Obtener los productos del carrito
    getCartItems(userId: number): Observable<{ items: any[], totalItems: number, totalPrice: number }> {
        const url = `${this.apiURL}/Cart?userId=${userId}`;
        return this.http.get<{ items: any[], totalItems: number, totalPrice: number }>(url);
    }

    setCartCount(count: number): void {
        this.cartCountSubject.next(count);
    }

}