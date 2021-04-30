import {Component} from '@angular/core';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyDle8Vxzx_-ejDnzRiynmssM6XIybVFwK0',
      authDomain: 'bookshelves-c230c.firebaseapp.com',
      projectId: 'bookshelves-c230c',
      storageBucket: 'bookshelves-c230c.appspot.com',
      messagingSenderId: '137613534316',
      appId: '1:137613534316:web:83d06b27d31759c76ae449'
    };
    firebase.initializeApp(firebaseConfig);
  }

}
