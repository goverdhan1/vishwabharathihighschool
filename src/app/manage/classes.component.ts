import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { moveIn, fallIn } from '@app/shared/router.animation';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BackendService } from '@app/services/backend.service';
import { ClassesService } from '@app/services/classes.service';

@Component({
    selector: 'app-classes',
    templateUrl: './classes.component.html',
    styleUrls: ['./classes.component.css'],
      animations: [moveIn(), fallIn()],
      host: { '[@moveIn]': '' }
})
export class ClassesComponent implements OnInit, AfterViewInit, OnDestroy {

    members: any[];
    dataSource: MatTableDataSource<any>;
    myDocData;
    data$;
    data1$;
    toggleField: string;
    savedChanges = false;
    error = false;
    errorMessage = '';
    dataLoading = false;
    private querySubscription;
    showFileUpload = false;
    showDocument = false;
    docId: string;
    docUrl: Observable<string | null>;
    fileName: string;
    subjects$;
    periods$ = {
        period1: {teacher: {}, sub: ''},
        period2: {teacher: {}, sub: ''},
        period3: {teacher: {}, sub: ''},
        period4: {teacher: {}, sub: ''},
        period5: {teacher: {}, sub: ''},
        period6: {teacher: {}, sub: ''},
        period7: {teacher: {}, sub: ''}
    };
    currentEnrollment: any;
    currentEnrollment$;
    enrollmentCDs$;
    enrollmentCD;
    schoolDays;
    teachers$;
    ctStartDate: any;
    ctEndDate: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns = ['orderBy', 'code', 'section', 'classTeacher', 'subjects', '_id'];

    constructor(private backendService: BackendService, private classService: ClassesService) { }

    ngOnInit() {
        this.toggleField = 'showResMode';
        this.dataSource = new MatTableDataSource(this.members);
        this.getEnrollmentCDs();
        this.getSubjectCDs();
    }

    toggle(filter?) {
        if (!filter) {
            filter = 'resMode';
        } else {
            filter = filter;
        }
        this.getClassTeachers();
        this.toggleField = filter;
        this.dataLoading = false;
    }

    changeCurrentEnrollment(e) {
        this.currentEnrollment = e.value;
        this.getClasses(this.currentEnrollment._id);
        this.getClassTeachers();
        this.enrollmentCD = this.enrollmentCDs$.filter(item => item._id === e.value);
        this.schoolDays = this.setDays(this.currentEnrollment);
    }

    getEnrollmentCDs() {
        this.dataLoading = true;
        this.querySubscription = this.backendService.getDocs('ENROLL_CD').subscribe((res: any) => {
            res.sort((a, b) => a.orderBy - b.orderBy);
            this.enrollmentCDs$ = res;
            this.currentEnrollment = res.filter(item => item.orderBy === 0);
            this.currentEnrollment = this.currentEnrollment[0];
            console.log(this.currentEnrollment);
            this.schoolDays = this.setDays(this.currentEnrollment);
            this.getClasses(this.currentEnrollment._id);
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

    getSubjectCDs() {
        this.dataLoading = true;
        this.querySubscription = this.backendService.getDocs('SUBJECTS').subscribe((res: any) => {
            this.subjects$ = res;
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


    getClasses(enrollId) {
        this.dataLoading = true;
        this.querySubscription = this.classService.getClasses(enrollId).subscribe((res) => {
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
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

    getClassTeachers() {
     this.querySubscription = this.classService.getTeachers(this.currentEnrollment._id).subscribe(res => {
            this.teachers$ = res;
        });
    }


    setData(formData) {
        this.dataLoading = true;
        this.querySubscription = this.classService.createClass(this.currentEnrollment._id, formData, this.schoolDays).then(res => {
            if (res) {
                // this.savedChanges = true;
                // this.error = false;
                // this.errorMessage = '';
                this.dataLoading = false;
                this.toggleField = 'resMode';
                this.getClasses(this.currentEnrollment._id);

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
        this.schoolDays = this.setDays(this.currentEnrollment);
        this.querySubscription = this.classService.updateClass(this.currentEnrollment._id,
            this.docId, formData, this.schoolDays).then(res => {
            if (res) {
                this.toggleField = 'resMode';
                this.getClasses(this.currentEnrollment._id);
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

    deleteDoc(docId) {
        if (confirm('Are you sure want to delete this record ?')) {
            this.dataLoading = true;
            this.classService.deleteClass(this.currentEnrollment, docId).then(res => {
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

    editClass(docId) {
        this.dataLoading = true;
        this.docId = docId;
        this.data$ = this.classService.getClass(this.currentEnrollment._id, docId);
        this.data1$ = this.classService.getClass(this.currentEnrollment._id, docId).subscribe((res: any) => {
            this.ctStartDate = new Date(res.classTeacherStartDate.seconds * 1000);
            this.ctEndDate = new Date(res.classTeacherEndDate.seconds * 1000);
        });
        this.toggle('editMode');
        this.dataLoading = false;
    }

    setDays(data: any): any {
        const numberOfDays = (data.schoolEndDate.seconds - data.schoolStartDate.seconds) / (24 * 60 * 60);
        let dayIncrement = 0;
        const dys = [];
        for (let i = 0; i < numberOfDays; i++ ) {
            dayIncrement += 24 * 60 * 60;
            const dateValue =  new Date((data.schoolStartDate.seconds + dayIncrement) * 1000);
            const dateStr = (dateValue.getMonth() + 1) + '_' + dateValue.getDate() + '_' + dateValue.getFullYear();
            if (dateValue.getDay() === 0) {
                dys[dateStr] = 'H';
            } else {
                dys[dateStr] = this.periods$;
            }
        }
        return dys;
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