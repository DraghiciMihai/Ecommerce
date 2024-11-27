import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 0;
  currentCategoryName: string = "";
  isSearch: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  prevCategoryId: number = 1;
  prevKeyword: string = "";

  constructor(private productService : ProductService,
              private route: ActivatedRoute,
              private cartService: CartService
  ) { }

  ngOnInit(): void {
    console.log("ngOnInit was called");
    
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.isSearch = this.route.snapshot.paramMap.has("keyword");

    if (this.isSearch) {
      this.handleProductsListByKeyword();
    } else {
      this.handleProductsListByCategory();
    }
  }

  updatePageSize(newPageSize: string) {
    console.log(newPageSize);
    
    this.pageSize = +newPageSize;
    this.pageNumber = 1;
    this.listProducts();
    }

  handleProductsListByKeyword() {
    const keyword = this.route.snapshot.paramMap.get("keyword")!;

    if(this.prevKeyword != keyword){
      this.pageNumber = 1;
    }
    
    this.prevKeyword = keyword;

    this.productService.getProductListByKeyword(keyword, this.pageSize, --this.pageNumber).subscribe(
      this.processData())
  }
  
  handleProductsListByCategory() {

    this.currentCategoryId = +(this.route.snapshot.paramMap.get("id") ?? 1);
    this.currentCategoryName = this.route.snapshot.paramMap.get("name") ?? "Books";

    if (this.prevCategoryId != this.currentCategoryId) { this.pageNumber = 1}

    this.prevCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(--this.pageNumber, this.pageSize, this.currentCategoryId).subscribe(
      this.processData())
  }

  addToCart(product: Product) {
    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
    // console.log(`${product.name} ${product.unitPrice}`);
    
  }

  processData() {
    return (data: any) => { this.products = data._embedded.products;
                            this.pageNumber = ++data.page.number;
                            this.pageSize = data.page.size;
                            this.totalElements = data.page.totalElements;
                          } 
  }

}
