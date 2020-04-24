import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ShopService } from "src/app/services/shop.service";
import { UserService } from "src/app/services/user.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
// import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import { Router } from "@angular/router";

@Component({
  selector: "order-form",
  templateUrl: "./order-form.component.html",
  styleUrls: ["./order-form.component.css"],
})
export class OrderFormComponent implements OnInit {
  constructor(
    public _fb: FormBuilder,
    public _shopS: ShopService,
    public _userS: UserService,
    public router: Router
  ) {}

  public form: FormGroup;
  public cities = [
    "Jerusalem",
    "Tel-Aviv-Jaffa",
    "Haifa",
    "Rishon Lezion",
    "Petah Tikva",
    "Ashdod",
    "Netanya",
    "Beer Sheva",
    "Bnei Brak",
    "Holon",
  ];
  public date: any;
  public street: string;
  public city: string;
  public cityMessage = false;
  public today = new Date();
  public cartItem = [];

  public errorBook = false;
  public receipt = false;

  public order() {
    this._shopS
      .order(
        localStorage.cartID,
        localStorage.currentPrice,
        this.form.value.city_shipping,
        this.form.value.street_shipping,
        this.form.value.date_order_toShipping,
        this.form.value.creditCard
      )
      .subscribe(
        (res) => {
          console.log(this.form.value.date_order_toShipping);
          console.log(res);
        },
        (err) => console.log(err)
      );
    localStorage.setItem("cartStatus", "Done");

    if (localStorage.cartStatus == "Done") {
      this.delCart();
      this.date = new Date(Date.now()).toString();
      localStorage.setItem("cartDate", this.date);
    }
    this.receipt = true;
  }

  public delCart() {
    this._shopS.deleteCart({ id: localStorage.cartID }).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  public check(type: string, e: MatDatepickerInputEvent<Date>) {
    const date = e.value;

    this._shopS.bookCheck({ date_order_toShipping: date }).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        if (err.status == 500) {
          this.errorBook = true;
        } else {
          this.errorBook = false;
        }
        console.log(err);
      }
    );
  }

  public onDBLclick(e) {
    console.log(e.currentTarget.id);
    // const elm = document.getElementById()

    this._userS.getUser().subscribe(
      (res) => {
        this.street = res.street;
        this.city = res.city;
      },
      (err) => console.log(err)
    );

    let input = <HTMLInputElement>document.getElementById(e.currentTarget.id);

    this.form.patchValue({
      city_shipping: this.city,
      street_shipping: this.street,
      date_order_toShipping: new Date(),
      creditCard: `(example) - 1234`,
    });
    this.cityMessage = true;
  }

  public show_receipt() {
    let cartID = localStorage.cartID;
    let total = localStorage.currentPrice;
    // console.log(total);

    this._shopS.txtReceipt(cartID, total).subscribe(
      (res) => {
        // console.log(res);
        saveAs(res, "myReceipt.txt");
      },
      (err) => console.log(err)
    );
  }

  public selectOther() {
    let input = <HTMLInputElement>document.getElementById("city");
    input.value = "";
    this.cityMessage = false;
  }

  public goPanel() {
    this.router.navigateByUrl("/");
    localStorage.removeItem("currentPrice");
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      city_shipping: ["", Validators.required],
      street_shipping: ["", Validators.required],
      date_order_toShipping: ["", Validators.required],
      creditCard: ["", Validators.required],
    });
  }
}
