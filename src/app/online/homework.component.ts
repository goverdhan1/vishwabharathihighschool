import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { moveIn, fallIn } from '@app/shared/router.animation';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '@app/services/backend.service';

@Component({
    selector: 'app-homework',
    templateUrl: './homework.component.html',
    styleUrls: ['./homework.component.css'],
      animations: [moveIn(), fallIn()],
      host: { '[@moveIn]': '' }
})
export class HomeworkComponent implements OnInit, OnDestroy {

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
    showFileUpload = false;
    showDocument = false;
    docId: string;
    docUrl: Observable<string | null>;
    fileName: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns = ['code', 'descr', '_id'];
    enrollmentCDs$;

    constructor(private _backendService: BackendService) { }

    ngOnInit() {
        this.toggleField = 'searchMode';
        this.dataSource = new MatTableDataSource(this.members);
        this.getEnrollmentCDs();
    }

    toggle(filter?) {
        if (!filter) { filter = 'searchMode';
         } else { filter = filter; }
        this.toggleField = filter;
        this.dataLoading = false;
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

    getData(formData?) {
        this.dataLoading = true;
        this.querySubscription = this._backendService.getDocs('HOMEWORK', formData).subscribe((res) => {
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

    setData(formData) {
        this.dataLoading = true;
        this.querySubscription = this._backendService.setDoc('HOMEWORK', formData).then(res => {
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
        this.querySubscription = this._backendService.updateDoc('HOMEWORK', formData._id, formData).then(res => {
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
        this.docId = docId; // this is required to pass at file upload directive
        this.dataLoading = true;
        this.data$ = this._backendService.getDoc('HOMEWORK', docId);
        this.toggle('editMode');
        this.dataLoading = false;
    }
    getDocUrl(docUrl){
        this.fileName = docUrl;
        this.docUrl = this._backendService.getFileDownloadUrl(docUrl);
    }

    deleteDoc(docId) {
        if (confirm('Are you sure want to delete this record ?')) {
            this.dataLoading = true;
            this._backendService.deleteDoc('HOMEWORK', docId).then(res => {
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
            });
        }
    }

    //mat table paginator and filter functions
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