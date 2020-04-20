import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ElementRef,
  HostListener,
  HostBinding
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AttendanceService } from '@app/services/attendance.service';
import { ClassesService } from '@app/services/classes.service';
import { PeriodsService} from '@app/services/periods.service';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-periods',
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.css']
})
export class PeriodsComponent implements OnInit, AfterViewInit, OnDestroy {

  specificDay = new FormControl(new Date());
  members: any[];
  dataSource: MatTableDataSource<any>;
  myDocData;
  data$: Array<any> = [];
  dates$;
  toggleEditableField: string;
  error = false;
  errorMessage = '';
  dataLoading = false;
  private querySubscriptionSpecific;
  private querySubscription;
  private querySubscriptionList;
  enrollId: any;
  enrollmentCDs$;
  days: Array<any> = [];
  todayDate;
  attendanceStatus = ['P', 'A', 'L', 'LA', 'H'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: Array<any> = ['code', 'period1', 'period2', 'period3', 'period4', 'period5', 'period6', 'period7'];
  editable = false;
  period1AvailableTeachers$;
  period2AvailableTeachers$;
  period3AvailableTeachers$;
  period4AvailableTeachers$;
  period5AvailableTeachers$;
  period6AvailableTeachers$;
  period7AvailableTeachers$;
  dateStr;

  constructor(
    private periodService: PeriodsService,
    private classService: ClassesService,
    private ref: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.error = false;
    this.errorMessage = '';
    this.dataSource = new MatTableDataSource(this.members);
    this.getActiveEnrollmentId();
  }

  getClassTeachers() {
    this.querySubscription = this.classService.getTeachers(this.enrollId._id).subscribe(res => {
           this.period1AvailableTeachers$ = res;
           this.period2AvailableTeachers$ = res;
           this.period3AvailableTeachers$ = res;
           this.period4AvailableTeachers$ = res;
           this.period5AvailableTeachers$ = res;
           this.period6AvailableTeachers$ = res;
           this.period7AvailableTeachers$ = res;
       });
   }

   allocateTeachers() {

   }

  assignTeacher(event, docId, path) {
    this.dataLoading = true;
    const data: any = {};
    const subData: any = {};
    const subSubData: any = {teacher: event.value};
    subData[path] = subSubData;
    data[this.dateStr] = subData;
    console.log(data);

    const strField = this.dateStr + '.' + path + '.teacher';

    if (event.value !== 'null' && this.data$[this.dateStr].period1 !== 'null' ) {
      this.period1AvailableTeachers$.push(this.data$[this.dateStr].period1);
    }

    if (event.value !== 'null' && this.data$[this.dateStr].period2 !== 'null' ) {
      this.period2AvailableTeachers$.push(this.data$[this.dateStr].period2);
    }

    if (event.value !== 'null' && this.data$[this.dateStr].period3 !== 'null' ) {
      this.period3AvailableTeachers$.push(this.data$[this.dateStr].period3);
    }

    if (event.value !== 'null' && this.data$[this.dateStr].period4 !== 'null' ) {
      this.period4AvailableTeachers$.push(this.data$[this.dateStr].period4);
    }

    if (event.value !== 'null' && this.data$[this.dateStr].period5 !== 'null' ) {
      this.period5AvailableTeachers$.push(this.data$[this.dateStr].period5);
    }

    if (event.value !== 'null' && this.data$[this.dateStr].period5 !== 'null' ) {
      this.period6AvailableTeachers$.push(this.data$[this.dateStr].period6);
    }

    if (event.value !== 'null' && this.data$[this.dateStr].period7 !== 'null' ) {
      this.period7AvailableTeachers$.push(this.data$[this.dateStr].period7);
    }


    console.log(strField);
    this.querySubscriptionSpecific = this.periodService.assignTeacher(this.enrollId._id, docId, strField, event.value)
    .then((res: any) => {
      if (event.value !== null) {
        if (path === 'period1') {
          this.period1AvailableTeachers$ = this.period1AvailableTeachers$.filter(obj => obj._id !== event.value._id);
        }
        if (path === 'period1') {
          this.period2AvailableTeachers$ = this.period2AvailableTeachers$.filter(obj => obj._id !== event.value._id);
        }
        if (path === 'period1') {
          this.period3AvailableTeachers$ = this.period3AvailableTeachers$.filter(obj => obj._id !== event.value._id);
        }
        if (path === 'period1') {
          this.period4AvailableTeachers$ = this.period4AvailableTeachers$.filter(obj => obj._id !== event.value._id);
        }
        if (path === 'period1') {
          this.period5AvailableTeachers$ = this.period5AvailableTeachers$.filter(obj => obj._id !== event.value._id);
        }
        if (path === 'period1') {
          this.period6AvailableTeachers$ = this.period6AvailableTeachers$.filter(obj => obj._id !== event.value._id);
        }
        if (path === 'period1') {
          this.period7AvailableTeachers$ = this.period7AvailableTeachers$.filter(obj => obj._id !== event.value._id);
        }
      }
        }).catch(err => {
          if (err) {
              this.error = true;
              this.errorMessage = err.message;
              this.dataLoading = false;
          }
        });
  }
  customTrackBy(i) { return i; }
  showTodayPeriods() {
    for (const day of this.days) {
      if ( day.label === this.todayDate) {
        day.show = true;
      } else {
        day.show = false;
      }
    }
//    this.ref.markForCheck();
  }

  sendAttendSMS() {

  }

  showLastSevenDaysAttend() {
    let index = null;
    for ( let i = 0; i < this.days.length; i++ ) {
      this.days[i].show = false;
      if ( this.days[i].label === this.todayDate) {
        index = i + 1;
      }
    }

    for ( let i = index - 7; i < index; i++ ) {
        this.days[i].show = true;
    }
//    this.ref.markForCheck();
  }

  showAllAttend() {
    for ( const day of this.days) {
        day.show = true;
      }
    //  this.ref.markForCheck();
  }

  toggleEditable(e, filter?) {
    console.log(e, filter);
    if (!filter) {
      filter = 'editMode';
    } else {
      filter = filter;
    }
    this.toggleEditableField = filter;
  }

  getActiveEnrollmentId() {
    this.dataLoading = true;
    this.querySubscription = this.classService.getActiveEnrollmentId().subscribe((res: any) => {
      this.enrollId = res[0];
      this.getClassTeachers();
      this.getData(this.enrollId._id);
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

dateChanged() {
  this.displayPeriods();
}

displayPeriods() {
  this.dateStr = (this.specificDay.value.getMonth() + 1)
  + '_' + this.specificDay.value.getDate() + '_' + this.specificDay.value.getFullYear();
  this.dates$ = [];
  for (const obj of this.data$) {
    this.dates$.push({code: obj.code, _id: obj._id, days: obj.days[this.dateStr]});
    if (obj.days[this.dateStr] !== 'H') {
      this.period1AvailableTeachers$ = this.period1AvailableTeachers$.filter(ob => ob._id !== obj.days[this.dateStr].period1.teacher._id);
      this.period2AvailableTeachers$ = this.period2AvailableTeachers$.filter(ob => ob._id !== obj.days[this.dateStr].period2.teacher._id);
      this.period3AvailableTeachers$ = this.period3AvailableTeachers$.filter(ob => ob._id !== obj.days[this.dateStr].period3.teacher._id);
      this.period4AvailableTeachers$ = this.period4AvailableTeachers$.filter(ob => ob._id !== obj.days[this.dateStr].period4.teacher._id);
      this.period5AvailableTeachers$ = this.period5AvailableTeachers$.filter(ob => ob._id !== obj.days[this.dateStr].period5.teacher._id);
      this.period6AvailableTeachers$ = this.period6AvailableTeachers$.filter(ob => ob._id !== obj.days[this.dateStr].period6.teacher._id);
      this.period7AvailableTeachers$ = this.period7AvailableTeachers$.filter(ob => ob._id !== obj.days[this.dateStr].period7.teacher._id);
    }
  }



  this.dataSource = new MatTableDataSource(this.dates$);
}

  getData(enrollId: string, formData?) {
    this.dataLoading = true;
    this.querySubscriptionList = this.classService.getClassesList(enrollId).subscribe((res: any) => {
      this.data$ = res;
      this.displayPeriods();
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


  // mat table paginator and filter functions
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnDestroy() {
    // this is not needed when observable is used, in this case, we are registering user on subscription
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.querySubscriptionList) {
      this.querySubscriptionList.unsubscribe();
    }
    if (this.querySubscriptionSpecific) {
      this.querySubscriptionSpecific.unsubscribe();
    }
  }


}
