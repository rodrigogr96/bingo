// import { element } from 'protractor';
import { Component, OnInit, ViewChild, ElementRef,AfterViewInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router'
import { SwiperOptions } from 'swiper';  
import { INgxArcTextComponent } from 'ngx-arc-text';

@Component({
  selector: 'app-home-bingo',
  templateUrl: './home-bingo.component.html',
  styleUrls: ['./home-bingo.component.scss']
})

export class HomeBingoComponent implements OnInit,AfterViewInit,OnDestroy {

  @ViewChild('swiper') swiperChild
  @ViewChild('focus') searchElement: ElementRef;
  @ViewChild('letters') letters: INgxArcTextComponent;
  slides = [{id:1,name:'BINGO 75',count:75},{id:2,name:'BINGO 90',count:90}]
  index = 0
  config: SwiperOptions = {
    updateOnWindowResize:true,
    initialSlide:this.index,
    effect: 'coverflow',
    grabCursor: false,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 10,
    setWrapperSize:true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 0,
      modifier: 1,
      slideShadows: false
    }
  }
  usuario=''
  cell=''
  style = {['width']:'0px',['opacity']:'0',['transform']:'translateY(0px) scale(0)'}
  class = [] 
  arrayString = ['b','i','n','g','o']
  numbersBingo = {
    b: [],
    i: [],
    n: [],
    g: [],
    o: []
  }
  count = 0
  selectForma = []
  roomName = ''
  audio = new Audio();


  constructor(private router:Router) { 

    if(localStorage.getItem('phone') && localStorage.getItem('user')){
      this.usuario = localStorage.getItem('user')
      this.cell = localStorage.getItem('phone')
    }else{
        this.router.navigate([`/`],{replaceUrl:true})
    }

  }

  ngOnDestroy(){
    this.audio.pause()
  }
  ngAfterViewInit() {
    this.swiperChild.swiper.on('slideChange', () => {
      this.index = this.swiperChild.swiper.activeIndex
      this.count = this.slides[this.index].count
    });
    this.swiperChild.swiper.on('resize', () => {
      setTimeout(() => {
        this.swiperChild.swiper.update()
      }, 500);
    });
  }


  ngOnInit() {
    for (var i = 1; i < 6; i++) {
      this.numbersBingo.b.push(i);
      this.numbersBingo.i.push(i);
      this.numbersBingo.n.push(i);
      this.numbersBingo.g.push(i);
      this.numbersBingo.o.push(i);
    }
    this.numbersBingo.n[2]='CREAR'

    this.Audio()
  }

  modal(){
    return this.class
  }

  back(){
    localStorage.clear()
    this.router.navigate([`/user`])
  }

  buscar(){
    this.style = {['width']:'100%',['opacity']:'1',['transform']:'translateY(0px) scale(.8)'}
    setTimeout(()=>{ 
      this.searchElement.nativeElement.focus();
    },0); 
  }

  buscarSala(){
    this.style = {['width']:'100%',['opacity']:'1',['transform']:'translateY(0px) scale(.8)'}
    setTimeout(()=>{ 
      this.searchElement.nativeElement.focus();
    },0);
    if(this.roomName.length>4){
      const user = {
        user:this.usuario,
        phone:this.cell,
        master:false,
        room:this.roomName
      }
      sessionStorage.setItem('infoUser',JSON.stringify(user))
      this.router.navigate([`/bingo/${this.roomName}`])
    }
    
    
  }

  crear(){
    this.class=['seven']
    this.count = this.slides[this.index].count
  }

  cerrar(){
    this.class=['seven','out']
    this.selectForma=[]
  }

  prevent(e){
    e.stopPropagation()
  }

  searchStyle(){
    return this.style
  }

  blur(){
    this.style = {['width']:'0px',['opacity']:'0',['transform']:'translateY(0px) scale(.8)'}
  }

  activeCard(type,element){

    const existe = this.selectForma.indexOf(`${type}${element}`)
    if( existe > -1){
      return ['active-card']
    }else{
      return []
    }
  }

  select(type,element){
    console.log(type,element)
    if(element=='CREAR'){
          const sala = this.makeid(5)
          const user = {
            user:this.usuario,
            phone:this.cell,
            master:true,
            room:sala
          }
          let room = {
            shape:[],
            count:this.count,
            room:sala
          }
          
        if(this.selectForma.length>0){
          room.shape=this.selectForma

          
        }else{
          
          for (let index = 1; index <= 5; index++) {
            this.selectForma.push(`b${index}`)
            this.selectForma.push(`i${index}`)
            if(index == 3){
            }else{
              this.selectForma.push(`n${index}`)
            }
            this.selectForma.push(`g${index}`)
            this.selectForma.push(`o${index}`)
          }

          room.shape=this.selectForma
          
        }

        sessionStorage.setItem('infoUser',JSON.stringify(user))
        sessionStorage.setItem('infoRoom',JSON.stringify(room))
        this.router.navigate([`/bingo/${sala}`])
        console.log(user,room)
    }else{
      const existe = this.selectForma.indexOf(`${type}${element}`)
      if( existe >-1){
        this.selectForma.splice(existe,1)
      }else{
        this.selectForma.push(`${type}${element}`)
      }
    }
  }

  makeid(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  Audio(){
    
    this.audio.src = "assets/audio.mp3";
    this.audio.loop = true;
    this.audio.play();
  }

  // onIndexChange(e){
  //   console.log(e)
  // }

}
