import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { moveIn, fallIn } from '@app/shared/router.animation';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '@app/services/backend.service';
import { StudentService } from '@app/services/student.service';
import { ClassesService } from '@app/services/classes.service';

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
    currentEnrollment;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns = ['code', 'fName', 'class', 'parent', 'status', '_id'];
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

    constructor(private _backendService: BackendService, private classService: ClassesService, private studentService: StudentService) { }

    ngOnInit() {
        this.toggleField = 'resMode';
        this.dataSource = new MatTableDataSource(this.members);
        this.getActiveEnrollmentId();
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
        this.querySubscription = this._backendService.getDocs('ENROLL_CD').subscribe((res: any) => {
            res.sort((a, b) => a.orderBy - b.orderBy);
            this.enrollmentCDs$ = res;
            this.currentEnrollment = res.filter(item => item.orderBy === 0);
            this.currentEnrollment = this.currentEnrollment[0];
            this.getData(this.currentEnrollment._id);
            this.getClassCDs();

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

    changeCurrentEnrollment(e) {
        this.currentEnrollment = e.value;
        this.getData(this.currentEnrollment._id);
    }


    getClassCDs() {
        this.dataLoading = true;
        this.querySubscription = this.classService.getClasses(this.currentEnrollment._id).subscribe((res: any) => {
            console.log(res);
            res.sort((a, b) => a.orderBy - b.orderBy);
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
        console.log(enrollId);
        this.querySubscription = this.studentService.getStudentsList(enrollId, formData).subscribe((res: any) => {
            console.log(res);
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
