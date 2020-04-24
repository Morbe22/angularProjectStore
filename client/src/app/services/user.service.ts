import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(public http: HttpClient) {}

  public register(data): Observable<any> {
    return this.http.post("http://localhost:1035/registration", data, {
      headers: {
        "Content-Type": "application/json",
      },
      // responseType:"text"
    });
  }

  public login(data): Observable<any> {
    return this.http.post("http://localhost:1035/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
      // responseType:"text"
    });
  }

  public checkEmail_n_ID(ID, email): Observable<any> {
    return this.http.post(
      "http://localhost:1035/checkEm_n_ID",
      { ID, email },
      {
        headers: {
          "Content-Type": "application/json",
        },
        // responseType:"text"
      }
    );
  }

  public getUser(): Observable<any> {
    return this.http.get("http://localhost:1035/findUser", {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
  }
}
