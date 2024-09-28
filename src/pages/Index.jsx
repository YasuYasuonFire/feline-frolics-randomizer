import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRandomCat, getCatBreeds } from '../api/catApi';
import CatImage from '../components/CatImage';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const [selectedBreed, setSelectedBreed] = useState('');

  const { data: breeds } = useQuery({
    queryKey: ['catBreeds'],
    queryFn: getCatBreeds,
  });

  const { data: catData, refetch, isLoading, isError } = useQuery({
    queryKey: ['randomCat', selectedBreed],
    queryFn: () => getRandomCat(selectedBreed),
    refetchOnWindowFocus: false,
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleBreedChange = (value) => {
    setSelectedBreed(value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Random Cat Image Generator</h1>
      
      <Select onValueChange={handleBreedChange} value={selectedBreed}>
        <SelectTrigger className="w-[280px] mb-4">
          <SelectValue placeholder="Select a cat breed" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Breeds</SelectItem>
          {breeds?.map((breed) => (
            <SelectItem key={breed.id} value={breed.id}>
              {breed.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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