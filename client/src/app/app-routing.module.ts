import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PanelsComponent } from "./components/panels/panels.component";
import { ShopComponent } from "./components/shop/shop.component";
import { AddProdFormComponent } from "./components/add-prod-form/add-prod-form.component";

const routes: Routes = [
  { path: "panels", component: PanelsComponent },
  { path: "shop", component: ShopComponent },
  { path: "addProd", component: AddProdFormComponent },
  { path: "", redirectTo: "/panels", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
