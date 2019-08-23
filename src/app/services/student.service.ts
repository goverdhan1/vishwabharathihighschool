import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

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

  createStudent(data: any, attendanceDays: any, feeMonths: any, marks?: any): any {
    const batch = this._afs.firestore.batch();
    const id = this._afs.createId();
    const timestamp = this.timestamp;

    const enrollmentRef = this._afs.firestore.collection('SMS_CONFIG_ENROLL_CD').doc(data.studentDetails.ENROLLMENT_CODE);
    const studentRef = enrollmentRef.collection('STUDENTS').doc(id);
    const parentRef = this._afs.firestore.collection('PARENT_DETAILS').doc(id);
    const contactRef = this._afs.firestore.collection('CONTACT_DETAILS').doc(id);
    const qualificationRef = this._afs.firestore.collection('QUALIFICATIONS').doc(id);
    const physicalStatusRef = this._afs.firestore.collection('PHYSICAL_STATUS').doc(id);

    const attendanceRef = enrollmentRef.collection('ATTENDANCE').doc(id);
    const feeRef = enrollmentRef.collection('FEE').doc(id);
    const marksRef = enrollmentRef.collection('MARKSHEETS').doc(id);
    batch.set(studentRef, {
      ...data.studentDetails,
      _id: id,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });
    batch.set(parentRef, {
      ...data.parentDetails,
      _id: id,
      ENROLLMENT_CODE: data.studentDetails.ENROLLMENT_CODE,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.set(contactRef, {
      ...data.contactDetails,
      _id: id,
      ENROLLMENT_CODE: data.studentDetails.ENROLLMENT_CODE,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.set(qualificationRef, {
      ...data.qualifications,
      _id: id,
      ENROLLMENT_CODE: data.studentDetails.ENROLLMENT_CODE,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.set(physicalStatusRef, {
      ...data.physicalStatus,
      _id: id,
      ENROLLMENT_CODE: data.studentDetails.ENROLLMENT_CODE,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.set(attendanceRef, {
      ...attendanceDays,
      _id: id
    });

    batch.set(feeRef, {
      ...feeMonths,
      _id: id
    });
    batch.set(marksRef, {
    //  markSheet: marks,
      _id: id
    });
    return batch.commit().then((res) => true);
  }

  updateStudent(ENROLLMENT_CODE: string, docId: string, data: any): any {
    const timestamp = this.timestamp;
    const batch = this._afs.firestore.batch();

    const enrollmentRef = this._afs.firestore.collection('SMS_CONFIG_ENROLL_CD').doc(ENROLLMENT_CODE);
    const studentRef = enrollmentRef.collection('STUDENTS').doc(docId);
    const parentRef = this._afs.firestore.collection('PARENT_DETAILS').doc(docId);
    const contactRef = this._afs.firestore.collection('CONTACT_DETAILS').doc(docId);
    const qualificationRef = this._afs.firestore.collection('QUALIFICATIONS').doc(docId);
    const physicalStatusRef = this._afs.firestore.collection('PHYSICAL_STATUS').doc(docId);

    const attendanceRef = enrollmentRef.collection('ATTENDANCE').doc(docId);
    const feeRef = enrollmentRef.collection('FEE').doc(docId);
    const marksRef = enrollmentRef.collection('MARKSHEETS').doc(docId);
    batch.update(studentRef, {
      ...data.studentDetails,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });
    batch.update(parentRef, {
      ...data.parentDetails,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.update(contactRef, {
      ...data.contactDetails,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.update(qualificationRef, {
      ...data.qualifications,
      updatedAt: timestamp,
      createdAt: timestamp,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email,
      author: this.afAuth.auth.currentUser.uid
    });

    batch.update(physicalStatusRef, {
      ...data.physicalStatus,
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
    const docRef = this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').doc(docId);
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
    return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').doc(docId).valueChanges();
  }
  getStudentsList(enrollId, formData?) {
 //   const docs = this._afs.collection('enrollCode').doc(enrollCode).collection('STUDENTS');

    if (formData) {
      if (formData.code) {
        return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId)
        .collection('STUDENTS', ref => ref.where('code', '>=', formData.code)).valueChanges();
      } else {
        return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId)
        .collection('STUDENTS', ref => ref.where('fName', '>=', formData.fName)).valueChanges();
      }
    } else { // no search critera - fetch all docs
        return this._afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').valueChanges();
    }
  }
}
