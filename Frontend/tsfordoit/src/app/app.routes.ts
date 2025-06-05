import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Home } from './pages/home/home';
import { Searchpartners } from './pages/searchpartners/searchpartners';


export const routes: Routes = [
  {path: '', component: Home},
  {path: 'login', component: Login},
  {path: 'sign-up', component: Signup},
  {path: 'search-partners', component: Searchpartners},
];
