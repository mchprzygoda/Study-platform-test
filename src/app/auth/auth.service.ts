import { inject, Injectable, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from "@angular/fire/auth";
import { from, map, Observable } from "rxjs";
import { UserInterface } from "./user.interface";


@Injectable({providedIn: 'root'})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);

  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  constructor() {
    // Subskrypcja strumienia user$ — aktualizujemy sygnał
    this.user$.subscribe(user => {
      if (user) {
        this.currentUserSig.set({
          uid: user.uid,
          email: user.email ?? '',
          username: user.displayName ?? ''
        });
      } else {
        this.currentUserSig.set(null);
      }
    });
  }

  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth, 
      email, 
      password
    ).then((response) => 
      updateProfile(response.user, {displayName: username}),
    );

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    
    return from(promise);
  }

  getUser(): UserInterface | null | undefined {
    return this.currentUserSig();
  }

  userSignal() {
    return this.currentUserSig;
  }

  userChanges(): Observable<UserInterface | null> {
  return this.user$.pipe(
    map(user => {
      if (!user) return null;

      return {
        uid: user.uid,
        email: user.email ?? '',
        username: user.displayName ?? ''  // lub '' zamiast null, jeśli w interfejsie string bez null
      };
    })
  );
}
}