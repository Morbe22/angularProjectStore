import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ShopService } from "src/app/services/shop.service";
import { Router } from "@angular/router";
import { HttpResponse, HttpEventType } from "@angular/common/http";

@Component({
  selector: "add-prod-form",
  templateUrl: "./add-prod-form.component.html",
  styleUrls: ["./add-prod-form.component.css"],
})
export class AddProdFormComponent implements OnInit {
  constructor(
    public _fb: FormBuilder,
    public _shopS: ShopService,
    public router: Router
  ) {}
  public catagories = [];

  public selectedFile: File;
  public fileName: any;

  @ViewChild("file") file;
  public files: Set<File> = new Set();

  public form: FormGroup;

  public getCat() {
    this._shopS.getCatagories().subscribe(
      (res) => {
        this.catagories = res;
      },
      (err) => console.log(err)
    );
  }

  public productForm() {
    this.form = this._fb.group({
      p_name: [""],
      catagory_id: [""],
      price: [""],
      picture: [""],
    });
  }

  public closeWin() {
    this.router.navigateByUrl("/shop");
  }

  public onFileChanged(e) {
    this.selectedFile = e.target.files[0];
    this.fileName = this.selectedFile.name;
    // console.log(this.fileName);
    // console.log(this.selectedFile);
  }

  public onUpload() {
    // console.log(this.selectedFile);
    const fData = new FormData();
    fData.append("file", this.selectedFile);
    // console.log(fData.getAll("file"));

    this._shopS.uploadImage(fData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
    // this._shopS.onUpload(file);
  }

  public addProd() {
    this.form.value.picture = this.fileName;

    this._shopS
      .addProduct(
        this.form.value.p_name,
        this.form.value.catagory_id,
        this.form.value.price,
        this.form.value.picture
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );

    // this.router.navigateByUrl("/shop")
  }

  ngOnInit(): void {
    this.getCat();
    this.productForm();
  }
}
