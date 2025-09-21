
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import app from '../Firebase/firebase.config';
import AuthContext from '../Contexts/AuthContext';


const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // Store current user info
  console.log(user)
  const [loading, setLoading] = useState(false);  // Track in-flight auth operations (login/register/logout)
  const [initializing, setInitializing] = useState(true); // Track initial auth state check only
  const provider = new GoogleAuthProvider();
  // Monitor authentication state changes (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      setUser(loggedUser);    // Update user state
      setInitializing(false); // Initial auth state resolved
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);
	
	//Your features here ...
    // Register new user with email and password
  const registerWithEmailPassword = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .finally(() => setLoading(false));
  };

  // Update user profile name and photo
  const updateUserProfile = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

//   Login with email and password 
  const loginWithEmailPassword =(email,password)=>{
    setLoading(true)
    return signInWithEmailAndPassword(auth,email,password)
      .finally(() => setLoading(false))
  }

//   Login with Google
  const handelLoginWithGoogle =()=>{
    setLoading(true)
    return signInWithPopup(auth,provider)
      .finally(() => setLoading(false))
  }

	
  // Sign out the current user
  const logout = () => {
    setLoading(true)
    return signOut(auth).finally(() => setLoading(false))
  };
  

  // Shared authentication context value
  const authInfo = { user,setUser, loading, logout, registerWithEmailPassword, updateUserProfile,loginWithEmailPassword,handelLoginWithGoogle };
  
  // Show loading spinner while loading
  if (initializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-surface)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Provide authentication info to child components
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;


