import { supabase } from '../lib/supabase';

export const toggleFavorite = async (imageId, isFavorite) => {
  const { data, error } = await supabase
    .from('favorites')
    .upsert(
      { image_id: imageId, is_favorite: !isFavorite },
      { onConflict: 'image_id' }
    );

  if (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
  return true;
};

export const getFavoriteStatus = async (imageId) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('is_favorite')
    .eq('image_id', imageId)
    .single();

  if (error) {
    console.error('Error getting favorite status:', error);
    return false;
  }
  return data ? data.is_favorite : false;
};