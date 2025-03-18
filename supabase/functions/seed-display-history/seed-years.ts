
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export const displayYearsData = [
  {
    display_id: 1,
    year: 2020,
    description: 'Our first year with a simple static display featuring classic Christmas lights and a few inflatables.'
  },
  {
    display_id: 1,
    year: 2021,
    description: 'Added synchronized music through an FM transmitter and basic light sequencing.'
  },
  {
    display_id: 1,
    year: 2022,
    description: 'Upgraded to full xLights sequencing with over 20,000 pixels and custom props.'
  },
  {
    display_id: 1,
    year: 2023,
    description: 'Expanded the display to include a 20-foot mega tree, singing faces, and interactive elements.'
  }
];

export const seedDisplayYears = async (supabase: SupabaseClient, displayId: number) => {
  // Insert years
  const { data: years, error: yearsError } = await supabase
    .from('display_years')
    .insert(displayYearsData)
    .select();

  if (yearsError) {
    throw yearsError;
  }

  return years || [];
};
