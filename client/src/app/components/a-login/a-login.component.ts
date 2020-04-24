// import { Component, OnInit } from "@angular/core";
// import { Router } from "@angular/router";
// import { ShopService } from "src/app/services/shop.service";
// import { UserService } from "src/app/services/user.service";

// @Component({
//   selector: "a-login",
//   templateUrl: "./a-login.component.html",
//   styleUrls: ["./a-login.component.css"],
// })
// export class ALoginComponent implements OnInit {
//   constructor(
//     public router: Router,
//     public _shopS: ShopService,
//     public _userS: UserService
//   ) {}

//   public token = true;
//   public new_user = true;
//   public isOpen = false;
//   public isLogged = true;
//   public cartOpen = false;
//   public noCart: boolean;
//   public isAdmin = false;

//   public tokenCheck(TC) {
//     this.token = TC;
//     this.isLogged = false;
//     // this.sign = false;
//   }

//   public signUp() {
//     this.new_user = false;
//     this.isOpen = true;
//   }

//   public Toshop() {
//     this.router.navigateByUrl("/shop");
//     this.hasCart();
//     // this._shopS.createCart()
//   }

//   public hasCart() {
//     this._shopS.getCartId().subscribe(
//       (res) => {
//         localStorage.setItem("cartID", res.id);
//         if (localStorage.cartID) {
//           if (localStorage.cartStatus == "starting") {
//             this.noCart = true;
//           }
//           if (localStorage.cartStatus == "UnDone") {
//             this.noCart = false;
//             this.cartOpen = true; //resume
//           }
//         }
//         console.log(res);
//       },
//       (err) => console.log(err)
//     );
//   }

//   public ifTokenExists() {
//     if (localStorage.getItem("token")) {
//       this.token = false;

//       this.isLogged = false;
//       this._userS.getUser().subscribe(
//         (res) => {
//           if (res.isAdmin == 0) {
//             this.hasCart();
//           }
//           if (res.isAdmin == 1) {
//             this.isAdmin = true;
//           }
//         },
//         (err) => {
//           console.log(err);
//         }
//       );
//     }
//   }

//   ngOnInit(): void {
//     this.ifTokenExists();
//   }
// }
