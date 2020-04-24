import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(public router: Router, public _userS: UserService) {}

  title = "client";
  public logged = false;
  public name: string;

  public ifToken() {
    if (localStorage.getItem("token")) {
      this.logged = true;
    } else {
      this.router.navigateByUrl("/");
    }
  }

  public logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("userStatus");
    //   // localStorage.removeItem("cartStatus");
    //   // localStorage.removeItem("currentPrice");
    this.router.navigateByUrl("/");
  }

  public toPanel() {
    this.router.navigateByUrl("/");
  }

  ngOnInit(): void {
    this.ifToken();
  }
}
