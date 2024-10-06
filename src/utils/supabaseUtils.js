import { supabase } from '../lib/supabase';

// お気に入りをトグルする関数
export const toggleFavorite = async (imageId, isFavorite) => {
  // const { data, error } = await supabase
  //   .from('favorites')
  //   .upsert(
  //     { image_id: imageId, is_favorite: !isFavorite },
  //     { onConflict: 'image_id' }
  //   );

  // if (error) {
  //   console.error('Error toggling favorite:', error);
  //   return false;
  // }
  return true; // 一時的に常に成功を返す
};

// お気に入りのステータスを取得する関数
export const getFavoriteStatus = async (imageId) => {
  // const { data, error } = await supabase
  //   .from('favorites')
  //   .select('is_favorite')
  //   .eq('image_id', imageId)
  //   .single();

  // if (error) {
  //   if (error.code === 'PGRST116') {
  //     return false; // 行が存在しない場合は、デフォルトでfalseを返す
  //   }
  //   console.error('Error getting favorite status:', error);
  //   return false;
  // }
  return false; // 一時的に常にfalseを返す
};