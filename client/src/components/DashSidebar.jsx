import React from 'react'
import {Sidebar} from 'flowbite-react'
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  // for sign-out
  const { currentUser } = useSelector((state) => state.user);

  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    // widthnya 100%, tpi klo 
    //screennya medium maka widthnya = 14 rem
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
      <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {/* Profile */}
          <Link to='/dashboard?tab=profile'>
            {/* as='div' dipakai agar tidak muncul error  */}
            <Sidebar.Item
              active={tab === 'profile'}
              
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          {/* Posts */}
          {currentUser.isAdmin && 
          <Link to='/dashboard?tab=posts'>
            {/* as='div' dipakai agar tidak muncul error  */}
            <Sidebar.Item
              active={tab === 'posts'}
              icon={HiDocumentText}
              // label={'Posts'}
              // labelColor='dark'
              as='div'
            >
              Posts
            </Sidebar.Item>
          </Link>}
          

          <Sidebar.Item
              icon={HiArrowSmRight}
              className='cursor-pointer'
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
