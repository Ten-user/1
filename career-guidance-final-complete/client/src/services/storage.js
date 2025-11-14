import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebaseConfig'
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
export function uploadTranscriptFile(file, studentId, onProgress){
  const filename = `transcripts/${studentId}/${Date.now()}_${file.name}`
  const storageRef = ref(storage, filename)
  const task = uploadBytesResumable(storageRef, file)
  return new Promise((resolve,reject)=>{
    task.on('state_changed', snap=> {
      const pct = Math.round((snap.bytesTransferred/snap.totalBytes)*100)
      if(onProgress) onProgress(pct)
    }, err=> reject(err), async ()=> {
      const url = await getDownloadURL(task.snapshot.ref)
      resolve({url, path: filename})
    })
  })
}