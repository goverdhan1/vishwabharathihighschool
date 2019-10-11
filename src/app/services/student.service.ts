import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { combineLatest, merge, of, from } from 'rxjs';
import { switchMap, map, mergeMap, concatMap, flatMap } from 'rxjs/operators';
import { firestore } from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  querySubctiption;
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage) {
  }
  getConfig() {
    return environment.social;
  }

  // generic collection url pages and generic CRUD functions
  get timestamp() {
    return new Date();
    // return firebase.firestore.FieldValue.serverTimestamp();
  }

  getActiveEnrollmentId() {
    return this.afs.collection('SMS_CONFIG_ENROLL_CD', ref => ref.where('orderBy', '==', 0)).valueChanges();
  }

  createStudent(data: any, attendanceDays: any, feeMonths: any, marks?: any): any {
    const batch = this.afs.firestore.batch();
    const id = this.afs.createId();
    const timestamp = this.timestamp;

    const enrollmentRef = this.afs.firestore.collection('SMS_CONFIG_ENROLL_CD').doc(data.studentDetails.ENROLLMENT_CODE);
    const studentRef = enrollmentRef.collection('STUDENTS').doc(id);
    const parentRef = this.afs.firestore.collection('PARENT_DETAILS').doc(id);
    const contactRef = this.afs.firestore.collection('CONTACT_DETAILS').doc(id);
    const qualificationRef = this.afs.firestore.collection('QUALIFICATIONS').doc(id);
    const physicalStatusRef = this.afs.firestore.collection('PHYSICAL_STATUS').doc(id);

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
    const batch = this.afs.firestore.batch();

    const enrollmentRef = this.afs.firestore.collection('SMS_CONFIG_ENROLL_CD').doc(ENROLLMENT_CODE);
    const studentRef = enrollmentRef.collection('STUDENTS').doc(docId);
    const parentRef = this.afs.firestore.collection('PARENT_DETAILS').doc(docId);
    const contactRef = this.afs.firestore.collection('CONTACT_DETAILS').doc(docId);
    const qualificationRef = this.afs.firestore.collection('QUALIFICATIONS').doc(docId);
    const physicalStatusRef = this.afs.firestore.collection('PHYSICAL_STATUS').doc(docId);

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
    const docRef = this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').doc(docId);
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

  // deleteDoc(coll: string, docId: string) {
  //   const timestamp = this.timestamp
  //   const docRef = this.afs.collection(this.getCollUrls(coll)).doc(docId);
  //   return docRef.delete().then((res) => true);
  // }

  getDoc(enrollId: string, docId: string) {
    return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').doc(docId).valueChanges();
  }

  getStudents(enrollId) {
    return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').valueChanges();
  }

  getParentDetails(enrollId) {
    return this.getStudents(enrollId).pipe(switchMap((res: any): any => {
      return res.map((r: any) => {
        return this.afs.collection('PARENT_DETAILS', ref => ref.where('_id', '==', r._id)).valueChanges();
      });
    }), flatMap((fData: any) => fData));
  }

  getStudentsList(enrollId, formData?) {
    if (formData) {
      if (formData.code) {
        return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId)
          .collection('STUDENTS', ref => ref.where('code', '>=', formData.code)).valueChanges();
      } else {
        return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId)
          .collection('STUDENTS', ref => ref.where('fName', '>=', formData.fName)).valueChanges();
      }
    } else { // no search critera - fetch all docs

      return combineLatest(
        this.getStudents(enrollId),
        this.getParentDetails(enrollId)
      ).pipe(map(([studentDetails, parentDetails]) => {
        const newArr = [];
        for (const std of studentDetails) {
          newArr.push({ ...std, parent: parentDetails });
        }
        return newArr;
      }));

      //      return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('STUDENTS').valueChanges();

    }
  }
}
