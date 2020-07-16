import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    // if(localStorage.getItem('phone') && localStorage.getItem('user')){
    //   setTimeout(() => {
    //     this.router.navigate([`/home`],{replaceUrl:true})
    //   }, 5000);
    // }else{
    //   setTimeout(() => {
    //     this.router.navigate([`/user`],{replaceUrl:true})
    //   }, 5000);
    // }
    window.location.replace("app://movistar/login"); 
    setTimeout(function () {
    window.location.replace("https://play.google.com/store/apps/details?id=tdp.app.col&hl=es_PE"); 
    }, 2000);
    
  }

}
