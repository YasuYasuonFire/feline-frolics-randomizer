import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRandomCat, getCatBreeds } from '../api/catApi';
import CatImage from '../components/CatImage';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState('');

  const { data: catData, refetch, isLoading, isError } = useQuery({
    queryKey: ['randomCat', selectedMood],
    queryFn: () => getRandomCat(selectedMood),
    refetchOnWindowFocus: false,
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleMoodChange = (value) => {
    setSelectedMood(value);
  };

  const moodOptions = [
    { value: 'kitten', label: '子猫' },
    { value: 'cute', label: 'かわいい' },
    { value: 'strong', label: 'たくましい' },
    { value: 'all', label: 'すべて' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">ランダム猫画像ジェネレーター</h1>
      
      <Select onValueChange={handleMoodChange} value={selectedMood}>
        <SelectTrigger className="w-[280px] mb-4">
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

      {isLoading ? (
        <p className="text-xl text-gray-600">読み込み中...</p>
      ) : isError ? (
        <p className="text-xl text-red-600">画像の読み込みに失敗しました。もう一度お試しください。</p>
      ) : (
        <CatImage imageUrl={catData?.url} />
      )}
      <Button
        onClick={handleRefresh}
        className="mt-8 flex items-center"
        disabled={isLoading}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        新しい猫を表示
      </Button>
    </div>
  );
};

export default Index;