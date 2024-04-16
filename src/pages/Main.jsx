import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import AdminButton from './AdminButton';
import './Main.css';
import Content from './Content';
import AsideLeft from './AsideLeft';
import AsideRight from './AsideRight';

const Main = () => {
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [memes, setMemes] = useState([]);
  const formRef = useRef(null);

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
  const MAX_AUTHOR_LENGTH = 10;

  useEffect(() => {
    const db = getDatabase();
    const memesRef = ref(db, 'memes');
    
    onValue(memesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMemes(Object.values(data));
      }
    });

    // Event listener to hide form when clicking outside of it
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUploadClick = () => {
    setShowForm(!showForm);
  };

  const handleAuthorChange = (event) => {
    const authorInput = event.target.value;
    if (authorInput.length > MAX_AUTHOR_LENGTH) {
      alert(`El nombre del autor no debe exceder ${MAX_AUTHOR_LENGTH} palabras.`);
      return;
    }
    setAuthor(authorInput);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      alert('El tamaño máximo de la imagen es 3MB. Por favor, sube una imagen más pequeña.');
      return;
    }
    setImage(file);

    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if an image has been selected
    if (!image) {
      alert('Debes subir un momo lince');
      return;
    }

    const db = getDatabase();
    const memesRef = ref(db, 'memes');
    const newMemeRef = push(memesRef);
    const newMemeKey = newMemeRef.key;

    // Convert the image to a base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];

      set(newMemeRef, {
        id: newMemeKey,
        author: author,
        image: base64String,
      })
        .then(() => {
          console.log('Momo uploaded successfully!');
          alert('Momo subido, pero lo revisaremos antes :v');
          setAuthor('');
          setImage(null);
          setPreviewImage(null);
          setShowForm(false);
        })
        .catch((error) => {
          console.error('Error uploading meme:', error);
          alert('Ocurrió un error al subir el meme. Por favor, intenta de nuevo.');
        });
    };
    reader.readAsDataURL(image);
  };

  return (
    <div id='MainLayout'>
      <header id="Header">
        <div id="MemeDiv">
          <h1 className="font-mono text-lg mx-auto">SUBE TU MEME</h1>
          <button id="UploadMeme" onClick={handleUploadClick}>
            <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
              <path d="M18.944 11.112C18.507 7.67 15.56 5 12 5 9.244 5 6.85 6.611 5.757 9.15 3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5h11c2.206 0 4-1.794 4-4a4.01 4.01 0 00-3.056-3.888zM13 14v3h-2v-3H8l4-5 4 5h-3z" />
            </svg>
          </button>
        </div>
      </header>
      {showForm && (
        <div id='showFrom' className="fixed flex justify-center items-center bg-gray-500 bg-opacity-50">
          <form ref={formRef} onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                Autor
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="author"
                type="text"
                placeholder={`Máximo ${MAX_AUTHOR_LENGTH} letras`}
                value={author}
                onChange={handleAuthorChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                Imagen
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImage && (
                <div id='prevImg' className="mt-4">
                  <h3 className="text-gray-700 font-bold mb-2">Vista previa:</h3>
                  <img src={previewImage} alt="Preview"/>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-green-400 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Subir Meme
              </button>
            </div>
          </form>
        </div>
      )}
       <AsideLeft/>
      <AsideRight/>
      <AdminButton />
      <Content/>
     
    </div>
  );
};

export default Main;