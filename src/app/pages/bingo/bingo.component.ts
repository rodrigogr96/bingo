import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import io from "socket.io-client";
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import Speech from 'speak-tts'

const speech = new Speech()
@Component({
  selector: 'app-bingo',
  templateUrl: './bingo.component.html',
  styleUrls: ['./bingo.component.scss']
})

export class BingoComponent implements OnInit,OnDestroy {

  arrayString = ['b','i','n','g','o']
  numbersBingo = {
    b: [],
    i: [],
    n: [],
    g: [],
    o: []
  }
  cardBingo = {
    b: [],
    i: [],
    n: [],
    g: [],
    o: []
  }
  numberBingo=0
  numberBingo1=0
  numberBingo2=0
  numberBingo3=0
  countPlayer=0
  infoRoom=[]
  myInfo={
    bingo: null,
    master: null,
    phone: null,
    room: null,
    user: null,
  }
  bingo=[]
  rowBingo = 10
  countBingo = 75
  objectBingo = []
  arrayBingo=[]
  numberSeleted=[]
  marter = false

  play = false
  intervalo : any

  private socket: any;

  constructor(private route: ActivatedRoute, private router:Router,private _snackBar: MatSnackBar,private location: Location) { 
    this.objBingo()
    this.socket = io('http://localhost:3000')
  }

  ngOnDestroy(){
    this.socket.disconnect();
    sessionStorage.clear()
  }

  ngOnInit() {

    this.speach()
    
    this.route.paramMap.subscribe(params => {
      if(sessionStorage.getItem("sessionRoom")){

        const bingo = JSON.parse(sessionStorage.getItem("sessionRoom")).bingo
        const phone = JSON.parse(sessionStorage.getItem("sessionRoom")).phone
        const room = JSON.parse(sessionStorage.getItem("sessionRoom")).room
        const user = JSON.parse(sessionStorage.getItem("sessionRoom")).user
        const master = JSON.parse(sessionStorage.getItem("sessionRoom")).master

        this.marter=master
        this.cardBingo = bingo
        this.myInfo = JSON.parse(sessionStorage.getItem("sessionRoom"))

        if(master){
          console.log(master)
          this.socket.emit('createRoom',{room,user:{bingo,phone,room,user,master}})
        }else{
          this.socket.emit('joinRoom',{user:{bingo,phone,room,user,master}} )
        }

        this.listen()
        this.completeNumbers()
      }else{
        this.router.navigate([`/user`])
      }
    });
  }

  speach(){
    if(speech.hasBrowserSupport()) { 
      speech.init({
        'volume': 1,
        'lang': 'es-ES',
        'rate': 1,
        'pitch': 1,
        'voice':'Google español',
        'splitSentences': true,
        'listeners': {
            'onvoiceschanged': (voices) => {
                console.log("Event voiceschanged", voices)
            }
        }
      }).then((data) => {
        console.log("Speech is ready, voices are available", data)
      }).catch(e => {
        console.error("An error occured while initializing : ", e)
      })
    }
    
  }

  completeNumbers(){
    for (var i = 1; i < 16; i++) {
      this.numbersBingo.b.push(i);
      this.numbersBingo.i.push(15 + i);
      this.numbersBingo.n.push(30 + i);
      this.numbersBingo.g.push(45 + i);
      this.numbersBingo.o.push(60 + i);
    }
  }
  

  objBingo (){
    for (let index = 0; index < this.countBingo; index++) {
      this.objectBingo.push(index+1)
    }
    console.log(this.arrayBingo)
  }

  win(){
    if(this.bingo.length>0){
      return { ['height']:`100vh`,['opacity']:'1',['display']:'flex' }
    }
  }

  regresar(){
    this.router.navigate([`/user`]) 
  }


  changeBG(element){
    if(element.selected){
      return { ['background-color']:`#ffd740` }
    }
  }

  changeBGspan(element){
    if(this.numberSeleted.indexOf(element)>-1){
      return { ['color']:`#FFFFFF`,['font-weight']:'bold'}
    }
  }

  listen(){

    this.socket.on("room",data=>{
      console.log(data)
      this.arrayBingo=data.room.arrayBingo
      this.numberSeleted=data.room.selectNumber
      this.infoRoom = data.room.users
      this.bingo = data.room.bingo
    })

    this.socket.on("play",data=>{
      console.log(data)
      this.arrayBingo=data.room.arrayBingo
      this.numberSeleted=data.room.selectNumber
      this.infoRoom = data.room.users
      this.bingo = data.room.bingo

      let letter 
      if(this.numberSeleted[this.numberSeleted.length-1]<16){
        letter = 'B'
      }
      if(this.numberSeleted[this.numberSeleted.length-1]>15 && this.numberSeleted[this.numberSeleted.length-1]<31){
        letter = 'I'
      }
      if(this.numberSeleted[this.numberSeleted.length-1]>30 && this.numberSeleted[this.numberSeleted.length-1]<46){
        letter = 'N'
      }
      if(this.numberSeleted[this.numberSeleted.length-1]>45 && this.numberSeleted[this.numberSeleted.length-1]<61){
        letter = 'G'
      }
      if(this.numberSeleted[this.numberSeleted.length-1]>60){
        letter = 'O'
      }
      speech.speak({
          text: `${letter} ${this.numberSeleted[this.numberSeleted.length-1]}`,
          queue: false
        })
        .then(data => {
          console.log("Success !", data);
        })
        .catch(e => {
          console.error("An error occurred :", e);
        });
    });
    
    this.socket.on("pausar", data => {
      if(this.myInfo.master){
        console.log(data)
        this.play=false
        clearInterval(this.intervalo)
      }
    });

    this.socket.on("bingo", data => {
      console.log("bingo")
      console.log(data)
      this.arrayBingo=data.room.arrayBingo
      this.numberSeleted=data.room.selectNumber
      this.infoRoom = data.room.users
      this.bingo = data.room.bingo

      speech.speak({
        text: `BINGO`,
        queue: false
      })
      .then(data => {
        console.log("Success !", data);
      })
      .catch(e => {
        console.error("An error occurred :", e);
      });

    });
    
    this.socket.on("message", data => {
      // console.log(data)
      this._snackBar.open(data,null,{duration:2500});
    });

    this.socket.on("sala", () => {
      this.router.navigate([`/user`])
    });

  }

  girar(){
    
    if(!this.play){
      console.log("play")
      
      this.play=true
      this.start()
    }else{
      console.log("pause")
      this.play=false
      clearInterval(this.intervalo)
    }

  }

  start(){
      this.intervalo = setInterval(this.cronometro,5000)
  }

  cronometro=()=> {    
    if(this.numberSeleted.length==75){
      this.play=false
      clearInterval(this.intervalo)
    }else{
      this.socket.emit('girar',{room:this.myInfo} )
    }
    
  }

  balls(element){
    if(element<16){
      return { ['background-color']:`#CC1F2D` }
    }
    if(element>15 && element<31){
      return { ['background-color']:`#FCC10E` }
    }
    if(element>30 && element<46){
      return { ['background-color']:`#9AB671` }
    }
    if(element>45 && element<61){
      return { ['background-color']:`#0792C9` }
    }
    if(element>60){
      return { ['background-color']:`#B43C93` }
    }
  }

  select(value,index,type){
    if(value.id=='FREE'){
      return false
    }

    if(value.selected){
      return false
    }

    const existe = this.numberSeleted.indexOf(value.id)

    switch (type) {
      case 'b':
        if(existe>-1){
          this.cardBingo.b[index].selected=true
        }
        break;
      case 'i':
        if(existe>-1){
          this.cardBingo.i[index].selected=true
        }
        break;
      case 'n':
        if(existe>-1){
          this.cardBingo.n[index].selected=true
        }
        break;
      case 'g':
        if(existe>-1){
          this.cardBingo.g[index].selected=true
        }
        break;
      case 'o':
        if(existe>-1){
          this.cardBingo.o[index].selected=true
        }
        break;
      default:

        break;
    }

    if(existe>-1){
      this.goodAudio()
      this.myInfo.bingo=this.cardBingo

      let count = this.validarBingo()

      if(count>23){

        this.socket.emit('win',{room:this.myInfo} )
      }

      // sessionStorage.setItem("sessionRoom",JSON.stringify(this.myInfo))
    }else{
      this.badAudio()
    }
  }

  validarBingo(){
    let value = 0
    for (let index = 0; index < 5; index++) {
      if(this.cardBingo.b[index].selected){
        value++
      }
      if(this.cardBingo.i[index].selected){
        value++
      }
      if(this.cardBingo.n[index].selected){
        value++
      }
      if(this.cardBingo.g[index].selected){
        value++
      }
      if(this.cardBingo.o[index].selected){
        value++
      }
    }
    return value
  }

  badAudio(){
    let audio = new Audio();
    audio.src = "assets/bad.wav";
    audio.load();
    audio.play();
  }

  goodAudio(){
    let audio = new Audio();
    audio.src = "assets/yeah.wav";
    audio.load();
    audio.play();
  }

  

}
