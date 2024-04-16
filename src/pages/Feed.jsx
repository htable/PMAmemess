import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import './Feed.css';

const LikeIcon = ({ isLiked, onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={isLiked ? 'red' : 'currentColor'}
    width="1em"
    height="1em"
    onClick={onClick}
  >
    <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z" />
  </svg>
);

const Feed = () => {
  const [memes, setMemes] = useState([]);
  const [approvedMemes, setApprovedMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageCache, setImageCache] = useState({});
  const [ipLikes, setIpLikes] = useState({});

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const db = getDatabase();
        const memesRef = ref(db, 'memes');
        onValue(memesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Filter only approved memes
            const approvedMemes = Object.values(data).filter((meme) => meme.approved);
            // Sort memes by likes in descending order
            const sortedMemes = approvedMemes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            setApprovedMemes(sortedMemes);

            // Set the state with the sorted memes
            setMemes(sortedMemes);
            setIsLoading(false);

            // Preload the images
            const preloadImages = async () => {
              const cache = {};
              for (const meme of sortedMemes) {
                const img = new Image();
                img.src = meme.imageUrl;
                await new Promise((resolve) => {
                  img.onload = resolve;
                });
                cache[meme.id] = img.src;
              }
              setImageCache(cache);
            };
            preloadImages();
          }
        });
      } catch (error) {
        console.error('Error fetching memes:', error);
      }
    };
    fetchMemes();
  }, []);

  const handleLike = (memeId) => {
    const db = getDatabase();
    const memeRef = ref(db, `memes/${memeId}`);
    const ipAddress = '192.168.1.100'; // Replace with the user's IP address

    // Check if the user has already liked the meme
    if (ipLikes[`${memeId}-${ipAddress}`]) {
      // Decrement the likes count
      update(memeRef, {
        likes: (approvedMemes.find((m) => m.id === memeId)?.likes || 0) - 1,
      });
      setIpLikes({ ...ipLikes, [`${memeId}-${ipAddress}`]: false });
    } else {
      // Increment the likes count
      update(memeRef, {
        likes: (approvedMemes.find((m) => m.id === memeId)?.likes || 0) + 1,
      });
      setIpLikes({ ...ipLikes, [`${memeId}-${ipAddress}`]: true });
    }
  };

  return (
    <div className="feed">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Display the top 2 most liked memes */}
          <div className="most-liked">
            {approvedMemes.slice(0, 2).map((meme) => (
              <div key={meme.id} className="meme-card">
                <img
                  src={`data:image/jpeg;base64,${meme.image}`}
                  alt={meme.author}
                  className="meme-image"
                />
                <div id="like-buttons">
                  <p id="authorFeed">Author: {meme.author}</p>
                  <LikeIcon
                    isLiked={ipLikes[`${meme.id}-192.168.1.100`]}
                    onClick={() => handleLike(meme.id)}
                  />
                  {meme.likes ? meme.likes : 0}
                </div>
              </div>
            ))}
          </div>

          {/* Display the rest of the memes in order from most recent to oldest */}
          <div className="other-memes">
            {approvedMemes.slice(2).map((meme) => (
              <div key={meme.id} className="meme-card">
                <img
                  src={`data:image/jpeg;base64,${meme.image}`}
                  alt={meme.author}
                  className="meme-image"
                />
                <div id="like-buttons">
                  <p id="authorFeed">Author: {meme.author}</p>
                  <LikeIcon
                    isLiked={ipLikes[`${meme.id}-192.168.1.100`]}
                    onClick={() => handleLike(meme.id)}
                  />
                  {meme.likes ? meme.likes : 0}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Feed;