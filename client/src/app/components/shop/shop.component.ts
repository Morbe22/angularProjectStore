import { Component, OnInit } from "@angular/core";
import { ShopService } from "src/app/services/shop.service";

import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "shop",
  templateUrl: "./shop.component.html",
  styleUrls: ["./shop.component.css"],
})
export class ShopComponent implements OnInit {
  constructor(
    public _shopS: ShopService,
    public _userS: UserService,
    public router: Router,
    public _fb: FormBuilder
  ) {}
  public isOpen = true;
  public products = [];
  public catagories = [];
  public catArr1 = [];
  public catArr2 = [];
  public catArr3 = [];
  public cartItems = [];
  public cartItemsOrder = [];
  public final_Price = 0;
  public orderPopUp = false;
  public date: any;
  public errorMessageAdd = false;
  public productId: number;
  public status = false;
  // public isAdmin = false;
  public Editform: FormGroup;
  public edit = false;
  public chosenProd: any;
  public selectedFile: File;
  public fileName: any;
  public user_id;

  public getTime() {
    this.date = new Date(Date.now()).toString();
    console.log(this.date);
  }

  public toggle() {
    this.isOpen = !this.isOpen;
  }

  public user() {
    this._userS.getUser().subscribe(
      (res) => {
        this.user_id = res.ID;
        this.cartStatus();
        console.log(res);
      },
      (err) => console.log(err)
    );
  }
  // public isUserAdmin() {
  //   this._userS.getUser().subscribe(
  //     (res) => {
  //       // console.log(res);
  //       // this.user_id = res.ID;
  //       if (res.isAdmin == 1) {
  //         this.isAdmin = true;
  //       } else {
  //         this.finalPrice();
  //         this.getCartItems();
  //         this.isAdmin = false;
  //       }
  //       // console.log(res);
  //     },
  //     (err) => console.log(err)
  //   );
  // }

  public clickProd(p) {
    this._userS.getUser().subscribe(
      (res) => {
        if (res.isAdmin == 1) {
          this.edit = true;
          // this.getEditForm();
          this.chosenProd = p;

          this.Editform.patchValue({
            p_name: this.chosenProd.p_name,
            catagory_id: this.chosenProd.catagory_id,
            price: this.chosenProd.price,
            picture: this.chosenProd.picture,
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public editProdForm() {
    this.Editform = this._fb.group({
      p_name: [""],
      catagory_id: [""],
      price: [""],
      picture: [""],
    });
  }

  public editProd() {
    if (this.fileName == undefined) {
      this.fileName = this.chosenProd.picture;
    }

    this._shopS
      .editProd(
        this.Editform.value.p_name,
        this.Editform.value.catagory_id,
        this.Editform.value.price,
        this.chosenProd.picture,
        this.chosenProd.id
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );

    this.edit = false;
    this.getProd();
  }

  public getProd() {
    this._shopS.getProducts().subscribe(
      (res) => (this.products = res),
      (err) => console.log(err)
    );
  }

  public getCat() {
    this._shopS.getCatagories().subscribe(
      (res) => {
        this.catagories = res;

        function chunkArray(myArr, value) {
          let finalArr = [];

          for (let i = 0; i < myArr.length; i += value) {
            finalArr.push(myArr.slice(i, value + i));
          }

          return finalArr;
        }

        const finalArr = chunkArray(this.catagories, 3);
        this.catArr1 = finalArr[0];
        this.catArr2 = finalArr[1];
        this.catArr3 = finalArr[2];
      },
      (err) => console.log(err)
    );
  }

  public filter(e) {
    // const id = e.currentTarget.id;
    const self = this;

    setTimeout(function () {
      const ids = [];

      const elms: NodeListOf<HTMLInputElement> = document.querySelectorAll(
        "input[type='checkbox']:checked"
      );

      elms.forEach(function (item) {
        console.log(item);
        ids.push(item.value);
      });

      self._shopS.filterBy(ids).subscribe(
        (res) => {
          self.products = res;
          console.log(res);
        },
        (err) => console.log(err)
      );
    }, 500);
    localStorage.setItem("cartDate", this.date);
    // console.log(typeof ids);
  }

  public reset() {
    this.getProd();
  }

  public add(e, p) {
    const cartID = localStorage.cartID;
    this._shopS.checkIfProductExist(p.id, cartID).subscribe(
      (res) => {
        console.log(res);
        if (res.message == "ok") {
          const el = <HTMLInputElement>document.getElementById(p.id);
          const amount = el.value;
          let total_price = +amount * p.price;
          let cartID = localStorage.cartID;
          if (amount != undefined) {
            this._shopS.addToCart(p.id, amount, total_price, cartID).subscribe(
              (res) => {
                console.log(res);
              },
              (err) => console.log(err)
            );
          }

          this.getCartItems();
          this.finalPrice();
          localStorage.setItem("cartStatus", "UnDone");
          localStorage.setItem("cartDate", this.date);
        }
      },
      (err) => {
        if (err.status == 500) {
          this.productId = p.id;
          this.errorMessageAdd = true;
        }
        console.log(err);
      }
    );
  }

  public getCartItems() {
    let cartID = localStorage.cartID;
    // console.log(cartID)
    this._shopS.showCart({ user_cart_id: cartID }).subscribe(
      (res) => {
        this.cartItems = res;
        this.cartItemsOrder = res;
        // console.log(res);
      },
      (err) => console.log(err)
    );
  }

  public finalPrice() {
    let cartID = localStorage.cartID;
    this._shopS.getfinalPrice({ user_cart_id: cartID }).subscribe(
      (res) => {
        if (res.finalPrice == null) {
          res.finalPrice === 0;
          return res.finalPrice;
        }
        console.log(res.finalPrice);
        localStorage.setItem("currentPrice", res.finalPrice);
        this.final_Price = res.finalPrice;
      },
      (err) => console.log(err)
    );
  }

  public delOneP(item) {
    const el = document.getElementById(item.product_id);
    el.style.display = "none";

    this._shopS.delOneP({ product_id: item.product_id }).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => console.log(err)
    );
    this.finalPrice();
    localStorage.setItem("cartStatus", "UnDone");
    localStorage.setItem("cartDate", this.date);
    this.errorMessageAdd = false;
  }

  public delAllP() {
    let cartID = localStorage.cartID;
    this._shopS.delAllP({ user_cart_id: cartID }).subscribe(
      (res) => {
        this.cartItems = res;
      },
      (err) => console.log(err)
    );

    this.getCartItems();
    this.finalPrice();
    localStorage.setItem("cartStatus", "UnDone");
    localStorage.setItem("cartDate", this.date);
  }

  public order() {
    this.orderPopUp = true;
  }

  public closeOrder() {
    this.orderPopUp = false;
  }

  public onkeyDown(e) {
    const value = e.currentTarget.value;

    this.cartItemsOrder.forEach((item) => {
      const product = document.getElementById(`order` + item.p_id);
      if (item.p_name.includes(value)) {
        product.style.cssText = `
           color:#000;
           background-color: yellow;
          `;
      } else {
        product.style.cssText = `
        color:currentColor;
           background-color: #fff;
        `;
      }

      if (value == "") {
        product.style.cssText = `
        color:currentColor;
           background-color: #fff;
        `;
      }
    });
  }

  public search() {
    const search = <HTMLInputElement>document.getElementById("search");
    console.log(search.value);

    this._shopS.searchP({ search: search.value }).subscribe(
      (res) => {
        this.products = res;
        console.log(res);
        search.value = "";
      },
      (err) => console.log(err)
    );
    localStorage.setItem("cartDate", this.date);
  }

  public search_from_order() {
    const search = <HTMLInputElement>document.getElementById("search_order");
    console.log(search.value);

    this._shopS.searchP_order({ search: search.value }).subscribe(
      (res) => {
        this.cartItemsOrder = res;
        console.log(res);
        search.value = "";
      },
      (err) => console.log(err)
    );
  }

  public reset_order() {
    this.getCartItems();
    const search = <HTMLInputElement>document.getElementById("search_order");
    search.value = "";
  }

  public AddPopUp() {
    this.router.navigateByUrl("/addProd");
  }

  public onFileChanged(e) {
    this.selectedFile = e.target.files[0];
    this.fileName = this.selectedFile.name;
  }

  public onUpload() {
    const fData = new FormData();
    fData.append("file", this.selectedFile);
    // console.log(fData.getAll("file"));

    this._shopS.uploadImage(fData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );

    const new_p = `/uploads/${this.fileName}`;

    this.chosenProd.picture = new_p; //for client side only
  }

  public cartStatus() {
    console.log(this.user_id);

    this._shopS.getCartId().subscribe(
      (res) => {
        if (res == null) {
          this._shopS.createCart({ ID: this.user_id }).subscribe(
            (res) => console.log(res),
            (err) => console.log(err)
          );
        }
        console.log(res);
      },
      (err) => console.log(err)
    );
  }

  ngOnInit(): void {
    this.user();
    // this.isUserAdmin();
    this.getCat();
    this.getProd();
    this.editProdForm();
    this.getTime();
    this.getCartItems();
    this.finalPrice();
  }
}
