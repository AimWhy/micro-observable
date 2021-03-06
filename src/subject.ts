import Observable from './observable';
import Subscription from './subscription';
import { Observer } from './types';
import { departializeObserver } from './utils/observer';

export default class Subject<T> extends Observable<T> {
  private observers: Array<Observer<T>> = [];
  private closed = false;
  constructor() {
    super(observer => {
      let dpo = departializeObserver(observer);
      this.observers.push(dpo);
      return new Subscription(() => {
        const index = this.observers.indexOf(dpo);
        if (index >= 0) this.observers.splice(index, 1);
      });
    });
  }

  next(x: T) {
    if (this.closed) throw new Error('Subject is already closed');
    this.observers.forEach(observer => observer.next(x));
  }

  error(e: any) {
    if (this.closed) throw new Error('Subject is already closed');
    this.observers.forEach(observer => observer.error(e));
  }

  complete() {
    if (this.closed) throw new Error('Subject is already closed');
    this.observers.forEach(observer => observer.complete());
    this.observers = [];
    this.closed = true;
  }
}
