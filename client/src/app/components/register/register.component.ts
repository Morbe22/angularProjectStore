import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { ShopService } from "src/app/services/shop.service";

@Component({
  selector: "register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  constructor(
    public _fb: FormBuilder,
    public _userS: UserService,
    public _shopS: ShopService,
    public router: Router
  ) {}

  public form: FormGroup;
  public token: boolean = true;
  public hide = true;
  public idErrorMessage = false;
  public passwordErrorMessage = false;
  public isValid = false;
  public showBtn = true;
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
  public newUser: boolean = false;
  public name: any;

  @Output() public tokenStatus = new EventEmitter();

  public register() {
    this._userS.register(this.form.value).subscribe(
      (res) => {
        localStorage.setItem("token", res.token);
        if (localStorage.getItem("token")) {
          this.tokenStatus.emit(!this.token);
          if (res.message == "new user") {
            localStorage.setItem("userStatus", "new user");
            this._shopS.createCart(this.form.value.ID).subscribe(
              (res) => {
                if (res.cartStatus == "starting") {
                  localStorage.setItem("cartStatus", "starting");
                  this.userDetails();
                }
                console.log(res);
              },
              (err) => console.log(err)
            );
          }
        }
      },
      (err) => {
        console.log("no user?", err);

        console.log(err.error);
      }
    );
  }

  public check() {
    if (this.form.value.ID.length < 8) {
      console.log("no!");
    }
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.passwordErrorMessage = true;
    } else {
      this._userS
        .checkEmail_n_ID(this.form.value.ID, this.form.value.email)
        .subscribe(
          (res) => {
            if (res.status == "ok") {
              this.passwordErrorMessage = false;
              this.isValid = true;
              this.showBtn = false;
            }
          },
          (err) => {
            if (err.error.message == "ID already exists") {
              this.idErrorMessage = true;
            }

            // console.log(err);
          }
        );
    }
  }

  public userDetails() {
    this._userS.getUser().subscribe(
      (res) => {
        this.name = res.f_name;
        localStorage.setItem("user_name", this.name);
        console.log(res);
      },
      (err) => console.log(err)
    );
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      ID: [
        "",
        [Validators.required, Validators.minLength(8), Validators.pattern],
      ],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern]],
      confirmPassword: ["", [Validators.required]],
      f_name: ["", Validators.required],
      l_name: ["", Validators.required],
      city: ["", Validators.required],
      street: ["", Validators.required],
    });
  }
}
