import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRandomCat } from '../api/catApi';
import CatImage from '../components/CatImage';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const { data: catData, refetch, isLoading, isError } = useQuery({
    queryKey: ['randomCat'],
    queryFn: getRandomCat,
    refetchOnWindowFocus: false,
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Random Cat Image Generator</h1>
      {isLoading ? (
        <p className="text-xl text-gray-600">Loading...</p>
      ) : isError ? (
        <p className="text-xl text-red-600">Error loading cat image. Please try again.</p>
      ) : (
        <CatImage imageUrl={catData?.url} />
      )}
      <Button
        onClick={handleRefresh}
        className="mt-8 flex items-center"
        disabled={isLoading}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Get New Cat
      </Button>
    </div>
  );
};

export default Index;