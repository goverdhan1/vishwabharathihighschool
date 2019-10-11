import { Component, OnInit } from '@angular/core';
import { moveIn, fallIn } from '../../shared/router.animation';
import { BackendService } from '../../services/backend.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class NotificationsComponent implements OnInit {
  data;
  data$;
  querySubscription;
  toggle = false;
  state = '';
  savedChanges = false;
  error = false;
  errorMessage = '';
  dataLoading = false;
  classCDs$;
  ENROLLMENT_CODE;

  constructor(private _backendService: BackendService, private studentService: StudentService ) { }

  ngOnInit() {
    this.getDoc();
  }

  getActiveEnrollmentId() {
    this.dataLoading = true;
    this.querySubscription = this.studentService.getActiveEnrollmentId().subscribe((res: any) => {
        this.ENROLLMENT_CODE = res[0];
        this.getData(this.ENROLLMENT_CODE._id);
    },
    (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
    },
    () => {
        this.dataLoading = false;
    });
  }

getClassCDs() {
  this.dataLoading = true;
  this.querySubscription = this._backendService.getDocs('CLASSES').subscribe((res) => {
      this.classCDs$ = res;
  },
      (error) => {
          this.error = true;
          this.errorMessage = error.message;
          this.dataLoading = false;
      },
      () => {
          this.dataLoading = false;
      });
  }

  getData(enrollId, formData?) {
    this.dataLoading = true;
    this.querySubscription = this.studentService.getStudentsList(enrollId, formData).subscribe((res) => {

    },
        (error) => {
            this.error = true;
            this.errorMessage = error.message;
            this.dataLoading = false;
        },
        () => {
            this.dataLoading = false;
        });
}

  getDoc() {
    this.dataLoading = true;
    this.data$ = this._backendService.getUserStudentMSGDoc();
    this.dataLoading = false;
  }
  updateReceipt(messageId){
    //console.log(messageId);
  }
}