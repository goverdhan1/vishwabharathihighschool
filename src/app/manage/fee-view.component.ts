import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { moveIn, fallIn } from '../shared/router.animation';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { FeeUpdateDialogComponent } from './fee-update-dialog/fee-update-dialog.component';
import { FeeService } from '../services/fee.service';

@Component({
  selector: 'app-fee-view',
  templateUrl: './fee-view.component.html',
  styleUrls: ['./fee-view.component.css'],
  animations: [moveIn(), fallIn()]
})
export class FeeViewComponent implements OnInit, AfterViewInit, OnDestroy {

  members: any[];
  dataSource: MatTableDataSource<any>;
  myDocData;
  data$;
  error = false;
  errorMessage = '';
  dataLoading = false;
  private querySubscription;
  currentMonth;
  enrollId;
  months;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  displayedColumns: Array<any> = ['code', 'lName', 'fName', 'class'];
  monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  feeStatus = ['Paid', 'Due', 'Partial Paid'];

  constructor(private feeService: FeeService, public dialog: MatDialog) { }

  ngOnInit() {
    this.error = false;
    this.errorMessage = '';
    this.dataSource = new MatTableDataSource(this.members);
    this.getActiveEnrollmentId();
    this.currentMonth = new Date();
    this.currentMonth = this.monthName[this.currentMonth.getMonth()] + '_' + this.currentMonth.getFullYear();
    }

  updateFeeDetails(e, id: string, month: string, amt: number, status: string ) {
    const enrollId: string = this.enrollId;
    const dialogRef = this.dialog.open(FeeUpdateDialogComponent, {
      width: '600px',
      data: {enrollId, id, month, amt, status}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  getActiveEnrollmentId() {
    this.dataLoading = true;
    this.querySubscription = this.feeService.getActiveEnrollmentId().subscribe((res: any) => {
        console.log(res);
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
    console.log(enrollId);
    this.dataLoading = true;
    this.querySubscription = this.feeService.getFeeList(enrollId).subscribe((res: any) => {
      console.log(res);
      let months = Object.keys(res[0].months);
      months = months.filter((ele: any) => ele !== '_id');

      months.sort((a, b) => {
        a = a.replace (/\_/g, '/');
        b = b.replace (/\_/g, '/');
        const dateA = new Date(a).getTime();
        const dateB = new Date(b).getTime();
        return dateA > dateB ? 1 : -1;
      });

      this.displayedColumns = [];
      this.displayedColumns = ['code', 'lName', 'fName', 'class']

      const datesArray = [];
      for (const date of months) {
          datesArray.push({label: date, show: true});
          this.displayedColumns.push(date);
      }
      this.months = datesArray;
      console.log(this.months);
      this.dataSource = new MatTableDataSource(res);
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
  }
}
