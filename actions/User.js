import AsyncStorage from '@react-native-async-storage/async-storage';

export const signInUser = async (phoneNumber, password) => {
    try {
      const response = await fetch('https://boss-lifting-club-api.onrender.com/users/signin', {
        method: 'POST',
        body: JSON.stringify({phoneNumber, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      console.log(data)
      if (data.token) {
        // Save token to AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
        return { success: true, token: data.token };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Sign-in error:', error);
      return { success: false, error };
    }
  };
  

  export const changeUserPassword = async (userId, newPassword) => {
    try {
      const response = await fetch('https://boss-lifting-club-api.onrender.com/users/password/'+userId, {
        method: 'PUT',
        body: JSON.stringify({password :newPassword}),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Pass")
  
      return;
    } catch (error) {
      console.error('Sign-in error:', error);
      return { success: false, error };
    }
  };

  export const signOutUser = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('User signed out successfully');
      return { success: true };
    } catch (error) {
      console.error('Sign-out error:', error);
      return { success: false, error };
    }
  };

  // Usage in a component
  const handleLogin = async () => {
    const result = await signIn('user@example.com', 'password123');
    if (result.success) {
      // Navigate to main app screen or update state
      console.log('Logged in with token:', result.token);
    }
  };