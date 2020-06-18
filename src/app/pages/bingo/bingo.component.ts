import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bingo',
  templateUrl: './bingo.component.html',
  styleUrls: ['./bingo.component.scss']
})

export class BingoComponent implements OnInit {

  numberBingo=0
  numberBingo1=0
  numberBingo2=0
  numberBingo3=0
  countPlayer=0
  infoRoom=[]
  myInfo={}
  rowBingo = 10
  countBingo = 75
  objectBingo = []
  arrayBingo=[]
  numberSeleted=[]

  private socket: any;

  constructor(private route: ActivatedRoute, private router:Router,private _snackBar: MatSnackBar) { 
    this.objBingo()
    this.socket = io("https://bingorgr.herokuapp.com/")
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if(sessionStorage.getItem("sessionRoom")){

        const bingo = JSON.parse(sessionStorage.getItem("sessionRoom")).bingo
        const phone = JSON.parse(sessionStorage.getItem("sessionRoom")).phone
        const room = JSON.parse(sessionStorage.getItem("sessionRoom")).room
        const user = JSON.parse(sessionStorage.getItem("sessionRoom")).user
        const master = JSON.parse(sessionStorage.getItem("sessionRoom")).master

        this.myInfo = JSON.parse(sessionStorage.getItem("sessionRoom"))

        
        this.socket.emit('joinRoom',{bingo,phone,room,user,master} )

        if(master){
          console.log(master)
          this.socket.emit('createRoom',{room})
        }

      }else{
        this.router.navigate([`/user`])
      }
    });
    this.listen()
  }

  objBingo (){
    for (let index = 0; index < this.countBingo; index++) {
      this.objectBingo.push(index+1)
    }
    console.log(this.arrayBingo)
  }


  changeBG(element){
    if(this.numberSeleted.indexOf(element)>-1){
      return { ['background-color']:`#e91e63` }
    }
  }

  changeBGspan(element){
    if(this.numberSeleted.indexOf(element)>-1){
      return { ['color']:`#FFFFFF`}
    }
  }

  listen(){
    this.socket.on("roomCreate",data=>{
      console.log(data)
    })
    this.socket.on("message", data => {
      this._snackBar.open(data,null,{duration:2500});
    });

    this.socket.on("roomUsers",({ room, users }) =>{
      console.log(users)
      this.countPlayer=users.length
      this.infoRoom=users
    })

    this.socket.on("validatePhone",value =>{
      this.router.navigate([`/user`])
    })

    this.socket.on("play",value =>{
      console.log(value)
      this.arrayBingo=value.data.arrayBingo
      this.numberSeleted=value.data.selectNumber
      this.numberBingo=this.numberSeleted[value.data.selectNumber.length-1]
      this.numberBingo1=this.numberSeleted[value.data.selectNumber.length-2]
      this.numberBingo2=this.numberSeleted[value.data.selectNumber.length-3]
      this.numberBingo3=this.numberSeleted[value.data.selectNumber.length-4]
    })

    this.socket.on("data",value =>{
      console.log(value)
      this.arrayBingo=value.data.arrayBingo
      this.numberSeleted=value.data.selectNumber
      this.numberBingo=this.numberSeleted[value.data.selectNumber.length-1]
      this.numberBingo1=this.numberSeleted[value.data.selectNumber.length-2]
      this.numberBingo2=this.numberSeleted[value.data.selectNumber.length-3]
      this.numberBingo3=this.numberSeleted[value.data.selectNumber.length-4]
    })
  }


  girar(){
    console.log("play")
    this.socket.emit('girar',{room:this.myInfo} )
  }

}
