// const {initializeApp} = require('firebase/app');
// const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, set, child } = require('firebase/database');


const firebaseConfig = {
    apiKey: "AIzaSyA9zuqprNh0wcVTvhiGlObXwSZBO_l9KWk",
    authDomain: "iot-dustbin-management-system.firebaseapp.com",
    databaseURL: "https://iot-dustbin-management-system-default-rtdb.firebaseio.com",
    projectId: "iot-dustbin-management-system",
    storageBucket: "iot-dustbin-management-system.appspot.com",
    messagingSenderId: "1081260377780",
    appId: "1:1081260377780:web:bebef46e1e8d29de7f79e1",
    measurementId: "G-X6KEJ0S7BE"
  };

const initializeFirebaseApp=()=>{
    try{
        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        console.log("Firebase Connected....");
        return db;
    }

    catch(err){
        console.log("Error intialising Firebase....");
        console.log(err);
       return { error : true, msg : err};
    }
}

// const db = initializeFirebaseApp();
// const get_sensor_data =async ()=>{
//     const sensor_data = collection(db, 'sensor_data');
//     const values = await getDocs(sensor_data);
//     const filled_avg_values = values.docs.map(doc => doc.data());
//     return filled_avg_values;
// }

const db = initializeFirebaseApp();

module.exports = {
  db
}