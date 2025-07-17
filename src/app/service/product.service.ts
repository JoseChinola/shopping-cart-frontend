import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";


@Injectable({
    providedIn: 'root'
})


export class productService {
    private apiURL = 'https://localhost:7086/api';

    constructor(private http: HttpClient) { }

    fetchProducts(): Observable<Product[]> {
        const url = `${this.apiURL}/Products`;
        return this.http.get<Product[]>(url);
    }
}