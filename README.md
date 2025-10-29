# StudyPlatform

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.19.

## 🚀 Deployment na GitHub Pages

### Automatyczne wdrożenie (ZALECANE) - GitHub Actions

Projekt jest skonfigurowany z automatycznym workflow GitHub Actions, który wdraża aplikację przy każdym pushu do brancha `main` lub `master`.

#### Krok 1: Przygotowanie repozytorium

1. **Upewnij się, że nazwa repozytorium na GitHubie jest zgodna z `baseHref` w `angular.json`**
   - Obecnie `baseHref` jest ustawiony na `/Study-platform-test/`
   - Nazwa repozytorium powinna być: `Study-platform-test`
   - **LUB** zmień `baseHref` w `angular.json` na nazwę Twojego repozytorium (np. `/Study-platform/`)

2. **Jeśli zmieniasz nazwę repozytorium**, zaktualizuj `baseHref`:
   ```json
   // w angular.json, linia 54
   "baseHref": "/TwojaNazwaRepozytorium/"
   ```

#### Krok 2: Włącz GitHub Pages

1. Przejdź do **Settings** w Twoim repozytorium GitHub
2. W menu bocznym wybierz **Pages**
3. W sekcji **Source** wybierz:
   - **Source**: `GitHub Actions`
   - **Branch**: (zostanie automatycznie wykryte)
4. Kliknij **Save**

#### Krok 3: Wypchnij kod

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

#### Krok 4: Sprawdź status deployu

1. Przejdź do zakładki **Actions** w Twoim repozytorium
2. Zobacz workflow "Deploy to GitHub Pages"
3. Po udanym deployu aplikacja będzie dostępna pod adresem:
   ```
   https://TwojaNazwaUzytkownika.github.io/Study-platform-test/
   ```

---

### Alternatywa: Ręczne wdrożenie (opcjonalne)

Jeśli chcesz wdrożyć ręcznie:

1. **Zainstaluj `angular-cli-ghpages`**:
   ```bash
   npm install --save-dev angular-cli-ghpages
   ```

2. **Uruchom deploy**:
   ```bash
   npm run deploy
   ```

   Ten skrypt zbuduje aplikację i automatycznie wypchnie ją do brancha `gh-pages`.

---

## 🛠️ Development

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

---

## 📝 Uwagi

- **404.html**: Projekt automatycznie tworzy plik `404.html` podczas buildu (via `postbuild.js`), co jest wymagane dla poprawnych przekierowań w GitHub Pages z Angular Router
- **Base Href**: Upewnij się, że `baseHref` w `angular.json` odpowiada nazwie Twojego repozytorium na GitHubie
- **GitHub Pages Source**: Musisz użyć **GitHub Actions** jako źródła w ustawieniach Pages, nie brancha `gh-pages`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
