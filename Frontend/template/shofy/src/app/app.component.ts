import { Component } from '@angular/core';
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BYCO';

  isCookieAccept=false;
/*
  constructor(private router: Router) {

  }

  ngOnInit(): void {
    const pathName = window.location.pathname;
    const pathElements = pathName.split("/").filter(p => p !== "");
    const routes = new Set(this.router.config.map(r => r.path));
    let existingPathElementCount = 0;

    console.log(pathName);
    console.log(pathElements);
    console.log(routes);
    console.log(existingPathElementCount);

    if (pathElements.length === 0 || pathName === "/") {
      return;
    }

    routes.forEach(r => {
      pathElements.forEach(p => r === p ? existingPathElementCount++ : existingPathElementCount)
    });

    if (pathElements.length === existingPathElementCount) {
      this.router.navigate([pathName]).then(r => {
        console.log(r);
      }).catch(e => {
        console.error(e + " " + pathName + " could not be found. Redirecting to home");
        this.router.navigate(['']).then(r => {
          console.log(r);
        })
      });
    } else {
      console.error(pathName + " could not be found. Redirecting to home");
      this.router.navigate(['/anasayfa']).then(r => {
        console.log(r);
      }).catch(e => {
        console.error(e);
        console.error("Redirecting to home failed");
      });
    }
  }*/

  gizle(){
    localStorage.setItem('cookie-consent', 'true');
  }

  cookieSonuc():boolean{
    if (!localStorage.getItem('cookie-consent')) {
        return true;
      }
    return false;

  }
}
