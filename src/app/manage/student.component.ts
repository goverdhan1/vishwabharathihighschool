import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { moveIn, fallIn } from '../shared/router.animation';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BackendService } from '../services/backend.service';
import { StudentService } from '../services/student.service';
import { StringDecoder } from 'string_decoder';

@Component({
    selector: 'app-student',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.css'],
    animations: [moveIn(), fallIn()],
    host: { '[@moveIn]': '' }
})
export class StudentComponent implements OnInit, AfterViewInit, OnDestroy {

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
    ENROLLMENT_CODE;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    displayedColumns = ['code', 'fName', 'class', 'status', '_id'];
    // feeCDs$;
    // marksCDs$;
    // attendanceCDs$;
    enrollmentCDs$;
    classCDs$;
    attendanceDays;
    feeMonths;
    // file upload
    docId: string;
    fileName: string;
    showFileUpload = false;
    showDocument = false;
    docUrl: Observable<string | null>;

    constructor(private _backendService: BackendService, private studentService: StudentService) { }

    ngOnInit() {
        this.toggleField = 'resMode';
        this.dataSource = new MatTableDataSource(this.members);
        this.getActiveEnrollmentId();
        this.getClassCDs();
        // this.getFeeCDs();
        // this.getAttendanceCDs();
        // this.getMarksCDs();
    }

    toggle(filter?) {
        if (!filter) {
            filter = 'searchMode';
         } else {
             filter = filter;
             if (filter === 'addMode') {
                this.attendanceDays = this.setDays(this.ENROLLMENT_CODE);
                this.feeMonths = this.setMonths(this.ENROLLMENT_CODE);
             }
        }
        this.toggleField = filter;
        this.dataLoading = false;
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

    onEnrollmentCodeChange(data) {
        this.attendanceDays = this.setDays(data);
        this.feeMonths = this.setMonths(data);
    }

    setDays(data: any): any {
        const numberOfDays = (data.schoolEndDate.seconds - data.schoolStartDate.seconds) / (24 * 60 * 60);
        let dayIncrement = 0;
        const dys = [];
        for (let i = 0; i < numberOfDays; i++ ) {
            dayIncrement += 24 * 60 * 60;
            const dateValue =  new Date((data.schoolStartDate.seconds + dayIncrement) * 1000);
            const dateStr = (dateValue.getMonth() + 1) + '_' + dateValue.getDate() + '_' + dateValue.getFullYear();
            // dys.push({
            //     date: dateStr,
            //     status: '',
            //     day: dateValue.getDay()
            // });
            if(dateValue.getDay() === 0) {
                dys[dateStr] = 'H';
            } else {
                dys[dateStr] = '';
            }
        }
        return dys;
    }

    setMonths(data: any): any {
        const schoolstartDate = new Date(data.schoolStartDate.seconds * 1000);
        const calMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        let startMonth = schoolstartDate.getMonth();
        let startYear = schoolstartDate.getFullYear();
        const months = [];
        for (let i = 0; i < 12; i++ ) {
            if (startMonth > 11) {
                startMonth = 0;
                startYear++;
            }
            // months.push({
            //     month: calMonths[startMonth] + '-' + startYear,
            //     amount: null,
            //     paidStatus: ''
            // });
            const fieldLabel = calMonths[startMonth] + '_' + startYear;
            months[fieldLabel] = '';
            startMonth++;
        }
        return months;
    }

    setData(formData) {
        this.dataLoading = true;
        console.log(formData);
        this.querySubscription = this.studentService.createStudent(formData, this.attendanceDays, this.feeMonths).then(res => {
            console.log(res);
            if(res) {
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
        }
        );
    }

    updateData(formData) {
        this.dataLoading = true;
        this.querySubscription = this._backendService.updateDoc('STUDENT', formData._id, formData).then(res => {
            console.log(res);
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
        }
        );
    }

    getDoc(enrollId, docId) {
        this.docId = docId; // this is required to pass at file upload directive
        this.dataLoading = true;
        this.data$ = this.studentService.getDoc(enrollId, docId);
        this.toggle('editMode');
        this.dataLoading = false;
    }
    getDocUrl(docUrl) {
        this.fileName = docUrl;
        this.docUrl = this._backendService.getFileDownloadUrl(docUrl);
    }

    deleteDoc(docId) {
        if (confirm('Are you sure want to delete this record ?')) {
            this.dataLoading = true;
            this._backendService.deleteDoc('STUDENT', docId).then(res => {
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