import { app } from '../firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { Alert, Button, Modal, ModalBody, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// redux
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from '../redux/user/userSlice';
// for circular progress bar
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  //   State below
  const { currentUser, loading, error: errorMessage } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  // image file upload progress below
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(false);
  
  //   Normal variable here
  const filePickerRef = useRef()
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({})
  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () =>{
    setImageFileUploadError(null);
    setImageFileUploading(true)
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
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
          setImageFileUploadProgress(null);
        });
      }
    );
  }

  const handleImageChange = (e) =>{
    const file = e.target.files[0]
    
    if(file){
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }

  const updateUser = async(e)=>{
    //prevent default untuk prevent agar dia gk clear pas dipencet
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    // this it to check if there is data changes or not
    // if not just return not submit
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }

    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  }

  const handleFormChange = (e) =>{
    setFormData({ ...formData, [e.target.id]: e.target.value});
  }
  
  

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      {/* Profile Title */}
      <h1 className='my-7 text-center font-semibold text-3xl'>
        Profile
      </h1>

      {/* form */}
      <form className='flex flex-col gap-5' onSubmit={updateUser}>
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
          onChange={handleFormChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleFormChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleFormChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          disabled={loading || imageFileUploading}
          // better use onSubmit on the form
          // onClick={updateUser}
        >
          
          {loading || imageFileUploading ? (
            <>
              <Spinner size='sm' />
              <span className='pl-3'>Loading...</span>
            </>
            ) : 'Update'}
        </Button>
        {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
        )}
        {updateUserError && (
          <Alert color='failure' className='mt-5'>
            {updateUserError}
          </Alert>
        )}
        {errorMessage && (
        <Alert color='failure'>
            {errorMessage}
        </Alert>
        )}
        
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
