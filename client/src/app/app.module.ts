import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PanelsComponent } from "./components/panels/panels.component";
// import { ALoginComponent } from "./components/a-login/a-login.component";
// import { BAboutComponent } from "./components/b-about/b-about.component";
// import { CNotificationsComponent } from "./components/c-notifications/c-notifications.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ShopComponent } from "./components/shop/shop.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { OrderFormComponent } from "./components/order-form/order-form.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { AddProdFormComponent } from "./components/add-prod-form/add-prod-form.component";

@NgModule({
  declarations: [
    AppComponent,
    PanelsComponent,
    // ALoginComponent,
    // BAboutComponent,
    // CNotificationsComponent,
    LoginComponent,
    RegisterComponent,
    ShopComponent,
    OrderFormComponent,
    AddProdFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
