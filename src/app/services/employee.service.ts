import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { combineLatest, merge, of, from} from 'rxjs';
import { switchMap, map, mergeMap, concatMap, flatMap } from 'rxjs/operators';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  querySubctiption;
  constructor(
    public afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _storage: AngularFireStorage ) { }
    getConfig() {
    return environment.social;
  }

  // generic collection url pages and generic CRUD functions
  get timestamp() {
    const d = new Date();
    return d;
    // return firebase.firestore.FieldValue.serverTimestamp();
  }

  getActiveEnrollmentId() {
    return this._afs.collection('SMS_CONFIG_ENROLL_CD', ref => ref.where('active', '==', true)).valueChanges();
  }

  createEmployee(data: any, attendanceDays: any, salaryMonths: any, marks?: any): any {
    const batch = this._afs.firestore.batch();
    const id = this._afs.createId();
    const timestamp = this.timestamp;

    const enrollmentRef = this._afs.firestore.collection('SMS_CONFIG_ENROLL_CD').doc(data.employeeDetails.ENROLLMENT_CODE);
    const empRef = enrollmentRef.collection('EMPLOYEES').doc(id);
    const empParentRef = this._afs.firestore.collection('EMPLOYEE_PARENT_DETAILS').doc(id);
    const empContactRef = this._afs.firestore.collection('EMPLOYEE_CONTACT_DETAILS').doc(id);
    const empQualificationRef = this._afs.firestore.collection('EMPLOYEE_QUALIFICATIONS').doc(id);

    const empAttendanceRef = enrollmentRef.collection('EMPLOYEE_ATTENDANCE').doc(id);
    const salaryRef = enrollmentRef.collection('EMPLOYEE_SALARY').doc(id);

    batch.set(empRef, {
      ...data.employeeDetails,
      _id: id,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });
    batch.set(empParentRef, {
      ...data.parentDetails,
      _id: id,
      ENROLLMENT_CODE: data.employeeDetails.ENROLLMENT_CODE,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.set(empContactRef, {
      ...data.contactDetails,
      _id: id,
      ENROLLMENT_CODE: data.employeeDetails.ENROLLMENT_CODE,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.set(empQualificationRef, {
      ...data.qualifications,
      _id: id,
      ENROLLMENT_CODE: data.employeeDetails.ENROLLMENT_CODE,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.set(empAttendanceRef, {
      ...attendanceDays,
      _id: id
    });

    batch.set(salaryRef, {
      ...salaryMonths,
      _id: id
    });
    return batch.commit().then((res) => true);
  }

  updateStudent(ENROLLMENT_CODE: string, docId: string, data: any): any {
    const timestamp = this.timestamp;
    const batch = this._afs.firestore.batch();
    const enrollmentRef = this._afs.firestore.collection('SMS_CONFIG_ENROLL_CD').doc(ENROLLMENT_CODE);
    const empRef = enrollmentRef.collection('EMPLOYEES').doc(docId);
    const empParentRef = this._afs.firestore.collection('EMPLOYEE_PARENT_DETAILS').doc(docId);
    const empContactRef = this._afs.firestore.collection('EMPLOYEE_CONTACT_DETAILS').doc(docId);
    const empQualificationRef = this._afs.firestore.collection('EMPLOYEE_QUALIFICATIONS').doc(docId);

    const empAttendanceRef = enrollmentRef.collection('EMPLOYEE_ATTENDANCE').doc(docId);
    const salaryRef = enrollmentRef.collection('SALARY').doc(docId);
    batch.update(empRef, {
      ...data.employeeDetails,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });
    batch.update(empParentRef, {
      ...data.empParentDetails,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.update(empContactRef, {
      ...data.empContactDetails,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.update(empQualificationRef, {
      ...data.empQualifications,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    return batch.commit().then((res) => true);
  }

  updateFileUpload(enrollId: string, docId: string, filePath: string) {
    const timestamp = this.timestamp;
    const docRef = this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('EMPLOYEES').doc(docId);
    return docRef.update({
      files: firestore.FieldValue.arrayUnion(filePath),
      updatedAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });
  }
  getFileDownloadUrl(url) {
    const ref = this._storage.ref(url);
    return ref.getDownloadURL();
  }

  // deleteDoc(coll: string, docId: string) {
  //   const timestamp = this.timestamp
  //   const docRef = this._afs.collection(this.getCollUrls(coll)).doc(docId);
  //   return docRef.delete().then((res) => true);
  // }

  getDoc(enrollId: string, docId: string) {
    return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('EMPLOYEES').doc(docId).valueChanges();
  }

  getEmployees(enrollId) {
   return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId)
   .collection('EMPLOYEES', ref => ref.orderBy('code', 'asc')).valueChanges();
  }

  getParentDetails(enrollId) {
    return this.getEmployees(enrollId).pipe(switchMap((res: any): any => {
        return res.map((r: any) => {
          return this._afs.collection('EMPLOYEE_PARENT_DETAILS', ref => ref.where('_id', '==', r._id)).valueChanges();
        });
    }), flatMap((fData: any) => fData));
  }

  getStudentsList(enrollId, formData?) {
    if (formData) {
      if (formData.code) {
        return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId)
        .collection('EMPLOYEES', ref => ref.where('code', '>=', formData.code)).valueChanges();
      } else {
        return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId)
        .collection('EMPLOYEES', ref => ref.where('fName', '>=', formData.fName)).valueChanges();
      }
    } else { // no search critera - fetch all docs

    return combineLatest(
        this.getEmployees(enrollId),
        this.getParentDetails(enrollId)
      ).pipe(map(([employeeDetails, parentDetails]) => {
        const newArr = [];
        for (const emp of employeeDetails) {
          newArr.push({...emp, parent: parentDetails});
        }
        return newArr;
        }));

//      return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').valueChanges();

    }
  }
}
