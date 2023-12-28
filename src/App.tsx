import React from 'react';
import {Button, FlatList, Image, StyleSheet, Text} from 'react-native';
import {useStorage} from './localstorage';
import imageList from './img.json';
import RNFS from 'react-native-fs';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import type {ListRenderItem} from 'react-native';

const styles = StyleSheet.create({
  img: {width: 200, height: 200, alignSelf: 'center'},
});

function Screen() {
  const insets = useSafeAreaInsets();
  const [localImages, setLocalImages] = useStorage('localImages', []);
  const topInset = {
    paddingTop: insets.top,
  };

  /**
   * Download all images to `CachesDirectoryPath`. Use `readDir` to get image files and save the list to local storage
   */
  const downloadImages = async () => {
    const promises = imageList.images.map(img => {
      const {promise} = RNFS.downloadFile({
        fromUrl: img,
        toFile: RNFS.CachesDirectoryPath + '/' + img.split('/').pop() + '.jpg',
      });
      return promise;
    });
    await Promise.allSettled(promises);
    const files = (await RNFS.readDir(RNFS.CachesDirectoryPath)).filter(f =>
      f.isFile(),
    );
    setLocalImages(files);
  };

  const removeImages = async () => {
    const promises = localImages.map(i => RNFS.unlink(i.path));
    await Promise.all(promises);
    setLocalImages([]);
  };

  const renderItem: ListRenderItem<RNFS.ReadDirItem> = ({item}) => {
    /** `file://` is required on Android */
    const uri = 'file://' + item.path;
    return (
      <>
        <Image source={{uri}} style={styles.img} />
        <Text>{JSON.stringify(item, null, 2)}</Text>
      </>
    );
  };

  return (
    <>
      <FlatList
        data={localImages}
        contentContainerStyle={topInset}
        renderItem={renderItem}
      />
      <SafeAreaView edges={['bottom']}>
        <Button title="Download images" onPress={downloadImages} />
        <Button title="Remove images" onPress={removeImages} />
      </SafeAreaView>
    </>
  );
}

export default Screen;
