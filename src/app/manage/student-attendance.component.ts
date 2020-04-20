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
import { moveIn, fallIn } from '@app/shared/router.animation';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AttendanceService } from '@app/services/attendance.service';


@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css'],
  animations: [moveIn(), fallIn()],
})
export class StudentAttendanceComponent implements OnInit, OnDestroy, AfterViewInit {
  members: any[];
  dataSource: MatTableDataSource<any>;
  myDocData;
  data$;
  toggleEditableField: string;
  error = false;
  errorMessage = '';
  dataLoading = false;
  private querySubscriptionSpecific;
  private querySubscription;
  private querySubscriptionList;
  enrollId: string;
  enrollmentCDs$;
  days: Array<any> = [];
  todayDate;
  attendanceStatus = ['P', 'A', 'L', 'LA', 'H'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: Array<any> = ['code', 'lName', 'fName', 'class'];
  editable = false;

  constructor(
    private attendanceService: AttendanceService,
    private ref: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.error = false;
    this.errorMessage = '';
    this.dataSource = new MatTableDataSource(this.members);
    this.getActiveEnrollmentId();
    this.todayDate = new Date().toLocaleString();
    this.todayDate = this.todayDate.split(',')[0].toString();
    this.todayDate = this.todayDate.replace (/\//g, '_');
  }

  submitAttendance(event, docId, field) {
    this.dataLoading = true;
    const data = {};
    data[field] = event.value;
    this.querySubscriptionSpecific = this.attendanceService.updateSpecificDayAttendance( this.enrollId, docId, data).then((res: any) => {
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
  showTodayAttend() {
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
    this.querySubscription = this.attendanceService.getActiveEnrollmentId().subscribe((res: any) => {
        this.enrollId = res[0]._id;
        this.getData(this.enrollId);
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

  getData(enrollId: string, formData?) {
    this.dataLoading = true;
    this.querySubscriptionList = this.attendanceService.getAttendanceList(enrollId).subscribe((res: any) => {

      let dates =  Object.keys(res[0].days);
      dates = dates.filter((ele: any) => ele !== '_id');

      dates.sort((a, b) => {
        a = a.replace (/\_/g, '/');
        b = b.replace (/\_/g, '/');
        const dateA = new Date(a).getTime();
        const dateB = new Date(b).getTime();
        return dateA > dateB ? 1 : -1;
      });

      this.displayedColumns = [];
      this.displayedColumns = ['code', 'lName', 'fName', 'class'];
      this.days = [];
      for (const date of dates) {
        this.displayedColumns.push(date);
        this.days.push({label: date, show: true});
      }

      this.dataSource = new MatTableDataSource(res);
      this.showLastSevenDaysAttend();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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