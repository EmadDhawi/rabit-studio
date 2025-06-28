"use client";

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, limit, doc } from 'firebase/firestore';
import type { Brand, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  brand: Brand | null;
  brandLoading: boolean;
  userProfile: UserProfile | null;
  userProfileLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [brand, setBrand] = React.useState<Brand | null>(null);
  const [brandLoading, setBrandLoading] = React.useState(true);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [userProfileLoading, setUserProfileLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = userProfile?.isAdmin || false;

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        setBrand(null);
        setBrandLoading(true);
        setUserProfile(null);
        setUserProfileLoading(true);
      }
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (user) {
        setBrandLoading(true);
        const q = query(collection(db, 'brands'), where('owner', '==', user.uid), limit(1));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
            const brandData = snapshot.docs[0].data() as Omit<Brand, 'id'>;
            setBrand({ id: snapshot.docs[0].id, ...brandData });
            } else {
            setBrand(null);
            }
            setBrandLoading(false);
        }, (error) => {
            console.error("Error fetching brand: ", error);
            setBrand(null);
            setBrandLoading(false);
        });
        return () => unsubscribe();
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      setUserProfileLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserProfile({ id: doc.id, ...doc.data() } as UserProfile);
        } else {
          setUserProfile(null);
        }
        setUserProfileLoading(false);
      }, (error) => {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
        setUserProfileLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  React.useEffect(() => {
    if (loading || (user && (brandLoading || userProfileLoading))) return;

    const isAuthPage = pathname === '/';
    const isCreateBrandPage = pathname === '/create-brand';
    
    if (!user && !isAuthPage) {
      router.push('/');
      return;
    }
    
    if (user && userProfile) {
        if (isAdmin) {
            if (isAuthPage || isCreateBrandPage) {
                router.push('/admin/brands');
            }
        } else {
            if (!brand && !isCreateBrandPage) {
                router.push('/create-brand');
                return;
            }
            if (brand && (isAuthPage || isCreateBrandPage)) {
                router.push('/orders');
                return;
            }
        }
    }

  }, [user, brand, loading, brandLoading, userProfile, userProfileLoading, isAdmin, router, pathname]);
  

  if ((loading || (user && (brandLoading || userProfileLoading))) && pathname !== '/') {
    return (
        <div className="flex h-screen w-full flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-full w-full" />
            </main>
        </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, brand, brandLoading, userProfile, userProfileLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
