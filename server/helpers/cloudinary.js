/* eslint-disable no-console */
import cloud from 'cloudinary';

const cloudinary = cloud.v2;
let imgUri, errMsg;

cloudinary.config({
  cloud_name: 'chunkingz',
  api_key: '732559542759199',
  api_secret: '9_zhoIJM8QU4zGDctOEZwxyc01M'
});

/**
 * Create/POST a property ad.
 * @param {object} img the request object.
 * @return  {Function} returns to the caller
 *
*/
const imageUpload = async (img) => {
  console.log('** ** ** Image Upload ** ** **');
  try {
    await cloudinary.uploader.upload(img, { tags: 'sample' }, (err, image) => {
      if (err) { console.log(`error: ${err}`); errMsg = err; return err; }
      console.log('** File Upload complete**');
      imgUri = image.url;
    });
    return imgUri || errMsg;
  } catch (err) {
    console.log(err.Error);
  }
};

export default imageUpload;
