import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutusComponent } from '@app/shared/aboutus.component';
import { SettingsComponent } from '@app/shared/settings/settings.component';
import { LoginComponent } from '@app/shared/login/login.component';
import { SignupComponent } from '@app/shared/login/signup.component';
import { AuthGuardService } from '@app/services/auth-guard.service';
import { NavAuthGuardService } from '@app/services/nav-auth-guard.service';
import { StudentComponent } from '@app/manage/student.component';
import { StudentViewComponent } from '@app/manage/student-view.component';
import { FeeComponent } from '@app/manage/fee.component';
import { FeeViewComponent } from '@app/manage/fee-view.component';

import { AttendanceComponent } from '@app/manage/attendance.component';
import { StudentAttendanceComponent } from '@app/manage/student-attendance.component';
import { EmployeeAttendanceComponent } from '@app/manage/employee-attendance.component';

import { MarksComponent } from '@app/manage/marks.component';
import { MarksViewComponent } from '@app/manage/marks-view.component';
import { FeecodeComponent } from '@app/setup/feecode.component';
import { MarkscodeComponent } from '@app/setup/markscode.component';
import { AttendancecodeComponent} from '@app/setup/attendancecode.component';
import { EnrollmentComponent } from '@app/setup/enrollment.component';
import { EmployeeComponent } from '@app/staff/employee.component';
import { VoucherComponent } from '@app/staff/voucher.component';
import { ExpensesComponent } from '@app/staff/expenses.component';
import { SalaryComponent } from '@app/staff/salary.component';
import { SalaryCodeComponent } from '@app/staff/salarycode.component';
import { AssignmentsComponent } from '@app/online/assignments.component';
import { AssignmentsViewComponent } from '@app/online/assignments-view.component';
import { HomeworkComponent } from '@app/online/homework.component';
import { HomeworkViewComponent } from '@app/online/homework-view.component';
import { TutorialsComponent } from '@app/online/tutorials.component';
import { TutorialsViewComponent } from '@app/online/tutorials-view.component';
import { ClassesComponent } from '@app/manage/classes.component';

import { SubjectsComponent } from '@app/setup/subjects/subjects.component';

import { ClassesViewComponent } from '@app/online/classes-view.component';
import { NotificationsComponent } from '@app/shared/settings/notifications.component';
import { PeriodsComponent } from '@app/manage/periods.component';

const routes: Routes = [
  { path: '', redirectTo: '/aboutus', pathMatch: 'full' },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'student', component: StudentComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'student-view', component: StudentViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'enrollment', component: EnrollmentComponent, canActivate: [AuthGuardService, NavAuthGuardService] },

  { path: 'feecode', component: FeecodeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'attendancecode', component: AttendancecodeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },

  { path: 'fee', component: FeeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'fee-view', component: FeeViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'fee/:id', component: FeeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },

  { path: 'attendance', component: AttendanceComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'student-attendance', component: StudentAttendanceComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'employee-attendance', component: EmployeeAttendanceComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'periods', component: PeriodsComponent, canActivate: [AuthGuardService, NavAuthGuardService] },

  { path: 'attendance/:id', component: AttendanceComponent, canActivate: [AuthGuardService, NavAuthGuardService] },

  { path: 'marks', component: MarksComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'marks-view', component: MarksViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'marks/:id', component: MarksComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'markscode', component: MarkscodeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'voucher', component: VoucherComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'assignments', component: AssignmentsComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'assignments-view', component: AssignmentsViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'homework', component: HomeworkComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'homework-view', component: HomeworkViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'tutorials', component: TutorialsComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'tutorials-view', component: TutorialsViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'classes', component: ClassesComponent, canActivate: [AuthGuardService, NavAuthGuardService] },

  { path: 'subjects', component: SubjectsComponent, canActivate: [AuthGuardService, NavAuthGuardService] },

  { path: 'classes-view', component: ClassesViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'salarycode', component: SalaryCodeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'salary/:id', component: SalaryComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/aboutus', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
