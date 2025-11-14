// Firebase Functions – enterprise acceptAdmission with server-side checks
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.acceptAdmission = functions.https.onRequest(async (req, res) => {
  try{
    const { applicationId, instituteAdminUid } = req.body;
    if(!applicationId) return res.status(400).json({ok:false,message:'applicationId required'});
    const appRef = db.collection('applications').doc(applicationId);
    const appSnap = await appRef.get();
    if(!appSnap.exists) return res.status(404).json({ok:false,message:'application not found'});
    const application = appSnap.data();
    const adminProfileSnap = await db.collection('users').doc(instituteAdminUid).get();
    if(!adminProfileSnap.exists) return res.status(403).json({ok:false,message:'admin profile not found'});
    const adminData = adminProfileSnap.data();
    if(adminData.role !== 'institute' || adminData.institutionId !== application.institutionId){
      return res.status(403).json({ok:false,message:'not authorized'});
    }
    await appRef.update({status:'accepted', acceptedAt: admin.firestore.FieldValue.serverTimestamp()});
    const q = db.collection('applications').where('studentId','==', application.studentId).where('status','==','submitted');
    const snap = await q.get();
    const batch = db.batch();
    snap.forEach(docSnap=>{
      if(docSnap.id !== applicationId){
        batch.update(docSnap.ref, {status:'cancelled', cancelledReason:'Accepted elsewhere', cancelledAt: admin.firestore.FieldValue.serverTimestamp()});
      }
    });
    await batch.commit();
    await db.collection('notifications').add({studentId: application.studentId, message:`Your application to course ${application.courseId} was accepted at institution ${application.institutionId}`, createdAt: admin.firestore.FieldValue.serverTimestamp(), read:false})
    return res.json({ok:true})
  }catch(e){ console.error(e); return res.status(500).json({ok:false,message:e.message}) }
});
