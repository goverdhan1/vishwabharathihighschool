import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { moveIn, fallIn } from '@app/shared/router.animation';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BackendService } from '@app/services/backend.service';

@Component({
    selector: 'app-enrollment',
    templateUrl: './enrollment.component.html',
    animations: [moveIn(), fallIn()],
    host: { '[@moveIn]': '' }
})

export class EnrollmentComponent implements OnInit, AfterViewInit, OnDestroy {

    members: any[];
    dataSource: MatTableDataSource<any>;
    data$;
    data1$;
    toggleField: string;
    state = '';
    savedChanges = false;
    error = false;
    errorMessage = '';
    dataLoading = false;
    private querySubscription;
    startDate;
    endDate;
    currentYear;
    orderByArr = [];
    orderBy;
    orderByMax;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns = ['orderBy', 'code', 'descr', 'status', '_id'];

    constructor(private backendService: BackendService) { }

    ngOnInit() {
        this.toggleField = 'showResMode';
        this.getData();
        this.dataSource = new MatTableDataSource(this.members);
    }

    toggle(filter?) {
        if (!filter) {
            filter = 'resMode';
        } else {
            filter = filter;
        }
        this.toggleField = filter;
        this.dataLoading = false;
    }

    getData(formData?) {
        this.dataLoading = true;
        this.orderByArr = [];
        this.querySubscription = this.backendService.getDocs('ENROLL_CD', formData).subscribe((res: any) => {
            res.sort((a, b) => a.orderBy - b.orderBy);
            for (const ordBy of res) {
                this.orderByArr.push(ordBy.orderBy);
            }
            console.log(this.orderBy);
            if (this.orderByArr.indexOf(0) !== -1) {
                this.currentYear = true;
            }
            this.orderByMax = Math.max( ...this.orderByArr );
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

    setOrderBy(e) {
     console.log(e.value);
     if (e.value === 'present') {
        this.orderBy = 0;
     }
     if (e.value === 'past') {
        this.orderBy = Math.min( ...this.orderByArr ) + (-1);
     }
     if (e.value === 'future') {
        this.orderBy = Math.max( ...this.orderByArr ) + 1;
     }
    }

    setData(formData) {
        this.dataLoading = true;
        this.querySubscription = this.backendService.setDoc('ENROLL_CD', formData).then(res => {
            if (res) {
                this.savedChanges = true;

                this.getData();
                this.toggleField = 'showResMode';
                this.error = false;
                this.errorMessage = '';
                this.dataLoading = false;
            }
        }).catch(err => {
            if (err) {
                this.error = true;
                this.errorMessage = err.message;
                this.dataLoading = false;
            }
        });
    }

    updateData(formData) {
        this.dataLoading = true;
        this.querySubscription = this.backendService.updateDoc('ENROLL_CD', formData._id, formData).then(res => {
            if (res) {
                this.savedChanges = true;
                this.getData();
                this.toggleField = 'showResMode';
                this.error = false;
                this.errorMessage = '';
                this.dataLoading = false;
            }
        }).catch(err => {
            if (err) {
                this.error = true;
                this.errorMessage = err.message;
                this.dataLoading = false;
            }
        });
    }

    updateStatus(e, id, value) {
        this.dataLoading = true;
        console.log();
        const formData = {status: value};
        this.querySubscription = this.backendService.updateDoc('ENROLL_CD', id, formData).then(res => {
            if (res) {
                this.savedChanges = true;
                this.error = false;
                this.errorMessage = '';
                this.dataLoading = false;
            }
        }).catch(err => {
            if (err) {
                this.error = true;
                this.errorMessage = err.message;
                this.dataLoading = false;
            }
        });

    }

    getDoc(docId) {
        this.dataLoading = true;
        this.data$ = this.backendService.getDoc('ENROLL_CD', docId);
        this.data1$ = this.backendService.getDoc('ENROLL_CD', docId).subscribe((res: any) => {
            if (res) {
                this.startDate = new Date(res.schoolStartDate.seconds * 1000);
                this.endDate = new Date(res.schoolEndDate.seconds * 1000);
                console.log(this.startDate, this.endDate);
            }
        });
        this.toggle('editMode');
        this.dataLoading = false;
    }

    deleteDoc(docId) {
        if (confirm('Are you sure want to delete this record ?')) {
            this.dataLoading = true;
            this.backendService.deleteDoc('ENROLL_CD', docId).then(res => {
                if (res) {
                    this.error = false;
                    this.errorMessage = '';
                    this.dataLoading = false;
                }
            }).catch(err => {
                if (err) {
                    this.error = true;
                    this.errorMessage = err.message;
                    this.dataLoading = false;
                }
            });
        }
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