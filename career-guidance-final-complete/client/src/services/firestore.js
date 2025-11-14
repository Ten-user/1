import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc 
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Institutions & Courses ---
export async function listInstitutions() {
  const q = query(collection(db, 'institutions'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function listCoursesForInstitution(institutionId) {
  const q = query(collection(db, 'courses'), where('institutionId', '==', institutionId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getCourse(courseId) {
  const d = doc(db, 'courses', courseId);
  const snap = await getDoc(d);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// --- Student Applications ---
export async function applyToCourse(payload) {
  const ref = await addDoc(collection(db, 'applications'), payload);
  return ref.id;
}

export async function listStudentApplications(studentId) {
  const q = query(collection(db, 'applications'), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function listApplicationsForCourse(courseId) {
  const q = query(collection(db, 'applications'), where('courseId', '==', courseId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// --- Jobs & Applications ---
export async function listJobs() {
  const q = query(collection(db, 'jobs'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function applyToJob(payload) {
  const ref = await addDoc(collection(db, 'jobApplications'), payload);
  return ref.id;
}

// --- Notifications ---
export async function listNotifications(userId) {
  const q = query(collection(db, 'notifications'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// --- Optional: update documents ---
export async function updateDocument(collectionName, docId, data) {
  const d = doc(db, collectionName, docId);
  await updateDoc(d, data);
  return true;
}
