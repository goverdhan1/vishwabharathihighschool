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
export class ClassesService {

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage) {
    }

  getActiveEnrollmentId() {
    return this.afs.collection('SMS_CONFIG_ENROLL_CD', ref => ref.where('orderBy', '==', 0)).valueChanges();
  }

  createClass(enrollId: string, classData: any, periods: any): any {
    const batch = this.afs.firestore.batch();
    const id = this.afs.createId();
    const enrollmentRef = this.afs.firestore.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId);
    const classRef = enrollmentRef.collection('CLASSES').doc(id);
    const periodsRef = enrollmentRef.collection('PERIODS').doc(id);
    batch.set(classRef, {
      ...classData,
      _id: id,
      author: this.afAuth.auth.currentUser.uid
    });
    batch.set(periodsRef, {
      ...periods,
      _id: id,
      author: this.afAuth.auth.currentUser.uid
    });
    return batch.commit().then((res) => true);
  }

  updateClass(enrollId: string, docId: string, classData: any, periods: any): any {
    const batch = this.afs.firestore.batch();
    const enrollmentRef = this.afs.firestore.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId);
    const classRef = enrollmentRef.collection('CLASSES').doc(docId);
    const periodsRef = enrollmentRef.collection('PERIODS').doc(docId);
    batch.update(classRef, {
      ...classData,
      author: this.afAuth.auth.currentUser.uid
    });
    batch.update(periodsRef, {
      ...periods,
      author: this.afAuth.auth.currentUser.uid
    });
    return batch.commit().then((res) => true);
  }

  getClass(enrollId: string, docId: string) {
    return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('CLASSES').doc(docId).valueChanges();
  }

  getClasses(enrollId) {
    return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('CLASSES').valueChanges();
  }

  getTeachers(enrollId: string) {
    return this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId)
    .collection('EMPLOYEES', ref => ref.where('empType', '>=', 'teacher')).valueChanges();
  }

  deleteClass(docId: string, enrollId?: string) {
    const batch = this.afs.firestore.batch();
    const enrollmentRef = this.afs.firestore.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId);
    const classRef = enrollmentRef.collection('CLASSES').doc(docId);
    const periodsRef = enrollmentRef.collection('PERIODS').doc(docId);
    batch.delete(classRef);
    batch.delete(periodsRef);
    return batch.commit().then((res) => true);
  }

  getClassesList(enrollId: string) {
    return combineLatest(
      this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('CLASSES').valueChanges(),
      this.afs.collection('SMS_CONFIG_ENROLL_CD').doc(enrollId).collection('PERIODS').valueChanges()
    ).pipe(map(([classDetails, periodDetails]) => {
      const newArr = [];
      for (let i = 0; i < classDetails.length; i++) {
            newArr.push({...classDetails[i], days: periodDetails[i]});
      }
      return newArr;
      })
    );
  }


}

