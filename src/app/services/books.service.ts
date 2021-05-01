import {Injectable} from '@angular/core';
import {Book} from '../models/Book.model';
import {Subject} from 'rxjs';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();

  constructor() { }

  emitBooks(): void{
    this.booksSubject.next(this.books);
  }

  saveBooks(): void {
    firebase.database().ref('/books').set(this.books);
  }

  getBooks(): void{
    firebase.database().ref('/books')
      .on('value', (data) => {
        this.books = data.val() ? data.val() : [];
        this.emitBooks();
      });
  }

  getSingleBook(id: number): Promise<void> {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books' + id).once('value').then(
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
}
