import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';
import type {ReadDirItem} from 'react-native-fs';

type MMKVType = {
  localImages: ReadDirItem[];
};

const MMKV = new MMKVLoader()
  .withInstanceID('9r7ohuheroas')
  .withEncryption()
  .initialize();

export const useStorage = <T extends keyof MMKVType>(
  key: T,
  defaultValue?: MMKVType[T],
) => useMMKVStorage<MMKVType[T]>(key, MMKV, defaultValue);
