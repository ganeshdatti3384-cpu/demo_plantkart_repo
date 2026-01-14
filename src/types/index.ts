
export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  citizenship: string;
  passport?: string;
  residentialAddress?: string;
  country?: string;
  hasVisa?: 'Yes' | 'No';
  visaType?: string;
  visaTenure?: string;
  isStudent?: 'Yes' | 'No';
  universityName?: string;
  course?: string;
  collegeAddress?: string;
};
