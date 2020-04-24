import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { ShopService } from "src/app/services/shop.service";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  constructor(
    public _fb: FormBuilder,
    public _userS: UserService,
    public _shopS: ShopService
  ) {}

  public form: FormGroup;
  public hide = true;
  public token: boolean = true;
  public noCart: boolean;
  public cartOpen = false;
  public name;
  public currentPrice: any;

  @Output() public tokenStatus = new EventEmitter();

  public login() {
    this._userS.login(this.form.value).subscribe(
      (res) => {
        localStorage.setItem("token", res.token);
        if (localStorage.token) {
          this.tokenStatus.emit(!this.token);

          this.checkIfToken();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public userDetails() {
    this._userS.getUser().subscribe(
      (res) => {
        console.log(res);

        this.name = res.f_name;
        localStorage.setItem("user_name", this.name);
        console.log(res);
      },
      (err) => console.log(err)
    );
  }

  public checkIfToken() {
    if (localStorage.token) {
      this.userDetails();
      this.hasCart();
    }
  }

  public hasCart() {
    this._shopS.getCartId().subscribe(
      (res) => {
        localStorage.setItem("cartID", res.id);
        if (localStorage.cartID) {
          this._shopS.showCart({ user_cart_id: localStorage.cartID }).subscribe(
            (res) => {
              if (res.length) {
                // console.log("there is something in cart");
                localStorage.setItem("cartStatus", "UnDone");
                let all = 0;
                res.forEach((price) => {
                  all += +price.total_price;
                  return all;
                });
                this.currentPrice = all;
                console.log(this.currentPrice);
                localStorage.setItem("currentPrice", this.currentPrice);
              }
              localStorage.setItem("cartStatus", "starting");
              console.log(res);
            },
            (err) => console.log(err)
          );
          //   if (localStorage.cartStatus == "starting") {
          //     this.noCart = true;
          //   }
          //   if (localStorage.cartStatus == "UnDone") {
          //     this.noCart = false;
          //     this.cartOpen = true; //resume
          //   }
        }
        console.log(res);
      },
      (err) => console.log(err)
    );
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }
}
