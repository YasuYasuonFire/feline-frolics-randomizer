import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button"

const FavoriteButton = ({ isFavorite, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      className={`transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
    >
      <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
    </Button>
  );
};

export default FavoriteButton;