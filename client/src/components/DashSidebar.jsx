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
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    // widthnya 100%, tpi klo 
    //screennya medium maka widthnya = 14 rem
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup
        >
          <Link to='/dashboard?tab=profile'>
            {/* as='div' dipakai agar tidak muncul error  */}
            <Sidebar.Item
              active={tab === 'profile'}
              
              icon={HiUser}
              label={'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
              
              icon={HiArrowSmRight}
              className='cursor-pointer'
            >
              Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
