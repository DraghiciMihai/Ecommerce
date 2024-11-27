import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  
  private baseUrl = `${environment.apiUrl}`;
  // private headers = new HttpHeaders({
  //   'Authorization': 'Basic ' + btoa(`${environment.auth.username}:${environment.auth.password}`)
  // })
  
  constructor(private httpClient : HttpClient) { 
  }

  getProduct(prodId: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/products/${prodId}`
    return this.httpClient.get<Product>(searchUrl);
  }

  getCategoriesList(): Observable<ProductCategory[]> {
    const searchUrl = `${this.baseUrl}/product-category`;
    console.log(searchUrl);
    
    
    return this.httpClient.get<GetCategoriesResponse>(searchUrl).pipe(
      map( res => res._embedded.productCategory ))
  }

  getProductList(categoryId: number): Observable<Product[]> {
      const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}`

      return this.getProducts(searchUrl);
  }

  getProductListPaginate(pageNumber: number, pageSize: number, categoryId: number): Observable<GetProductsResponse> {
      const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}&page=${pageNumber}&size=${pageSize}`

      return this.httpClient.get<GetProductsResponse>(searchUrl);
  }
  
  getProductListByKeyword(name: string, pageSize: number, pageNumber: number,): Observable<GetProductsResponse> {
    const searchUrl = `${this.baseUrl}/products/search/findByNameContaining?name=${name}&page=${pageNumber}&size=${pageSize}`
    
    return this.httpClient.get<GetProductsResponse>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {

    return this.httpClient.get<GetProductsResponse>(searchUrl).pipe(
      map(response => response._embedded.products));
  }

}

interface GetProductsResponse {
  _embedded : {
    products: Product[];
  }
  page: {
      size: number,
      totalElements: number,
      totalPages: number,
      number: number
  }
}
  interface GetCategoriesResponse {
    _embedded : {
      productCategory: ProductCategory[];
    }
}
