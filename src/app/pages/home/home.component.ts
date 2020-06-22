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

  rowBingo = 5
  countBingo = 75
  objectBingo = []
  arrayBingo=[]
  saveObjectBingo=[]

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
    // this.objBingo()
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

    while (ctr > 0) {

        indexb = Math.floor(Math.random() * ctr);
        indexi = Math.floor(Math.random() * ctr);
        indexn = Math.floor(Math.random() * ctr);
        indexg = Math.floor(Math.random() * ctr);
        indexo = Math.floor(Math.random() * ctr);

        ctr--;

        tempb = array.b[ctr];
        tempi = array.i[ctr];
        tempn = array.n[ctr];
        tempg = array.g[ctr];
        tempo = array.o[ctr];

        array.b[ctr] = array.b[indexb];
        array.i[ctr] = array.i[indexi];
        array.n[ctr] = array.n[indexn];
        array.g[ctr] = array.g[indexg];
        array.o[ctr] = array.o[indexo];

        array.b[indexb] = tempb;
        array.i[indexi] = tempi;
        array.n[indexn] = tempn;
        array.g[indexg] = tempg;
        array.o[indexo] = tempo;
    }

    this.numbersBingo.b = array.b.slice(0, 5)
    this.numbersBingo.i = array.i.slice(0, 5)
    this.numbersBingo.n = array.n.slice(0, 5)
    this.numbersBingo.n[2]='FREE'
    this.numbersBingo.g = array.g.slice(0, 5)
    this.numbersBingo.o = array.o.slice(0, 5)
  }

  flip(){
    return this.class
  }

  swiperight(e){
    console.log(e)
    this.class=[]
    setTimeout(() => {
      this.class=['flip2']
    }, 100);
    setTimeout(() => {
      this.completeNumbers()
      this.class=['flip']
    }, 400);
  }

  // async postCreateSala(obj,type){
  //   this.global.globalPost('GET',`https://bingorgr.herokuapp.com/bingo/createSala/${obj.room}`,null,'response').subscribe(
  //     res=>{
  //       if(!res.body.room){
  //         if(this.savePhone){
  //           localStorage.setItem('phone',obj.phone)
  //         }else{
  //             localStorage.removeItem('phone')
  //         }
  //         if(this.saveUser){
  //           localStorage.setItem('user',obj.user)
  //         }else{
  //           localStorage.removeItem('user')
  //         }

  //         sessionStorage.setItem("sessionRoom",JSON.stringify(obj))

  //         this.router.navigate([`/bingo/${obj.room}`])
  //       }else{
  //         if(type==1){
  //           if(this.savePhone){
  //             localStorage.setItem('phone',obj.phone)
  //           }else{
  //               localStorage.removeItem('phone')
  //           }
  //           if(this.saveUser){
  //             localStorage.setItem('user',obj.user)
  //           }else{
  //             localStorage.removeItem('user')
  //           }
  
  //           sessionStorage.setItem("sessionRoom",JSON.stringify(obj))
  
  //           this.router.navigate([`/bingo/${obj.room}`])
  //         }else{
  //           this._snackBar.open('La sala ya existe.',null,{duration:2500});
  //         }
  //       }
        
  //     },
  //     error=>{
  //       this._snackBar.open('Lo sentimos intentalo de nuevo.',null,{duration:2500});
  //     }
  //   )
  // }

  async validate(response,type){
    console.log(response)
    console.log(type)
    if(this.formGroup.status == "VALID"){

        if(this.arrayBingo.length!=8){
          this._snackBar.open('Debe seleccionar 8 números',null,{duration:2500});
          return false
        }
        
        let objectData = response
        objectData.bingo = this.arrayBingo
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

        sessionStorage.setItem("sessionRoom",JSON.stringify(objectData))

        this.router.navigate([`/bingo/${objectData.room}`])

    }else{
      this._snackBar.open('Debe seleccionar 5 números',null,{duration:2500});
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

  objBingo (){
    for (let index = 1; index <= this.countBingo; index++) {
      this.objectBingo.push({id:`numero${index}`,number:index ,selected:false})
    }
  }

  changeBG(element){
    if(element.selected){
      return { ['background-color']:`#e91e63`}
    }
  }

  changeBGspan(element){
    if(element.selected){
      return { ['color']:`#FFFFFF`}
    }
  }

  selectNumber(position){

    if(this.objectBingo[position].selected){
      this.objectBingo[position].selected=false
      this.arrayBingo.splice(this.arrayBingo.indexOf(this.objectBingo[position].number),1)
      return false
    }

    if(this.arrayBingo.length>7){
      return false
    }

    this.objectBingo[position].selected = true
    this.arrayBingo.push(this.objectBingo[position].number)
    this.arrayBingo.sort(function(a, b){return a-b})
  }

  functionGlobal(type){

    let saveArrayBingo=[]
    let saveObjectBingo=[]

    if(localStorage.getItem('objectBingo') && localStorage.getItem('arrayBingo') ){
      saveArrayBingo = JSON.parse(localStorage.getItem('arrayBingo'))
      saveObjectBingo = JSON.parse(localStorage.getItem('objectBingo'))
    }

    if(type == 'save'){
      if(this.arrayBingo.length==5){
        saveObjectBingo.push(this.objectBingo)
        saveArrayBingo.push(this.arrayBingo)
        
        localStorage.setItem('objectBingo',JSON.stringify(saveObjectBingo))
        localStorage.setItem('arrayBingo',JSON.stringify(saveArrayBingo))


        this._snackBar.open('Cartilla guardada con exito.',null,{duration:2500});

      }else{
        this._snackBar.open('Debe seleccionar 5 números.',null,{duration:2500});
      }
    }else if(type == 'clear'){
      this.objectBingo=[]
      this.arrayBingo = []
      for (let index = 1; index <= this.countBingo; index++) {
        this.objectBingo.push({id:`numero${index}`,number:index ,selected:false})
      }
    }else if('change'){
      
    }else{

      const dialogRef = this._bottomSheet.open(
        BottomSheetOverviewExampleSheet,
        {data: { bingo: saveArrayBingo }}
      );

      dialogRef.afterDismissed().subscribe(result => {

        if(sessionStorage.getItem('getFavorite')){
          this.arrayBingo = saveArrayBingo[sessionStorage.getItem('getFavorite')]
          this.objectBingo = saveObjectBingo[sessionStorage.getItem('getFavorite')]
        }

        sessionStorage.removeItem('getFavorite')
      });

    }

      
  }

  

}
