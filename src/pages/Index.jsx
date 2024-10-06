import React, { useState, useCallback, useEffect, useRef } from 'react';
import { getRandomCat, getCatBreedsByImageId } from '../api/catApi';
import CatImage from '../components/CatImage';
import { useSwipeable } from 'react-swipeable';
import FavoriteButton from '../components/FavoriteButton';
import { toggleFavorite } from '../utils/supabaseUtils';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [catDataList, setCatDataList] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [key, setKey] = useState(0);
  const timerRef = useRef(null);
  const [preferredBreeds, setPreferredBreeds] = useState('');

  const fetchCats = useCallback(async () => {
    console.log('Fetching cats with preferred breeds:', preferredBreeds);
    const cats = await Promise.all([getRandomCat(preferredBreeds), getRandomCat(preferredBreeds)]);
    console.log('Fetched cats:', cats);
    setKey(prevKey => prevKey + 1);
    setCatDataList(cats);
  }, [preferredBreeds]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setPreferredBreeds(''); // preferredBreedsをリセット
      fetchCats();
    }, 5000); // 5秒後に遷移
  }, [fetchCats]);

  const handleImageError = useCallback(() => {
    fetchCats();
  }, [fetchCats]);

  const handlers = useSwipeable({
    onSwipedLeft: fetchCats,
    onSwipedRight: fetchCats,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    fetchCats();
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [fetchCats, resetTimer]);

  const handleFavoriteToggle = async (catData) => {
    console.log('handleFavoriteToggle called with:', catData);

    const newFavorites = { ...favorites };
    newFavorites[catData.id] = !newFavorites[catData.id];
    setFavorites(newFavorites);
    await toggleFavorite(catData.id, newFavorites[catData.id]);
    
    console.log('Is favorite now:', newFavorites[catData.id]);

    if (newFavorites[catData.id]) {
      console.log('Attempting to fetch breeds for image:', catData.id);
      try {
        const breeds = await getCatBreedsByImageId(catData.id);
        console.log('Fetched breeds:', breeds);
        if (breeds && breeds.length > 0) {
          setPreferredBreeds(prevBreeds => {
            const newBreeds = new Set(prevBreeds ? prevBreeds.split(',') : []);
            breeds.forEach(breed => newBreeds.add(breed.id));
            const updatedBreeds = Array.from(newBreeds).join(',');
            console.log('Updated preferred breeds:', updatedBreeds);
            return updatedBreeds;
          });
        } else {
          console.log('No breeds found for this image');
        }
      } catch (error) {
        console.error('Error fetching breeds for image:', error);
      }
    } else {
      console.log('Image unfavorited, not fetching breeds');
    }
    
    fetchCats();
    resetTimer();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
        Neko Snap
      </h1>

      <div {...handlers} className="w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden shadow-lg touch-pan-y">
        {catDataList.length === 0 ? (
          <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-xl text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              key={key}
              className="flex justify-between"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {catDataList.map((catData, index) => (
                <div key={index} className="relative w-1/2 p-2">
                  {catData && catData.url ? (
                    <CatImage imageUrl={catData.url} onError={handleImageError} />
                  ) : (
                    <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
                      <p className="text-xl text-gray-600">画像が見つかりません</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton
                      isFavorite={favorites[catData.id] || false}
                      onClick={() => handleFavoriteToggle(catData)}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="text-center mb-4">
        <p className="text-lg font-semibold text-gray-700">好みの猫を選ぼう！</p>
        <p className="text-sm text-gray-600">あなた好みのニャンコが登場</p>
      </div>
    </div>
  );
};

export default Index;