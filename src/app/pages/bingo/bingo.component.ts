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

  
  numberBingo=0
  numberBingo1=0
  numberBingo2=0
  numberBingo3=0
  countPlayer=0
  bingo=[]
  rowBingo = 10
  countBingo = 75
  objectBingo = []

  myInfo={
    master: null,
    phone: null,
    room: null,
    user: null,
  }
  infoRoom=[]
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
  shapeBingo = {
    b: ['b1','b2','b3','b4','b5'],
    i: ['i1','i2','i3','i4','i5'],
    n: ['n1','n2','n3','n4','n5'],
    g: ['g1','g2','g3','g4','g5'],
    o: ['o1','o2','o3','o4','o5'],
  }
  styleUser = []
  styleTablero = []
  arrayBingo=[]
  numberSeleted=[]
  shapeRoomBingo=[]
  info:any = {}
  room:any = {}
  master = false
  play = false
  intervalo : any
  block=false
  class = [] 
  classFlip = [] 
  namesala = 'as'
  
  private socket: any;

  constructor(private route: ActivatedRoute, private router:Router,private _snackBar: MatSnackBar,private location: Location) { 
    // this.objBingo()
    this.socket = io()

  }

  ngOnDestroy(){
    this.socket.disconnect();
    this.play=false
    clearInterval(this.intervalo)
    sessionStorage.clear()
  }

  ngOnInit() {

    this.speach()
    
    this.route.paramMap.subscribe(() => {
      if(sessionStorage.getItem("infoUser")){

        const user = JSON.parse(sessionStorage.getItem("infoUser"))
        this.info = user
        this.namesala = user.room

        if(user.master){
          const room = JSON.parse(sessionStorage.getItem("infoRoom"))
          this.socket.emit('createRoom',{room,user})
        }else{
          this.socket.emit('joinRoom',{user} )
        }
        this.listen()
      }else{
        this.router.navigate([`/user`])
      }
    });
  }


  swiperight(e){
    console.log(e)
    if(this.room.ready){
      console.log("YA COMENZO EL JUEGO")
      return false
    }else{
      this.classFlip=[]
      this.playAudio();
      setTimeout(() => {
        // this.completeNumbers()
        this.randomNumbers((this.room.count/5))
        this.classFlip=['flip']
      }, 100);
    }
    
  }

  flip(){
    return this.classFlip
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "assets/sound.wav";
    audio.load();
    audio.play();
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

  user(e){
    e.stopPropagation()
    this.styleUser=['userShow']
  }

  tablero(e){
    e.stopPropagation()
    this.styleTablero=['tableroShow']
  }

  tableroStyle(){
    return this.styleTablero
  }

  userStyle(){
    return this.styleUser
  }

  clearStyle(){
    this.styleTablero=[]
    this.styleUser=[]
  }

  win(){
    if(this.bingo.length>0){
      return { ['height']:`100vh`,['opacity']:'1',['display']:'flex',['transform']:'scale(1)' }
    }
  }

  regresar(){
    this.router.navigate([`/home`]) 
  }


  changeBG(element){
    if(element.selected){
      return { ['background-color']:`#fff`,['transform']:'rotateX(80deg) scaleY(2)'}
    }
  }

  shapetablero(element){
    if(this.shapeRoomBingo.indexOf(element)>-1){
      return { ['background-color']:'#FCC10E'}
    }
    if(element=='n3'){
      return { ['background-color']:'#E6E7E5',['border']:'1px solid #707F92'}
    }
  }

  changeBGspan(element){
    if(this.numberSeleted.indexOf(element)>-1){
      return { ['color']:`#000`,['font-weight']:'bold',['font-size']:'11px',['opacity']:'1'}
    }
  }

  clear(){
    this.numbersBingo.b=[]
    this.numbersBingo.i=[]
    this.numbersBingo.n=[]
    this.numbersBingo.g=[]
    this.numbersBingo.o=[]
  }

  completeNumbers(count){

    this.clear()

    let arrayBingos = {
      b: [],
      i: [],
      n: [],
      g: [],
      o: []
    }

    for (var i = 1; i <= (count/5); i++) {
      arrayBingos.b.push(i);
      arrayBingos.i.push((count/5) + i);
      arrayBingos.n.push((count/5)*2 + i);
      arrayBingos.g.push((count/5)*3 + i);
      arrayBingos.o.push((count/5)*4 + i);
    }

    this.numbersBingo = arrayBingos
    

    this.randomNumbers((count/5))
  }

  randomNumbers(contador){

    let arrayBingos = {
      b: [],
      i: [],
      n: [],
      g: [],
      o: []
    }

    for (var i = 1; i <= contador; i++) {
      arrayBingos.b.push(i);
      arrayBingos.i.push((contador) + i);
      arrayBingos.n.push((contador)*2 + i);
      arrayBingos.g.push((contador)*3 + i);
      arrayBingos.o.push((contador)*4 + i);
    }

    var count = contador
    var ct = 5


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
      
      newArray.b.push({id:arrayBingos.b[indexb],selected:false})
      newArray.i.push({id:arrayBingos.i[indexi],selected:false})
      newArray.n.push({id:arrayBingos.n[indexn],selected:false})
      newArray.g.push({id:arrayBingos.g[indexg],selected:false})
      newArray.o.push({id:arrayBingos.o[indexo],selected:false})

      arrayBingos.b.splice(indexb,1)
      arrayBingos.i.splice(indexi,1)
      arrayBingos.n.splice(indexn,1)
      arrayBingos.g.splice(indexg,1)
      arrayBingos.o.splice(indexo,1)

    }

    this.cardBingo=newArray

    this.cardBingo.n[2].id='FREE'    
  }

  listen(){

    this.socket.on("room",data=>{
      console.log("room")
      this.room = data.room
      this.infoRoom = data.room.users
      this.arrayBingo = data.room.arrayBingo
      this.numberSeleted = data.room.select
      this.shapeRoomBingo = data.room.shape
      this.completeNumbers(data.room.count)
      const index = data.room.users.findIndex(r => r.phone === this.info.phone && r.user === this.info.user)
      this.master = data.room.users[index].master
      if(data.room.users[index].master){
        const user = {
          user:this.info.user,
          phone:this.info.phone,
          master:true,
          room:data.room.room
        }
        const room = {
          shape:data.room.shape,
          count:data.room.count,
          room:data.room.room
        }

        this.info = user

        sessionStorage.setItem('infoRoom',JSON.stringify(room))
        sessionStorage.setItem('infoUser',JSON.stringify(user))

      }
    })

    this.socket.on("idroom",data=>{
      console.log("idroom")
      this.room = data.room
      this.infoRoom = data.room.users
      this.completeNumbers(data.room.count)
      this.arrayBingo = data.room.arrayBingo
      this.numberSeleted = data.room.select
      this.shapeRoomBingo = data.room.shape
      const index = data.room.users.findIndex(r => r.phone === this.info.phone && r.user === this.info.user)
      this.master = data.room.users[index].master
      if(data.room.users[index].master){
        const user = {
          user:this.info.user,
          phone:this.info.phone,
          master:true,
          room:data.room.room
        }
        const room = {
          shape:data.room.shape,
          count:data.room.count,
          room:data.room.room
        }

        this.info = user

        sessionStorage.setItem('infoRoom',JSON.stringify(room))
        sessionStorage.setItem('infoUser',JSON.stringify(user))

      }
    })

    this.socket.on("addRoom",data=>{
      console.log("addRoom")
      this.room = data.room
      this.infoRoom = data.room.users
      this.arrayBingo = data.room.arrayBingo
      this.numberSeleted = data.room.select
      this.shapeRoomBingo = data.room.shape
      const index = data.room.users.findIndex(r => r.phone === this.info.phone && r.user === this.info.user)
      this.master = data.room.users[index].master
      if(data.room.users[index].master){
        const user = {
          user:this.info.user,
          phone:this.info.phone,
          master:true,
          room:data.room.room
        }
        const room = {
          shape:data.room.shape,
          count:data.room.count,
          room:data.room.room
        }

        this.info = user

        sessionStorage.setItem('infoRoom',JSON.stringify(room))
        sessionStorage.setItem('infoUser',JSON.stringify(user))

      }
    })

    this.socket.on("leaveroom",data=>{
      console.log("addRoom")
      this.room = data.room
      this.infoRoom = data.room.users
      this.arrayBingo = data.room.arrayBingo
      this.numberSeleted = data.room.select
      this.shapeRoomBingo = data.room.shape
      const index = data.room.users.findIndex(r => r.phone === this.info.phone && r.user === this.info.user)
      this.master = data.room.users[index].master
      if(data.room.users[index].master){
        const user = {
          user:this.info.user,
          phone:this.info.phone,
          master:true,
          room:data.room.room
        }
        const room = {
          shape:data.room.shape,
          count:data.room.count,
          room:data.room.room
        }

        this.info = user

        sessionStorage.setItem('infoRoom',JSON.stringify(room))
        sessionStorage.setItem('infoUser',JSON.stringify(user))

      }
    })
    

    this.socket.on("play",data=>{
      console.log(data)

      this.ballAudio()
      this.room = data.room
      this.arrayBingo=data.room.arrayBingo
      this.numberSeleted=data.room.select
      this.infoRoom = data.room.users
      this.bingo = data.room.bingo
      this.shapeRoomBingo = data.room.shape

      const count = this.room.count/5
      let letter 
      if(this.numberSeleted[this.numberSeleted.length-1]<count+1){
        letter = 'B'
      }
      if(this.numberSeleted[this.numberSeleted.length-1]>(count) && this.numberSeleted[this.numberSeleted.length-1]<(count*2)+1){
        letter = 'I'
      }
      if(this.numberSeleted[this.numberSeleted.length-1]>(count*2) && this.numberSeleted[this.numberSeleted.length-1]<(count*3)+1){
        letter = 'N'
      }
      if(this.numberSeleted[this.numberSeleted.length-1]>(count*3) && this.numberSeleted[this.numberSeleted.length-1]<(count*4)+1){
        letter = 'G'
      }
      if(this.numberSeleted[this.numberSeleted.length-1]>(count*4)){
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
      if(this.info.master){
        this.play=false
        clearInterval(this.intervalo)
      }
    });

    this.socket.on("play", data => {
      if(this.info.master){
        this.play=true
        this.girar()
      }
    });

    this.socket.on("bingo", data => {
      this.room = data.room
      this.arrayBingo=data.room.arrayBingo
      this.numberSeleted=data.room.select
      this.infoRoom = data.room.users
      this.bingo = data.room.bingo
      this.shapeRoomBingo = data.room.shape
      this.class=['seven']
      if(this.info.master){
        this.play=false
        clearInterval(this.intervalo)
      }
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
      this._snackBar.open(data,null,{duration:1500});
    })

    this.socket.on("existMaster", data => {
      this._snackBar.open('Existe master',null,{duration:2500});
    })
    
    this.socket.on("ready",data =>{
      this._snackBar.open('El juego ya comenzo',null,{duration:2500});
    })

    this.socket.on("existRoom",data =>{
      this._snackBar.open('La sala no existe.',null,{duration:2500});
    })

    this.socket.on("changeMaster",data =>{
      const user = {
        user:this.info.user,
        phone:this.info.phone,
        master:false,
        room:data.room.room
      }
      
      this.info = user

      sessionStorage.setItem('infoUser',JSON.stringify(user))
      sessionStorage.removeItem('infoRoom')
    })

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
    if(this.numberSeleted.length==this.room.count){
      this.play=false
      clearInterval(this.intervalo)
    }else{
      this.socket.emit('girar',{room:this.info} )
    }
    
  }

  balls(element){
    const count = (this.room.count/5)
    if(element<(count+1)){
      return ['rolling','bi']
    }
    if(element>count && element<(count*2)+1){
      return ['rolling','ii']
    }
    if(element>(count*2) && element<(count*3)+1){
      return ['rolling','ni']
    }
    if(element>(count*3) && element<(count*4)+1){
      return ['rolling','gi']
    }
    if(element>(count*4)){
      return ['rolling','oi']
    }
  }

  select(value,index,type){

    if(!this.block){
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
      }else{
        this.badAudio()
      }
    }else{

      this._snackBar.open('Se encuentra bloqueado por 5 segundos',null,{duration:1500});
    }
  }

  validar(){
    if(!this.block){
      let value = 0
      const count = this.shapeRoomBingo.length
  
      for (let index = 0; index < 5; index++) {
        if(this.cardBingo.b[index].selected && this.shapeRoomBingo.indexOf(`b${index+1}`)>-1){
          value++
        }
        if(this.cardBingo.i[index].selected && this.shapeRoomBingo.indexOf(`i${index+1}`)>-1 ){
          value++
        }
        if(this.cardBingo.n[index].selected && this.shapeRoomBingo.indexOf(`n${index+1}`)>-1){
          value++
        }
        if(this.cardBingo.g[index].selected && this.shapeRoomBingo.indexOf(`g${index+1}`)>-1){
          value++
        }
        if(this.cardBingo.o[index].selected && this.shapeRoomBingo.indexOf(`o${index+1}`)>-1){
          value++
        }
      }
      if(value==count){
        let info = this.info
        info.cartilla = this.cardBingo
        this.socket.emit('win',{room:info} )
      }else{
        
        this._snackBar.open('Bloqueado por cantar bingo antes de tiempo',null,{duration:1500});
        this.block=true
        setTimeout(() => {
          this.block=false
        }, 5000);
      }
    }else{
      this._snackBar.open('Se encuentra bloqueado por 5 segundos',null,{duration:1500});
    }
  }

  modal(){
    return this.class
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

  ballAudio(){
    let audio = new Audio();
    audio.src = "assets/ball.mp3";
    audio.load();
    audio.play();
  }

  

}
