import React, { createContext, useContext, useState, useEffect } from 'react';


interface Membership {
  id: number;
  name: string;
  price: string;
  chargeInterval: string;
}

interface ReferredUser {
  id: number;
  firstName: string;
  lastName: string;
  referralCode: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  isInGoodStanding: boolean;
  createdAt: string;
  entryQrcodeToken: string;
  userStripeMemberId: string | null; 
  userTitles: null; 
  profilePicture: string;
  signatureData: string;
  membership: Membership | null;
  referralCode: string;
  referredMembersDto: ReferredUser[]; 
}
interface UserMediaDTO {
  profilePicture: string | null;
  signatureData: string | null;
  waiverSignedDate: string | null;
}
interface UserContextType {
  user: User | null;
  userMedia: UserMediaDTO | null;
  updateUser: (data: Partial<User>) => void;
  fetchUserMedia: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
const BASE_URL = 'https://boss-lifting-club-api.onrender.com';
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userMedia, setUserMedia] = useState<UserMediaDTO | null>(null);
   const [user, setUser] = useState<User | null>(null
 
  // {
  //   id: 3,
  //   firstName: "Andrew",
  //   lastName: "Dickinson",
  //   password: "$2a$10$gQIe4p9PKbFR/XKwfIxeCegGBEnnmSSMBLvWNsp2gBQzTYqi3cWDe",
  //   phoneNumber: "8124473167",
  //   isInGoodStanding: false,
  //   createdAt: "2025-03-11T20:15:14.492854",
  //   entryQrcodeToken: "1L2QAO6E7S",
  //   userStripeMemberId: null,
  //   userTitles: null,
  //   profilePicture: "path_to_image",
  //   signatureData: "signature_data",
  //   membership: null,
  //   referralCode: "referral_code",
  //   referredMembersDto: [],
  // }
);

  // useEffect(() => {
  //   const signIn = async () => {
  //     try {
  //       const userData = await signInUser('phoneNumber', 'password');
  //       console.log(userData)
  //       setUser(userData);
  //     } catch (error) {
  //       console.error('Sign in error:', error);
  //     }
  //   };

  //   signIn();
  // }, []);

  useEffect(() => {
    console.log('User changed:', user);
    fetchUserMedia()
  }, [user]);
  const fetchUserMedia = async () => {
    if (!user?.id) {
      console.log('No user ID available to fetch media');
      setUserMedia(null); // Clear userMedia if no user is present
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users/${user.id}/media`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user media');
      }

      const mediaData: UserMediaDTO = await response.json();
      setUserMedia(mediaData);

    } catch (error) {
      console.error('Error fetching user media:', error);
      setUserMedia(null); // Clear userMedia on error
    }
  };
  const updateUser = (data: Partial<User>) => {
    setUser(data as User);
    console.log(data)
  };
const refreshUser = async () => {
    const res = await fetch(`${BASE_URL}/users/${user?.id}`);
    const updatedUser = await res.json();
    console.log('Heroo'+updatedUser)
    setUser(updatedUser);
  };
  return (
<UserContext.Provider value={{ user, userMedia, updateUser, fetchUserMedia, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}


export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};