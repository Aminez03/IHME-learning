import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Modules Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';

// FlexLayout pour la mise en page


// Routing
import { AppRoutingModule } from './app-routing.module';

// Composants
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SessionComponent } from './session/session.component';
import { FormationComponent } from './formation/formation.component';
import { ModalFormationComponent } from './modal-formation/modal-formation.component';
import { DetailFormationComponent } from './detail-formation/detail-formation.component';
import { CourComponent } from './cour/cour.component';

import { ModalCourComponent } from './modal-cour/modal-cour.component';
import { ConfirmdialogComponent } from './confirmdialog/confirmdialog.component';
import { DetailCourComponent } from './detail-cour/detail-cour.component';
// Removed duplicate import of MatProgressSpinnerModule
import { FeedbackComponent } from './feedback/feedback.component';
import { ContactComponent } from './contact/contact.component';

import { RegisterComponent } from './authentification/register/register.component';
import { MatSelectModule } from '@angular/material/select';
import { LoginComponent } from './authentification/login/login.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


// Import du module FilePond
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import * as FilePondPluginImagePreview from 'filepond-plugin-image-preview';


import { UploadImageComponent } from './upload-image/upload-image.component';

import { DetailSessionComponent } from './detail-session/detail-session.component';
import { ModalSessionComponent } from './modal-session/modal-session.component';
import { ProfilComponent } from './profil/profil.component';
import { EditProfileDialogComponentComponent } from './edit-profile-dialog-component/edit-profile-dialog-component.component';
import { ExamenComponent } from './examen/examen.component';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';

// Enregistrer le plugin FilePond (obligatoire pour la gestion des images)
registerPlugin(FilePondPluginImagePreview);
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CertificatComponent } from './certificat/certificat.component';
import { CertifSessionComponent } from './certif-session/certif-session.component';
import { UsersComponent } from './users/users.component';
import { AdminComponent } from './admin/admin.component';
import { CondidatComponent } from './condidat/condidat.component';

import { FormateurComponent } from './formateur/formateur.component';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategorieComponent } from './categorie/categorie.component';
import { ModalCategorieComponent } from './modal-categorie/modal-categorie.component';
import { FormationParSousCategorieComponent } from './components/formation-par-sous-categorie/formation-par-sous-categorie.component';
import { QuestionDialogComponent } from './question-dialog/question-dialog.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { ReponsedialogComponent } from './reponsedialog/reponsedialog.component';
import { ReponselistComponent } from './reponselist/reponselist.component';
import { ExamencrudComponent } from './examencrud/examencrud.component';
import { ExamencrudDialogComponent } from './examencrud-dialog/examencrud-dialog.component';
import { UserDetailDialogComponent } from './user-detail-dialog/user-detail-dialog.component';





@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    SessionComponent,
    FormationComponent,
    ModalFormationComponent,
    DetailFormationComponent,
    CourComponent,
    ModalCourComponent,
         ConfirmdialogComponent,
         DetailCourComponent,
         FeedbackComponent,
         ContactComponent,
        LoginComponent,
         RegisterComponent,
         UploadImageComponent,
       
         DetailSessionComponent,
                  ModalSessionComponent,
                  ProfilComponent,
                  EditProfileDialogComponentComponent,
                  ExamenComponent,
                  CertificatComponent,
                  CertifSessionComponent,
                  UsersComponent,
                  AdminComponent,
                  CondidatComponent,
                  FormateurComponent,
                  DashboardComponent,
                  CategorieComponent,
                  ModalCategorieComponent,
                  FormationParSousCategorieComponent,
                  QuestionDialogComponent,
                  QuestionListComponent,
                  ReponsedialogComponent,
                  ReponselistComponent,
                  ExamencrudComponent,
                  ExamencrudDialogComponent,
                  UserDetailDialogComponent,
               
  ],
  imports: [
    NgCircleProgressModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,

    
    // Angular Material Modules
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatProgressSpinnerModule, 
    MatSelectModule,
    MatSnackBarModule,
    FilePondModule,
    
    MatPaginatorModule ,// Ajoute MatPaginatorModule
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ajoute CUSTOM_ELEMENTS_SCHEMA
})
export class AppModule { }
