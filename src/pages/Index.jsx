import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRandomCat } from '../api/catApi';
import CatImage from '../components/CatImage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSwipeable } from 'react-swipeable';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [autoSwipe, setAutoSwipe] = useState(true);

  const { data: catData, refetch, isLoading, isError } = useQuery({
    queryKey: ['randomCat', selectedMood],
    queryFn: () => getRandomCat(selectedMood),
    refetchOnWindowFocus: false,
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleMoodChange = (value) => {
    setSelectedMood(value);
  };

  const moodOptions = [
    { value: 'kitten', label: '子猫' },
    { value: 'cute', label: 'かわいい' },
    { value: 'strong', label: 'たくましい' },
    { value: 'all', label: 'すべて' },
  ];

  const handlers = useSwipeable({
    onSwipedLeft: handleRefresh,
    onSwipedRight: handleRefresh,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    let interval;
    if (autoSwipe) {
      interval = setInterval(() => {
        handleRefresh();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoSwipe, handleRefresh]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
        Neko Snap
      </h1>
      
      <Select onValueChange={handleMoodChange} value={selectedMood}>
        <SelectTrigger className="w-full max-w-[280px] mb-4 bg-white rounded-full shadow-md">
          <SelectValue placeholder="猫の雰囲気を選択" />
        </SelectTrigger>
        <SelectContent>
          {moodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div {...handlers} className="w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-xl text-gray-600">読み込み中...</p>
          </div>
        ) : isError ? (
          <div className="w-full h-64 md:h-96 bg-red-100 flex items-center justify-center">
            <p className="text-xl text-red-600">エラーが発生しました。再試行してください。</p>
          </div>
        ) : (
          <CatImage imageUrl={catData?.url} />
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        {autoSwipe ? '自動スワイプ中...' : '左右にスワイプして新しい画像を表示'}
      </p>
    </div>
  );
};

export default Index;