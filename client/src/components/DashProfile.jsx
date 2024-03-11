import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, Modal, 
  ModalBody, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function DashProfile() {
  //   State below
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  //image file upload progress below
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  
  //   Normal variable here
  const filePickerRef = useRef()
  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const handleImageChange = (e) =>{
    const file = e.target.files[0]
    
    if(file){
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }
  
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () =>{
    setImageFileUploadError(null);
    const storage = getStorage(app);
    
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);


    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        // setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          // setFormData({ ...formData, profilePicture: downloadURL });
          // setImageFileUploading(false);
        });
      }
    );
  }
  
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      {/* Profile Title */}
      <h1 className='my-7 text-center font-semibold text-3xl'>
        Profile
      </h1>

      {/* form */}
      <form className='flex flex-col gap-5'>
        <input 
          type='file' 
          accept='image/*' 
          onChange={handleImageChange} 
          ref={filePickerRef}
          hidden
          />

        {/* Parent div profile picture below */}
        <div
          className='relative w-32 h-32 cursor-pointer shadow-md  rounded-full self-center'
          onClick={()=>filePickerRef.current.click()}
        >
          {/* Circular Progress Bar */}
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position :'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          {/* Image */}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className=
            {`rounded-full w-full h-full object-cover border-4 border-[lightgray]
            ${imageFileUploadProgress &&
            imageFileUploadProgress < 100 && 'opacity-60'}
            `}
          />
        </div>
        {/* End of Parent div profile picture above */}

        {imageFileUploadError && 
          <Alert color='failure'>
            {imageFileUploadError}
          </Alert>
        }
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          // onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          // onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          // onChange={handleChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          // disabled={loading || imageFileUploading}
        >
          Update
          {/* {loading ? 'Loading...' : 'Update'} */}
        </Button>
        
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
          <span 
          onClick={() => setShowModal(true)}
          className='cursor-pointer'>
            Delete Account
          </span>
          <span 
          // onClick={handleSignout} 
          className='cursor-pointer'>
            Sign Out
          </span>
        </div>
      </div>
  )
}
