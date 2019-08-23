import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { moveIn, fallIn } from '../shared/router.animation';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource, MatDatepicker } from '@angular/material';
import { BackendService } from '../services/backend.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, FormArrayName } from '@angular/forms';
// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


export const MY_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'LL',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
@Component({
  selector: 'app-attendancecode',
  templateUrl: './attendancecode.component.html',
  styleUrls: ['./attendancecode.component.css'],
  animations: [moveIn(), fallIn()],
  providers: [{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}],
  host: { '[@moveIn]': ''}
})

export class AttendancecodeComponent implements OnInit, AfterViewInit, OnDestroy {
    members: any[];
    dataSource: MatTableDataSource<any>;
    myDocData;
    data$;
    toggleField: string;
    state = '';
    savedChanges = false;
    error = false;
    errorMessage = '';
    dataLoading = false;
    private querySubscription;

    attendanceStatus = ['P', 'A', 'L', 'LA', 'H'];
    addDataForm: FormGroup;
    editDataForm: FormGroup;
    enrollmentCDs$;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    displayedColumns = ['code', 'descr', '_id'];

    constructor(private _backendService: BackendService, private _fb: FormBuilder) { }

    ngOnInit() {
        this.toggleField = 'showResMode';
        this.getEnrollmentCDs();
        this.getData();

        this.error = false;
        this.errorMessage = '';
        this.dataSource = new MatTableDataSource(this.members);
        this.addDataForm = this._fb.group({
            code: ['', Validators.required],
            descr: ['', Validators.required],
            enrollmentCode: ['', Validators.required],
            days: this._fb.array([])
        });
        this.editDataForm = this._fb.group({
            _id: ['', Validators.required],
            code: ['', Validators.required],
            descr: ['', Validators.required],
            enrollmentCode: ['', Validators.required],
            days: this._fb.array([])
        });
    }


    getEnrollmentCDs() {
        this.dataLoading = true;
        this.querySubscription = this._backendService.getDocs('ENROLL_CD').subscribe((res) => {
            this.enrollmentCDs$ = res;
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


    LINES(formName) {
        return this[formName].get('days') as FormArray;
    }
    addLINES(formName) {
        this.LINES(formName).push(this._fb.group({
            date: '',
            status: '',
            day: ''
        }));
    }

    setDays(data, formName) {
        const numberOfDays = (data.value.schoolEndDate.seconds - data.value.schoolStartDate.seconds) / (24 * 60 * 60);
        let dayIncrement = 0;
        this[formName].enrollmentCode = data.value._id;
        const dys = this[formName].get('days') as FormArray;
        while (dys.length) {
            dys.removeAt(0);
         }
        for(let i = 0; i < numberOfDays; i++ ) {
            dayIncrement += 24 * 60 * 60;
            const dateValue =  new Date((data.value.schoolStartDate.seconds + dayIncrement) * 1000);
            const dateStr = (dateValue.getMonth() + 1) + '/' + dateValue.getDate() + '/' + dateValue.getFullYear();
            console.log(dateStr);
            dys.push(this._fb.group({
                date: dateStr,
                status: '',
                day: dateValue.getDay()
            }));
        }

    }

    toggle(filter?) {
        if (!filter) {
            filter = 'searchMode';
        } else {
            filter = filter;
        }
        this.toggleField = filter;
        this.dataLoading = false;
    }

    getData(formData?) {
        this.dataLoading = true;
        this.querySubscription = this._backendService.getDocs('ATTENDANCE_CD', formData).subscribe((res) => {
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

    compareObjects(o1: any, o2: any): boolean {
        return o1._id === o2._id;
    }

    setData(formData) {
        this.dataLoading = true;
        this.querySubscription = this._backendService.setDoc('ATTENDANCE_CD', formData).then(res => {
            if (res) {
                this.savedChanges = true;
                this.error = false;
                this.errorMessage = '';
                this.dataLoading = false;
            }
        }
        ).catch(err => {
            if (err) {
                this.error = true;
                this.errorMessage = err.message;
                this.dataLoading = false;
            }
        });
    }

    updateData(formData) {
        this.dataLoading = true;
        this.querySubscription = this._backendService.updateDoc('ATTENDANCE_CD', formData._id, formData).then(res => {
            if (res) {
                this.savedChanges = true;
                this.error = false;
                this.errorMessage = '';
                this.dataLoading = false;
            }
        }
        ).catch(err => {
            if (err) {
                this.error = true;
                this.errorMessage = err.message;
                this.dataLoading = false;
            }
        });
    }

    getDoc(docId) {
        this.dataLoading = true;
        this.data$ = this._backendService.getDoc('ATTENDANCE_CD', docId).subscribe(res => {
            if (res) {
                this.data$ = res;
                this.editDataForm = this._fb.group({
                    _id: ['', Validators.required],
                    code: ['', Validators.required],
                    descr: ['', Validators.required],
                    enrollmentCode: ['', Validators.required],
                    days: this._fb.array([])
                });
                this.editDataForm.patchValue(this.data$);
                if (this.data$['days']) {
                    for(let i = 0; i < this.data$['days'].length; i++) {
                       this.LINES('editDataForm').push(this._fb.group(this.data$['days'][i]));
                    }
                }
                this.toggle('editMode');
                this.dataLoading = false;
            }},
                (error) => {
                    this.error = true;
                    this.errorMessage = error.message;
                    this.dataLoading = false;
                },
                () => {
                    this.dataLoading = false;
                });
    }

    deleteDoc(docId) {
        if (confirm('Are you sure want to delete this record ?')) {
            this.dataLoading = true;
            this._backendService.deleteDoc('ATTENDANCE_CD', docId).then(res => {
                if (res) {
                    this.error = false;
                    this.errorMessage = '';
                    this.dataLoading = false;
                }
            }
            ).catch(err => {
                if (err) {
                    this.error = true;
                    this.errorMessage = err.message;
                    this.dataLoading = false;
                }
            }
            );
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