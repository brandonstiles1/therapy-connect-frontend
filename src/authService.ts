import { Auth } from '@aws-amplify/auth';

Auth.configure({
  userPoolId: process.env.USER_POOL_ID,
  userPoolWebClientId: process.env.USER_POOL_WEBCLIENT_ID,
  region: process.env.AWS_REGION
});

export const signIn = async (username: string, password: string) => {
  try {
    const user = await Auth.signIn(username, password);
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};