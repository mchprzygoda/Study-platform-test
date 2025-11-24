import { Component } from '@angular/core';
import { StudyPlatform } from '../../features/study-platform/study-platform.component';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [HeaderComponent, StudyPlatform, FooterComponent],
  templateUrl: './main.page.html',
})
export class MainPage {}


