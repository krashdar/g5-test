import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { AuthComponent } from './pages/auth/auth.component';
import { BlocksComponent } from './pages/blocks/blocks.component';
import { TableComponent } from './pages/table/table.component';
import { DetailComponent } from './pages/detail/detail.component';

const redirectUnauthorized = () => redirectUnauthorizedTo(['auth']);

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'blocks', component: BlocksComponent, ...canActivate(redirectUnauthorized) },
  { path: 'table', component: TableComponent, ...canActivate(redirectUnauthorized) },
  { path: 'detail/:username', component: DetailComponent, ...canActivate(redirectUnauthorized) },
  { path: '**', redirectTo: 'blocks' }
];
