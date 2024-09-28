import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRandomCat } from '../api/catApi';
import CatImage from '../components/CatImage';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [autoSwipe, setAutoSwipe] = useState(false);

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
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">ランダム猫画像ジェネレーター</h1>
      
      <Select onValueChange={handleMoodChange} value={selectedMood}>
        <SelectTrigger className="w-full max-w-[280px] mb-4">
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

      <div {...handlers} className="w-full max-w-md mx-auto mb-4">
        {isLoading ? (
          <p className="text-xl text-gray-600 text-center">読み込み中...</p>
        ) : isError ? (
          <p className="text-xl text-red-600 text-center">画像の読み込みに失敗しました。もう一度お試しください。</p>
        ) : (
          <CatImage imageUrl={catData?.url} />
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Button
          onClick={handleRefresh}
          className="flex items-center justify-center"
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          新しい猫を表示
        </Button>
        <Button
          onClick={() => setAutoSwipe(!autoSwipe)}
          className={`flex items-center justify-center ${autoSwipe ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          {autoSwipe ? '自動スワイプを停止' : '自動スワイプを開始'}
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-600 text-center">左右にスワイプして新しい画像を表示</p>
    </div>
  );
};

export default Index;