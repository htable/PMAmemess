    import { useEffect } from 'react';
    import { initializeApp } from 'firebase/app';
    import { getDatabase, ref, get } from 'firebase/database';

    const firebaseConfig = {
  apiKey: "AIzaSyDGy0zwzrfsyTi1wEMm1LmWUalX7YkTQHo",
  authDomain: "pmamemes-4f920.firebaseapp.com",
  databaseURL: "https://pmamemes-4f920-default-rtdb.firebaseio.com",
  projectId: "pmamemes-4f920",
  storageBucket: "pmamemes-4f920.appspot.com",
  messagingSenderId: "494369984268",
  appId: "1:494369984268:web:9422089873a60ecb318329"
    };

    function FirebaseConnector() {
        useEffect(() => {
            const firebaseApp = initializeApp(firebaseConfig);
            const db = getDatabase(firebaseApp);
            const dbRef = ref(db);

            get(dbRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                    } else {
                        console.log('No data available');
                    }
                })
                .catch((error) => {
                    console.error('Error getting data:', error);
                });
        }, []); // Asegúrate de incluir un array vacío como segundo argumento para useEffect


        // Asegúrate de devolver algo aquí si es necesario
        return null;
    }

    export default FirebaseConnector;
