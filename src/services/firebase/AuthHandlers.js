import firebaseconfig from './index';
import firebase from 'firebase';

export const signUpwithEmailPWD = async (user) => {
  await firebase
    .auth()
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(async (res) => {
      const token = await Object.entries(res.user)[5][1].b;
      await localStorage.setItem('token', token);
      // console.log(
      //   `signUpwithEmailPWD(${JSON.stringify(user)}),\ntoken => ${token}`
      // );
      return token;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};
export const signInWithGoogle = async (user) => {
  console.log(`signInWithGoogle(${JSON.stringify(user)})`);
  return null;
};
export const signInWithFacebook = async (user) => {
  console.log(`signInWithFacebook(${JSON.stringify(user)})`);
  return null;
};

export const signInWithEmailPWD = async (user) => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    //everything is almost exactly the same as the function above
    .then(async (res) => {
      const token = await Object.entries(res.user)[5][1].b;
      //set token to localStorage
      await localStorage.setItem('token', token);
      console.log(
        `signInWithEmailPWD(${JSON.stringify(user)}),\ntoken => ${token}`
      );
      return token;
    })
    .catch((err) => {
      return err;
    });
};

export const logOut = async () => {
  firebase
    .auth()
    .signOut()
    .then((res) => {
      localStorage.removeItem('token');
    })
    .catch((err) => {
      localStorage.removeItem('token');
      console.error(err.message);
      return err;
    });
};
