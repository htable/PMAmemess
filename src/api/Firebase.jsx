    import { useEffect } from 'react';
    import { initializeApp } from 'firebase/app';
    import { getDatabase, ref, get } from 'firebase/database';

    const firebaseConfig = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
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
