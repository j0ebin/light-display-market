import { supabase } from '@/integrations/supabase/client';

export const testRatingFunctionality = async (displayId: string, userId: string) => {
  console.log('Starting rating functionality test...');

  try {
    // Test 1: Add a valid rating (1-5)
    const { data: rating1, error: ratingError1 } = await supabase
      .from('display_ratings')
      .insert([
        {
          display_id: displayId,
          user_id: userId,
          rating: 4
        }
      ])
      .select();

    if (ratingError1) throw ratingError1;
    console.log('✅ Valid rating added:', rating1);

    // Test 2: Try to add an invalid rating (>5)
    const { data: rating2, error: ratingError2 } = await supabase
      .from('display_ratings')
      .insert([
        {
          display_id: displayId,
          user_id: userId,
          rating: 6
        }
      ])
      .select();

    if (ratingError2) {
      console.log('✅ Invalid rating correctly rejected:', ratingError2.message);
    }

    // Test 3: Check if average rating was updated
    const { data: updatedDisplay, error: updateError } = await supabase
      .from('displays')
      .select('rating')
      .eq('id', displayId)
      .single();

    if (updateError) throw updateError;
    console.log('✅ Average rating updated:', updatedDisplay.rating);

    // Test 4: Update existing rating
    const { data: rating3, error: ratingError3 } = await supabase
      .from('display_ratings')
      .update({ rating: 5 })
      .eq('display_id', displayId)
      .eq('user_id', userId)
      .select();

    if (ratingError3) throw ratingError3;
    console.log('✅ Rating updated:', rating3);

    // Test 5: Check if average rating was updated after modification
    const { data: finalDisplay, error: finalError } = await supabase
      .from('displays')
      .select('rating')
      .eq('id', displayId)
      .single();

    if (finalError) throw finalError;
    console.log('✅ Final average rating:', finalDisplay.rating);

    console.log('All tests completed successfully! 🎉');
    return finalDisplay.rating;
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
};

export const cleanupTestData = async () => {
  console.log('Cleaning up test data...');

  try {
    // Delete test display (cascade will remove ratings)
    const { error: deleteError } = await supabase
      .from('displays')
      .delete()
      .eq('name', 'Test Display');

    if (deleteError) throw deleteError;
    console.log('✅ Test data cleaned up successfully');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}; 