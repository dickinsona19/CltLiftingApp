import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInUser } from '../actions/User';

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

interface UserContextType {
  user: User | null;
  updateUser: (data: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
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

  const updateUser = (data: Partial<User>) => {
    setUser(data as User);
    console.log(data)
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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