import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpResponse,
  HttpEventType,
  HttpRequest,
} from "@angular/common/http";
import { Observable, observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ShopService {
  constructor(public http: HttpClient) {}

  public url = "http://localhost:1035/upload";

  public getProducts(): Observable<any> {
    return this.http.get("http://localhost:1035/allProducts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public getGeneralDataC(): Observable<any> {
    return this.http.get("http://localhost:1035/general_Data_C", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public getCatagories(): Observable<any> {
    return this.http.get("http://localhost:1035/catagories", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public addToCart(
    product_id,
    amount,
    total_price,
    user_cart_id
  ): Observable<any> {
    console.log(amount);

    return this.http.post(
      "http://localhost:1035/addToCart",
      { product_id, amount, total_price, user_cart_id },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
  }

  public checkIfProductExist(product_id, user_cart_id): Observable<any> {
    return this.http.put(
      "http://localhost:1035/checkIfProductExist",
      { product_id, user_cart_id },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
  }

  public showCart(user_cart_id): Observable<any> {
    return this.http.post("http://localhost:1035/showCart", user_cart_id, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public getfinalPrice(user_cart_id): Observable<any> {
    return this.http.post("http://localhost:1035/getTotalPrice", user_cart_id, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public filterBy(ids): Observable<any> {
    // console.log("from shopS:", id);
    return this.http.post(
      "http://localhost:1035/filterBy",
      { ids: ids },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        // responseType: "text"
      }
    );
  }

  public createCart(ID): Observable<any> {
    return this.http.post("http://localhost:1035/createCartForUser", ID, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public getCartId(): Observable<any> {
    return this.http.get("http://localhost:1035/hasCart", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public delOneP(product_id): Observable<any> {
    return this.http.put("http://localhost:1035/delOneP", product_id, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public delAllP(user_cart_id): Observable<any> {
    return this.http.put("http://localhost:1035/delAllP", user_cart_id, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public searchP(search): Observable<any> {
    return this.http.post("http://localhost:1035/searchP", search, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public searchP_order(search): Observable<any> {
    return this.http.post("http://localhost:1035/searchP_order", search, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public order(
    user_cart_id,
    final_price,
    city_shipping,
    street_shipping,
    date_order_toShipping,
    creditCard
  ): Observable<any> {
    return this.http.post(
      "http://localhost:1035/order",
      {
        user_cart_id,
        final_price,
        city_shipping,
        street_shipping,
        date_order_toShipping,
        creditCard,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
  }

  public deleteCart(id): Observable<any> {
    console.log(id);

    return this.http.put("http://localhost:1035/deleteCart", id, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }

  public txtReceipt(user_cart_id, total): Observable<any> {
    // console.log(total);

    return this.http.post(
      "http://localhost:1035/createReceipt",
      { user_cart_id, total },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        responseType: "blob",
        // responseType: "text",
      }
    );
  }

  public bookCheck(date_order_toShipping): Observable<any> {
    return this.http.post(
      "http://localhost:1035/check3Dates",
      date_order_toShipping,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
  }

  public addProduct(p_name, catagory_id, price, picture): Observable<any> {
    return this.http.post(
      "http://localhost:1035/addProd",
      { p_name, catagory_id, price, picture },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
  }

  public editProd(p_name, catagory_id, price, picture, id): Observable<any> {
    return this.http.put(
      "http://localhost:1035/editProduct",
      { p_name, catagory_id, price, picture, id },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
  }

  public uploadImage(uploadData): Observable<any> {
    return this.http.post("http://localhost:1035/upload", uploadData, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  }
}
