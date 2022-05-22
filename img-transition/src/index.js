import { imageUrls } from './images';
import ImagePreloader from 'image-preloader';
import { Scene } from './scene';

const loaderContainer = document.querySelector('.loader-container');

var preloader = new ImagePreloader();
preloader.preload(...imageUrls).then(function (loadedImages) {
  const images = loadedImages.map((x) => {
    x.value.crossOrigin = 'Anonymous';
    return x.value;
  });
  new Scene(images);
  loaderContainer.remove();
});
