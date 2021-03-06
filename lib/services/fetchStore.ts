import {
  DB,
  FirebaseConfiguration,
  HttpClient,
  Maybe,
  StoreState,
  User,
} from '@self/lib/types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import mapDBToState from '../data/mapDBtoState';

try {
  firebase.initializeApp((process.env.firebase as unknown) as FirebaseConfiguration);
} catch {}

let defaultStoreState: StoreState = {
  user: null,
  projects: [],
  settings: { useDarkMode: false, reduceMotion: false },
  lastUpdated: 0,
};

async function fetchStore(
  user: Maybe<User>,
  client: HttpClient = (firebase as unknown) as HttpClient,
): Promise<StoreState> {
  if (user) {
    return client
      .database()
      .ref(`/users/${user.uid}`)
      .once('value')
      .then((snapshot) => {
        let data: DB = snapshot.val();
        let mappedData = mapDBToState(data, user);
        return { ...mappedData, user };
      });
  } else {
    return defaultStoreState;
  }
}

export default fetchStore;
