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
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AttendanceService } from '../services/attendance.service';
import { ClassesService } from '../services/classes.service';
import { PeriodsService} from '../services/periods.service';
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
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  displayedColumns: Array<any> = ['code', 'period1', 'period2', 'period3', 'period4', 'period5', 'period6', 'period7'];
  editable = false;
  availableTeachers$;

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
           this.availableTeachers$ = res;
       });
   }

  assignTeacher(event, docId, field) {
    this.dataLoading = true;
    const data = {};
    data[field] = event.value;
    this.querySubscriptionSpecific = this.periodService.assignTeacher(this.enrollId._id, docId, data).then((res: any) => {
      console.log(res);
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
  const dateStr = (this.specificDay.value.getMonth() + 1)
  + '_' + this.specificDay.value.getDate() + '_' + this.specificDay.value.getFullYear();
  this.dates$ = [];
  for (const obj of this.data$) {
    this.dates$.push({code: obj.code, days: obj.days[dateStr]});
  }
  console.log(this.dates$);
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
