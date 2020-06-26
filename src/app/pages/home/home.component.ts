import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router'
import { GlobalServiceService } from './../../services/global-service.service'


@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  template: `
    <mat-nav-list>
      <a mat-list-item (click)="openLink(i)" *ngFor="let element of data.bingo; let i = index" >
        <span mat-line class="fvspan" class="fvspan">Favorito {{i+1}}</span>
        <mat-grid-list cols="5" rowHeight="fit"  class="width">
          <mat-grid-tile *ngFor="let elementChild of data.bingo[i]; let iChild = index" class="circle">
            <div class="numberBingo">
              <div class="numberBingoColor">
                <span>{{elementChild}}</span>
              </div>
            </div>
          </mat-grid-tile>
        </mat-grid-list>
      </a>
    </mat-nav-list> 
  `,
  styleUrls: ['./home.component.scss']
})
export class BottomSheetOverviewExampleSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}

  openLink(posicion): void {
    this._bottomSheetRef.dismiss();
    sessionStorage.setItem("getFavorite",posicion)
  }
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  arrayString = ['b','i','n','g','o']
  numbersBingo = {
    b: [],
    i: [],
    n: [],
    g: [],
    o: []
  }
  class = ['flip']


  formGroup: FormGroup
  userError: string = ''
  roomError: String =''
  phoneError: String =''
  savePhone = false
  saveUser = false


  constructor(private formBuilder : FormBuilder,private _snackBar: MatSnackBar,private _bottomSheet: MatBottomSheet, private router:Router,private global : GlobalServiceService) { }

  ngOnInit() {
    this.createForm()
    this.completeNumbers()
  }

  clear(){
    this.numbersBingo.b=[]
    this.numbersBingo.i=[]
    this.numbersBingo.n=[]
    this.numbersBingo.g=[]
    this.numbersBingo.o=[]
  }

  completeNumbers(){

    this.clear()

    for (var i = 1; i < 16; i++) {
      this.numbersBingo.b.push(i);
      this.numbersBingo.i.push(15 + i);
      this.numbersBingo.n.push(30 + i);
      this.numbersBingo.g.push(45 + i);
      this.numbersBingo.o.push(60 + i);
    }

    this.randomNumbers(this.numbersBingo)
  }

  randomNumbers(array){
    var ctr = 15, tempb,tempi,tempn,tempg,tempo,indexb,indexi,indexn,indexg,indexo;

    let temp :any  = []
    
    
    // while (ctr > 0) {

    //     indexb = Math.floor(Math.random() * ctr);
    //     indexi = Math.floor(Math.random() * ctr);
    //     indexn = Math.floor(Math.random() * ctr);
    //     indexg = Math.floor(Math.random() * ctr);
    //     indexo = Math.floor(Math.random() * ctr);

    //     ctr--;

    //     tempb = array.b[ctr];
    //     tempi = array.i[ctr];
    //     tempn = array.n[ctr];
    //     tempg = array.g[ctr];
    //     tempo = array.o[ctr];

    //     array.b[ctr] = array.b[indexb];
    //     array.i[ctr] = array.i[indexi];
    //     array.n[ctr] = array.n[indexn];
    //     array.g[ctr] = array.g[indexg];
    //     array.o[ctr] = array.o[indexo];

    //     array.b[indexb] = tempb;
    //     array.i[indexi] = tempi;
    //     array.n[indexn] = tempn;
    //     array.g[indexg] = tempg;
    //     array.o[indexo] = tempo;
    // }

    var count = 15
    var ct = 5

    // this.numbersBingo.b=[]
    // this.numbersBingo.i=[]
    // this.numbersBingo.n=[]
    // this.numbersBingo.g=[]
    // this.numbersBingo.o=[]

    temp = array

    var newArray:any ={
      b: [],
      i: [],
      n: [],
      g: [],
      o: []
    }

    while (ct > 0) {

      let indexb = Math.floor(Math.random() * count);
      let indexi = Math.floor(Math.random() * count);
      let indexn = Math.floor(Math.random() * count);
      let indexg = Math.floor(Math.random() * count);
      let indexo = Math.floor(Math.random() * count);

      count--
      ct--
      
      newArray.b.push(array.b[indexb])
      newArray.i.push(array.i[indexi])
      newArray.n.push(array.n[indexn])
      newArray.g.push(array.g[indexg])
      newArray.o.push(array.o[indexo])

      array.b.splice(indexb,1)
      array.i.splice(indexi,1)
      array.n.splice(indexn,1)
      array.g.splice(indexg,1)
      array.o.splice(indexo,1)

    }

    this.numbersBingo=newArray

    this.numbersBingo.n[2]='FREE'

    console.table(newArray)
    
  }

  flip(){
    return this.class
  }

  swiperight(e){
    this.class=[]
    this.playAudio();
    setTimeout(() => {
      this.completeNumbers()
      this.class=['flip']
    }, 100);

  }

  playAudio(){
    let audio = new Audio();
    audio.src = "assets/sound.wav";
    audio.load();
    audio.play();
  }

  formatBingo(){
    let bingo = this.numbersBingo
    
    for (let index = 0; index < 5; index++) {
      this.numbersBingo.b[index]={id:this.numbersBingo.b[index],selected:false}
      this.numbersBingo.i[index]={id:this.numbersBingo.i[index],selected:false}
      this.numbersBingo.n[index]={id:this.numbersBingo.n[index],selected:false}
      this.numbersBingo.g[index]={id:this.numbersBingo.g[index],selected:false}
      this.numbersBingo.o[index]={id:this.numbersBingo.o[index],selected:false}
    }

    return bingo
  }
  
  async validate(response,type){

    if(this.formGroup.status == "VALID"){

        let objectData = response
        objectData.bingo = this.formatBingo()
        objectData.master = type == 0 ? true:false

        if(this.savePhone){
          localStorage.setItem('phone',objectData.phone)
        }else{
            localStorage.removeItem('phone')
        }
        if(this.saveUser){
          localStorage.setItem('user',objectData.user)
        }else{
          localStorage.removeItem('user')
        }

        console.log(objectData)
        sessionStorage.setItem("sessionRoom",JSON.stringify(objectData))

        this.router.navigate([`/bingo/${objectData.room}`])

    }
  }

  createForm() {
    let phone = null
    let user = null
    if(localStorage.getItem('phone')){
      phone = localStorage.getItem('phone')
      this.savePhone=true
    }
    if(localStorage.getItem('user')){
      user=localStorage.getItem('user')
      this.saveUser=true
    }
    this.formGroup = this.formBuilder.group({
      'phone': [phone, Validators.required],
      'user': [user, Validators.required],
      'room': [null, Validators.required]
    });
  }

  errorPhone(){
    if(this.formGroup.get("phone").hasError('required')){
      return this.phoneError = 'Campo requerido'
    }

    if(this.formGroup.get("phone").hasError('Mask error')){
      return this.phoneError = 'Número de celular invalido'
    }

    return false;
  }

  errorUser(){
    if(this.formGroup.get("user").hasError('required')){
      return this.userError = 'Campo requerido'
    }
    return false;
  }

  errorPassword(){
    if(this.formGroup.get("room").hasError('required')){
      return this.roomError = 'Campo requerido'
    }
    return false;
  }
  

}
