import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { ShopService } from "src/app/services/shop.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-panels",
  templateUrl: "./panels.component.html",
  styleUrls: ["./panels.component.css"],
})
export class PanelsComponent implements OnInit {
  constructor(
    public _userS: UserService,
    public router: Router,
    public _shopS: ShopService
  ) {}

  public isOpen = false;
  public token = true;
  public log_div = true;
  public new_user = true;
  public isAdmin = false;
  public noCart: boolean;
  public ifCartOpen = false;
  public name;
  public cartPrice;
  public date: any;
  public amountOfP = 0;
  public amountOfO = 0;
  public newUser: boolean = false;
  public cartDone = false;

  public tokenCheck(TC) {
    this.token = TC;
    this.log_div = false;
    // this.sign = false;
  }

  public signUp() {
    this.new_user = false;
    this.isOpen = true;
  }

  public Toshop() {
    this.router.navigateByUrl("/shop");
    // this.hasCart();
    if (localStorage.cartStatus == "Done") {
      this.hasCart();
      localStorage.removeItem("currentPrice");
      localStorage.setItem("cartStatus", "starting");
    }
    if (localStorage.cartStatus == "starting") {
      this.hasCart();
    }
    // this._shopS.createCart() if statuscart=done
  }

  public hasCart() {
    this._shopS.getCartId().subscribe(
      (res) => {
        localStorage.setItem("cartID", res.id);

        console.log(res);
      },
      (err) => console.log(err)
    );
  }

  public checkUser() {
    if (localStorage.user_name) {
      this.name = localStorage.user_name;
    } else {
      this.name = "Guest";
    }
    //only in register function
    if (localStorage.userStatus) {
      this.newUser = true;
    }
  }

  public ifThereIsToken() {
    if (localStorage.token) {
      this.token = false;
      this.isOpen = true;
      this.log_div = false;

      if (localStorage.cartStatus == "UnDone") {
        this.ifCartOpen = true;
        if (localStorage.currentPrice) {
          this.cartPrice = localStorage.currentPrice;
        }
        if (localStorage.cartDate) {
          this.date = localStorage.cartDate;
        }
      }
      if (localStorage.cartStatus == "starting") {
        this.noCart = true;
      }
      if (localStorage.cartStatus == "Done") {
        this.date = localStorage.cartDate;
        this.noCart = true;
        this.cartDone = true;
      }
    }
  }

  public getGeneralDataC() {
    this._shopS.getGeneralDataC().subscribe(
      (res) => {
        console.log(res);
        this.amountOfO = res.AmountOfOrders;
        this.amountOfP = res.AmountOfProducts;
      },
      (err) => console.log(err)
    );
  }

  ngOnInit(): void {
    this.ifThereIsToken();
    this.checkUser();
    this.getGeneralDataC();
    // this.checkIfToken();
  }
}
