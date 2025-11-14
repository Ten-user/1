import React, { createContext, useContext, useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const AuthContext = createContext()
export function AuthProvider({children}){
  const authValue = useProvideAuth()
  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)

function useProvideAuth(){
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      setUser(u)
      if(u){
        const ref = doc(db,'users',u.uid)
        const snap = await getDoc(ref)
        if(snap.exists()) setProfile(snap.data())
        else setProfile(null)
      } else setProfile(null)
      setLoading(false)
    })
    return ()=> unsub()
  },[])

  const register = async ({email,password,role,displayName})=>{
    const res = await createUserWithEmailAndPassword(auth,email,password)
    await sendEmailVerification(res.user)
    const userRef = doc(db,'users',res.user.uid)
    await setDoc(userRef, {email, role, displayName, createdAt: new Date().toISOString(), approved: role==='student' ? true : false})
    return res
  }
  const login = async (email,password) => await signInWithEmailAndPassword(auth,email,password)
  const signInWithGoogle = async (role='student')=>{
    const provider = new GoogleAuthProvider(); const res = await signInWithPopup(auth,provider)
    const userRef = doc(db,'users',res.user.uid); const snap = await getDoc(userRef)
    if(!snap.exists()) await setDoc(userRef, {email:res.user.email, role, displayName:res.user.displayName, createdAt: new Date().toISOString(), approved: role==='student'})
    return res
  }
  const logout = async ()=> await signOut(auth)
  return {user, profile, loading, register, login, logout, signInWithGoogle}
}
