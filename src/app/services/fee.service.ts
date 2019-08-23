import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { combineLatest, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  constructor(
    public afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _storage: AngularFireStorage ) { }
    getConfig() {
    return environment.social;
  }

  getActiveEnrollmentId() {
    return this._afs.collection('SMS_CONFIG_ENROLL_CD', ref => ref.where('active', '==', true)).valueChanges();
  }

  getFeeList(enrollId: string) {
    return combineLatest(
      this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').valueChanges(),
      this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('FEE').valueChanges()
    ).pipe(map(([studentDetails, feeDetails]) => {
      const newArr = [];
      for (let i = 0; i < studentDetails.length; i++) {
            newArr.push({...studentDetails[i], months: feeDetails[i]});
      }
      return newArr;
      })
    );

//     const docRef = this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').doc(ID);

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
   .pipe(switchMap(res => this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS',
   ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   ));
  }
  getUserStudentFeeDoc(enrollId) {
    return this.getDoc('SMS_USERS', this.afAuth.auth.currentUser.uid)
   .pipe(switchMap(res => this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS',
    ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   .pipe(switchMap(
     res => this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('FEE').valueChanges()))
    ));
  }
  // generic collection url pages and generic CRUD functions
  get timestamp() {
    const d = new Date();
    return d;
    // return firebase.firestore.FieldValue.serverTimestamp();
  }

  updateSpecificMonthFee(enrollId: string, docId: string, data: any) {
    const timestamp = this.timestamp;
    const docRef = this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('FEE').doc(docId);
    return docRef.update(data).then((res) => res);
  }

  updateDoc(enrollId: string, coll: string, docId: string, data: any) {
    const timestamp = this.timestamp;
    const docRef = this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection(coll).doc(docId);
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
    const docRef = this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection(coll).doc(docId);
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

  getDoc(coll: string, docId: string) {
    return this._afs.collection(coll).doc(docId).valueChanges();
  }
  getDocs(enrollId: string, coll: string, formData?) {
    if (formData) {
      if (formData.code) {
        return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection(coll,
        ref => ref.where('code', '>=', formData.code)).valueChanges();
      } else {
        return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection(coll,
        ref => ref.where('descr', '>=', formData.descr)).valueChanges();
      }
    } else { // no search critera - fetch all docs
      return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection(coll).valueChanges();
    }
  }
}
