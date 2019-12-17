import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { ElishCustomMaterialModule } from '@app/shared/custom.material';
import { FooterComponent } from '@app/shared/footer.component';
import { HelpdeskComponent } from '@app/shared/helpdesk.component';
import { LoginComponent } from '@app/shared/login/login.component';
import { SignupComponent } from '@app/shared/login/signup.component';
import { SettingsComponent } from '@app/shared/settings/settings.component';
import { AboutusComponent } from '@app/shared/aboutus.component';
import { FeecodeComponent } from '@app/setup/feecode.component';
import { MarkscodeComponent } from '@app/setup/markscode.component';
import { EnrollmentComponent } from '@app/setup/enrollment.component';
import { AttendancecodeComponent } from '@app/setup/attendancecode.component';
import { StudentComponent } from '@app/manage/student.component';
import { FeeComponent } from '@app/manage/fee.component';
import { MarksComponent } from '@app/manage/marks.component';

// Angular Firebase settings
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AttendanceComponent } from '@app/manage/attendance.component';
import { HeaderAdminComponent } from '@app/shared/header.admin.component';
import { EmployeeComponent } from '@app/staff/employee.component';
import { EmployeeAttendanceComponent} from '@app/manage/employee-attendance.component';
import { SalaryCodeComponent } from '@app/staff/salarycode.component';
import { VoucherComponent } from '@app/staff/voucher.component';
import { ExpensesComponent } from '@app/staff/expenses.component';
import { SalaryComponent } from '@app/staff/salary.component';
import { HomeworkComponent } from '@app/online/homework.component';
import { TutorialsComponent } from '@app/online/tutorials.component';
import { ClassesComponent } from '@app/manage/classes.component';
import { AssignmentsComponent } from '@app/online/assignments.component';

// file upload
import { FileUploadComponent } from '@app/shared/dropzone/fileupload.component';
import { DropZoneDirective } from '@app/shared/dropzone/dropzone.directive';
import { FileSizePipe } from '@app/shared/dropzone/filesize.pipe';
import { AssignmentsViewComponent } from '@app/online/assignments-view.component';
import { ClassesViewComponent } from '@app/online/classes-view.component';
import { HomeworkViewComponent } from '@app/online/homework-view.component';
import { TutorialsViewComponent } from '@app/online/tutorials-view.component';
import { StudentViewComponent } from '@app/manage/student-view.component';
import { FeeViewComponent } from '@app/manage/fee-view.component';
import { StudentAttendanceComponent } from '@app/manage/student-attendance.component';
import { MarksViewComponent } from '@app/manage/marks-view.component';
import { NotificationsComponent } from '@app/shared/settings/notifications.component';
import { SidenavListComponent } from '@app/shared/sidenav-list/sidenav-list.component';
import { ReplacePipe } from '@app/pipes/replace.pipe';
import { FeeUpdateDialogComponent } from '@app/manage/fee-update-dialog/fee-update-dialog.component';

import { EditableComponent } from '@app/editable/editable.component';
import { ViewModeDirective } from '@app/editable/view-mode.directive';
import { EditModeDirective } from '@app/editable/edit-mode.directive';
import { EditableOnEnterDirective } from '@app/editable/edit-on-enter.directive';
import { EditableDirective } from '@app/directives/editable.directive';
import { SubjectsComponent } from '@app/setup/subjects/subjects.component';
import { PeriodsComponent } from '@app/manage/periods.component';


// import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

@NgModule({
  declarations: [
    AppComponent,
    ReplacePipe,
    FooterComponent,
    HelpdeskComponent,
    LoginComponent,
    SignupComponent,
    SettingsComponent,
    AboutusComponent,
    FeecodeComponent,
    StudentAttendanceComponent,
    EmployeeAttendanceComponent,
    MarkscodeComponent,
    StudentComponent,
    EnrollmentComponent,
    FeeComponent,
    MarksComponent,
    AttendanceComponent,
    HeaderAdminComponent,
    EmployeeComponent,
    SalaryCodeComponent,
    VoucherComponent,
    ExpensesComponent,
    SalaryComponent,
    HomeworkComponent,
    TutorialsComponent,
    ClassesComponent,
    AssignmentsComponent,
    FileUploadComponent,
    DropZoneDirective,
    FileSizePipe,
    AssignmentsViewComponent,
    ClassesViewComponent,
    HomeworkViewComponent,
    TutorialsViewComponent,
    StudentViewComponent,
    FeeViewComponent,
    MarksViewComponent,
    NotificationsComponent,
    AttendancecodeComponent,
    SidenavListComponent,
    FeeUpdateDialogComponent,
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
    EditableOnEnterDirective,
    EditableDirective,
    SubjectsComponent,
    PeriodsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ElishCustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'SMS-APP'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  entryComponents: [FeeUpdateDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);
