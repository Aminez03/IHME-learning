import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SessionComponent } from './session/session.component';
import { FormationComponent } from './formation/formation.component';
import { ModalFormationComponent } from './modal-formation/modal-formation.component';
import { DetailFormationComponent } from './detail-formation/detail-formation.component';
import { CourComponent } from './cour/cour.component';
import { DetailCourComponent } from './detail-cour/detail-cour.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { LogoutComponent } from './authentification/logout/logout.component';
import { DetailSessionComponent } from './detail-session/detail-session.component';
import { ProfilComponent } from './profil/profil.component';
import { ExamenComponent } from './examen/examen.component';
import { CertifSessionComponent } from './certif-session/certif-session.component';
import { UsersComponent } from './users/users.component';
import { AdminComponent } from './admin/admin.component';
import { FormateurComponent } from './formateur/formateur.component';
import { CondidatComponent } from './condidat/condidat.component';
import { AuthGuard } from './authentification/auth.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategorieComponent } from './categorie/categorie.component';
import { FormationParSousCategorieComponent } from './components/formation-par-sous-categorie/formation-par-sous-categorie.component';
import { CertificatComponent } from './certificat/certificat.component';
import { ExamencrudComponent } from './examencrud/examencrud.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { ReponselistComponent } from './reponselist/reponselist.component';
import { adminGuard } from './guards/admin.guard';
import { formateurGuard } from './guards/formateur.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Routes publiques (accessibles sans login)

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },

  // Routes privées (protégées par AuthGuard)
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'sidebar', component: SidebarComponent, canActivate: [AuthGuard] },
  { path: 'navbar', component: NavbarComponent, canActivate: [AuthGuard] },
  { path: 'footer', component: FooterComponent, canActivate: [AuthGuard] },

  { path: 'sessions', component: SessionComponent, canActivate: [AuthGuard] },
  { path: 'formations', component: FormationComponent, canActivate: [AuthGuard] },
  { path: 'modal-formation', component: ModalFormationComponent, canActivate: [AuthGuard,adminGuard] },
  { path: 'detail-formation/:id', component: DetailFormationComponent, canActivate: [AuthGuard] },

  { path: 'cours', component: CourComponent, canActivate: [AuthGuard] },
  { path: 'detail-cour/:id', component: DetailCourComponent, canActivate: [AuthGuard] },

  { path: 'session/:id', component: DetailSessionComponent, canActivate: [AuthGuard] },
  { path: 'examan/:id', component: ExamenComponent, canActivate: [AuthGuard] },
  { path: 'certif-session/:id', component: CertifSessionComponent, canActivate: [AuthGuard] },
  { path: 'certificat/:id', component: CertificatComponent },

  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },

  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard,adminGuard]  },
  { path: 'condidat', component: CondidatComponent, canActivate: [AuthGuard,adminGuard] },
  { path: 'formateur', component: FormateurComponent, canActivate: [AuthGuard,adminGuard]},

  { path: 'categorie', component: CategorieComponent, canActivate: [AuthGuard,adminGuard]  },
  { path: 'sous-categorie/:id', component: FormationParSousCategorieComponent ,canActivate: [AuthGuard,adminGuard]},

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },



  { path: 'examencrud', component: ExamencrudComponent, canActivate: [AuthGuard,formateurGuard] },
  { path: 'examencrud/:id/questions', component: QuestionListComponent, canActivate: [AuthGuard,formateurGuard] },
  { path: 'reponses/:id', component: ReponselistComponent, canActivate: [AuthGuard,formateurGuard] },
  // Redirection si aucune route ne correspond
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
