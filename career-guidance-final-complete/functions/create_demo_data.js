// create_demo_data.js - run with GOOGLE_APPLICATION_CREDENTIALS set
const admin = require('firebase-admin')
admin.initializeApp()
const auth = admin.auth()
const db = admin.firestore()
async function run(){
  const institutes = [
    { email: 'limkokwing0@gmail.com', password: '123456', name: 'Limkokwing University' },
    { email: 'bothounivesity01@gmail.com', password: '123456', name: 'Bothou University' },
    { email: 'nationalunivesityoflesotho010@gmail.com', password: '123456', name: 'National University of Lesotho' }
  ]
  for(const inst of institutes){
    try{
      let userRecord
      try{ userRecord = await auth.getUserByEmail(inst.email) } catch(e){ userRecord = await auth.createUser({email:inst.email, password: inst.password, displayName: inst.name}) }
      const instRef = db.collection('institutions').doc()
      await instRef.set({name: inst.name, approved:true, createdBy: inst.email, adminUid: userRecord.uid, faculties:['Science','Business']})
      await db.collection('users').doc(userRecord.uid).set({email:inst.email, role:'institute', displayName:inst.name, institutionId: instRef.id, approved:true})
      console.log('seeded', inst.email)
    }catch(e){ console.error('error', e.message) }
  }
  process.exit(0)
}
run()
