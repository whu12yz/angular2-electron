
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { HeroFormComponent } from  './hero-form/hero-form.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'hero', component: HeroFormComponent}
];

export const routing = RouterModule.forRoot(routes);
