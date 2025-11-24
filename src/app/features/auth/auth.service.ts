import { inject, Injectable, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from "@angular/fire/auth";
import { Firestore, collection, doc, setDoc, getDoc } from "@angular/fire/firestore";
import { from, map, Observable } from "rxjs";
import { UserInterface } from "./user.interface";


@Injectable({providedIn: 'root'})
export class AuthService {
  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);
  user$ = user(this.firebaseAuth);

  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  constructor() {
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
    ).then(async (response) => {
      // Aktualizuj profil użytkownika z username
      await updateProfile(response.user, {displayName: username});
      
      // Zapisz dane użytkownika do kolekcji users w Firestore używając userId jako ID dokumentu
      const userDocRef = doc(this.firestore, 'users', response.user.uid);
      await setDoc(userDocRef, {
        userId: response.user.uid,
        username: username,
        email: email
      }, { merge: true }); // merge: true - jeśli dokument już istnieje, zaktualizuj tylko te pola
    }).catch((error) => {
      // Przekaż błąd dalej, żeby mógł być obsłużony w komponencie
      console.error('Firebase registration error:', error);
      throw error;
    });

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(async (response) => {
      // Sprawdź czy użytkownik istnieje w kolekcji users, jeśli nie - utwórz dokument
      const userDocRef = doc(this.firestore, 'users', response.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Jeśli użytkownik nie istnieje w kolekcji users, utwórz dokument
        await setDoc(userDocRef, {
          userId: response.user.uid,
          username: response.user.displayName || '',
          email: response.user.email || email
        });
      }
    });
    
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
        username: user.displayName ?? ''
      };
    })
  );
}

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }
}