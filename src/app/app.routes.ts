import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { Auth } from './components/auth/auth';
import { Layout } from './layout/layout';
import { authGuard } from './guards/auth-guard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ProductDetail } from './components/product-detail/product-detail';

export const routes: Routes = [
    {
        path: "",
        component: Layout,
        children: [
            {
                path: "",
                component: ProductList
            },
            {
                path: "product/:id",
                component: ProductDetail
            },
            {
                path: "checkout",
                component: Checkout,
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: "auth",
        component: Auth,
        children: [
            {
                path: "",
                redirectTo: "login",
                pathMatch: "full"
            },
            {
                path: "login",
                component: Login
            },
            {
                path: "register",
                component: Register
            }
        ]
    },
    {
        path: "**",
        redirectTo: ""
    }
];
