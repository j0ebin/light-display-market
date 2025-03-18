
export const createMediaData = (years: any[]) => {
  return years.flatMap((year, index) => [
    {
      display_year_id: year.id,
      type: 'image',
      url: `https://images.unsplash.com/photo-${1570000000 + index}?q=80&w=1080`,
      description: `Display photo from ${year.year}`
    },
    // Add a video for years after 2021
    ...(year.year >= 2022 ? [{
      display_year_id: year.id,
      type: 'video',
      url: 'https://www.youtube.com/embed/YEHIkcAXP9Y',
      description: `Light show video from ${year.year}`
    }] : [])
  ]);
};
