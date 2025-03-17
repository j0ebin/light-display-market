
export interface Owner {
  id: number;
  name: string;
  avatar: string;
  biography: string;
  joinedDate: string;
  location: string;
  displayCount: number;
  sequenceCount: number;
  socialLinks?: {
    website?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };
}
