import React, { useState, useEffect } from 'react';
import { getDatabase, ref, update, remove, onValue } from 'firebase/database';
import './AdminBoard.css';

const AdminBoard = ({ handleLogout }) => {
  const [memes, setMemes] = useState([]);
  const [approvedMemes, setApprovedMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const db = getDatabase();
        const memesRef = ref(db, 'memes');
        onValue(memesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Filter only unapproved memes
            const approvedMemes = Object.values(data).filter((meme) => !meme.approved);
            setApprovedMemes(approvedMemes);
            setMemes(approvedMemes);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching memes:', error);
      }
    };
    fetchMemes();
  }, []);

  const approveMeme = (meme) => {
    const db = getDatabase();
    const memeRef = ref(db, `memes/${meme.id}`);
    update(memeRef, { approved: true })
      .then(() => {
        console.log('Meme approved:', meme.id);
        // Filter out the approved meme from the state
        setMemes(memes.filter((m) => m.id !== meme.id));
      })
      .catch((error) => {
        console.error('Error approving meme:', error);
      });
  };

  const deleteMeme = (meme) => {
    const db = getDatabase();
    const memeRef = ref(db, `memes/${meme.id}`);
    remove(memeRef)
      .then(() => {
        console.log('Meme deleted:', meme.id);
        // Filter out the deleted meme from the state
        setMemes(memes.filter((m) => m.id !== meme.id));
      })
      .catch((error) => {
        console.error('Error deleting meme:', error);
      });
  };

  return (
    <div id="AdminBoardContent">
      <div id="admin-board-header">
        <h1 id="AdminBoardTittle" className="text-xl text-green-500">
          Admin Board
        </h1>
        <button className="text-xl text-green-500" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        approvedMemes.map((meme) => (
          <div key={meme.id} id="AdminScrollView">
            <div className="relative">
              <img
                src={`data:image/jpeg;base64,${meme.image}`}
                alt="PMA memes"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'default-image.jpg';
                }}
              />
              <p
                id="AuthorString"
                className="-translate-y-10 absolute bottom-0 left-0 right-0 bg-black text-white text-center opacity-75"
              >{`Autor: ${meme.author}`}</p>
            </div>
            <button
              id="Approve"
              className="bg-green-400 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => approveMeme(meme)}
            >
              Approve
            </button>
            <button
              id="Delete"
              className="bg-red-400 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => deleteMeme(meme)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminBoard;