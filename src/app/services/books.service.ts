import {Injectable} from '@angular/core';
import {Book} from '../models/Book.model';
import {Subject} from 'rxjs';
import firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable()
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();

  constructor() {
    this.getBooks();
  }

  emitBooks(): void{
    this.booksSubject.next(this.books);
  }

  saveBooks(): any {
    firebase.database().ref('/books').set(this.books);
  }

  getBooks(): void {
    firebase.database().ref('/books')
      .on('value', (data: DataSnapshot) => {
          this.books = data.val() ? data.val() : [];
          this.emitBooks();
        }
      );
  }

  getSingleBook(id: number): Promise<Book> {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewBook(newBook: Book): void {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book): void{
    if (book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo supprimée !');
        }
        ).catch(
        (error) => {
          console.log('Fichier non trouvé : ' + error);
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if (bookEl === book) {
          return true;
        }
      });
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File): Promise<string>{
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('/images' + almostUniqueFileName + file.name)
          .put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement...');
          }, (error) => {
            console.log('Erreur de chargement : ' + error);
            reject();
          }, () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          });
      });
  }
}
