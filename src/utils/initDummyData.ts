
import { supabase } from '@/integrations/supabase/client';
import { generateDummySequences } from './generateDummySequences';

// Key to track if we've already generated data in this session
const DUMMY_DATA_GENERATED = 'dummy_sequences_generated';

export const initDummyData = async () => {
  try {
    // Check if we've already generated data
    if (localStorage.getItem(DUMMY_DATA_GENERATED) === 'true') {
      console.log('Dummy sequences already generated, skipping');
      return;
    }

    // Check if there are already sequences in the database
    const { data: existingSongs, error } = await supabase
      .from('display_songs')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error checking for existing sequences:', error);
      return;
    }

    // If no sequences, generate them
    if (!existingSongs || existingSongs.length === 0) {
      console.log('No sequences found, generating dummy data...');
      
      const result = await generateDummySequences();
      
      if (result.success) {
        console.log('Successfully generated dummy sequences:', result.message);
        localStorage.setItem(DUMMY_DATA_GENERATED, 'true');
      } else {
        console.error('Failed to generate dummy sequences:', result.message);
      }
    } else {
      console.log('Sequences already exist in database, skipping generation');
      localStorage.setItem(DUMMY_DATA_GENERATED, 'true');
    }
  } catch (error) {
    console.error('Error in initDummyData:', error);
  }
};
