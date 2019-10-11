import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { auth } from 'firebase/app';
import { Observable, combineLatest} from 'rxjs';
import { switchMap, map} from 'rxjs/operators';
import { firestore } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class PeriodsService {

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage ) { }
    getConfig() {
    return environment.social;
  }

  getActiveEnrollmentId() {
    return this.afs.collection('SMS_CONFIG_ENROLL_CD', ref => ref.where('active', '==', true)).valueChanges();
  }

  getAttendanceList(enrollId: string) {
    return combineLatest(
      this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').valueChanges(),
      this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('ATTENDANCE').valueChanges()
    ).pipe(map(([studentDetails, attendanceDetails]) => {
      const newArr = [];
      for (let i = 0; i < studentDetails.length; i++) {
            newArr.push({...studentDetails[i], days: attendanceDetails[i]});
      }
      return newArr;
      })
    );

//     const docRef = this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').doc(ID);

//     docRef.get().then(function(doc) {
//     if (doc.exists) {
//   // gives full object of user
//     console.log("Document data:", doc.data());
//   // gives specific field 
//   var name=doc.get('name');
//   console.log(name);

// } else {
//     // doc.data() will be undefined in this case
//     console.log("No such document!");
// }
// }).catch(function(error) {
// console.log("Error getting document:", error);
// });
  }

  getUserStudentDoc(enrollId) {
    return this.getDoc('SMS_USERS', this.afAuth.auth.currentUser.uid)
   .pipe(switchMap(res => this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS',
   ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   ));
  }

  getUserStudentAttendanceDoc(enrollId) {
    return this.getDoc('SMS_USERS', this.afAuth.auth.currentUser.uid)
   .pipe(switchMap(res => this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS',
    ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   .pipe(switchMap(
     res => this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('ATTENDANCE').valueChanges()))
    ));
  }
  // generic collection url pages and generic CRUD functions
  get timestamp() {
    const d = new Date();
    return d;
    // return firebase.firestore.FieldValue.serverTimestamp();
  }

  assignTeacher(enrollId: string, docId: string, data: any) {
    const docRef = this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('PERIODS').doc(docId);
    return docRef.update(data).then((res) => res);
  }

  getEmployeeAttendanceList(enrollId: string) {
    return combineLatest(
      this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('EMPLOYEES').valueChanges(),
      this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('EMPLOYEE_ATTENDANCE').valueChanges()
    ).pipe(map(([empDetails, attendanceDetails]) => {
      const newArr = [];
      for (let i = 0; i < empDetails.length; i++) {
            newArr.push({...empDetails[i], days: attendanceDetails[i]});
      }
      return newArr;
      })
    );

//     const docRef = this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').doc(ID);

//     docRef.get().then(function(doc) {
//     if (doc.exists) {
//   // gives full object of user
//     console.log("Document data:", doc.data());
//   // gives specific field 
//   var name=doc.get('name');
//   console.log(name);

// } else {
//     // doc.data() will be undefined in this case
//     console.log("No such document!");
// }
// }).catch(function(error) {
// console.log("Error getting document:", error);
// });
  }

  getUserEmployeeDoc(enrollId) {
    return this.getDoc('SMS_USERS', this.afAuth.auth.currentUser.uid)
   .pipe(switchMap(res => this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('EMPLOYEES',
   ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   ));
  }

  getUserEmployeeAttendanceDoc(enrollId) {
    return this.getDoc('SMS_USERS', this.afAuth.auth.currentUser.uid)
   .pipe(switchMap(res => this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('EMPLOYEES',
    ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   .pipe(switchMap(
     res => this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('EMPLOYEE_ATTENDANCE').valueChanges()))
    ));
  }

  updateSpecificDayEmpAttendance(enrollId: string, docId: string, data: any) {
    const docRef = this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('EMPLOYEE_ATTENDANCE').doc(docId);
    return docRef.update(data).then((res) => res);
  }

  updateDoc(enrollId: string, coll: string, docId: string, data: any) {
    const timestamp = this.timestamp;
    const docRef = this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection(coll).doc(docId);
    return docRef.update({
      ...data,
      updatedAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    }).then((res) => true);
  }
  updateFileUpload(enrollId: string, coll: string, docId: string, filePath: string) {
    const timestamp = this.timestamp;
    const docRef = this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection(coll).doc(docId);
    return docRef.update({
      files: firestore.FieldValue.arrayUnion(filePath),
      updatedAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });
  }
  getFileDownloadUrl(url) {
    const ref = this.storage.ref(url);
    return ref.getDownloadURL();
  }

  getDoc(coll: string, docId: string) {
    return this.afs.collection(coll).doc(docId).valueChanges();
  }
  getDocs(enrollId: string, coll: string, formData?) {
    if (formData) {
      if (formData.code) {
        return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection(coll,
        ref => ref.where('code', '>=', formData.code)).valueChanges();
      } else {
        return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection(coll,
        ref => ref.where('descr', '>=', formData.descr)).valueChanges();
      }
    } else { // no search critera - fetch all docs
      return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection(coll).valueChanges();
    }
  }

}
