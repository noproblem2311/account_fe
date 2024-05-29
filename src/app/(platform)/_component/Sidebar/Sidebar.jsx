'use client';
import React from 'react';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation';

export const Sidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const handleMenuClick = (e) => {
    const key = e.key;
    if (key === '1') {
      router.push('/home');
    } else if (key === '2') {
      router.push('/history');
    }
  };

  return (
    <div className="fixed h-screen border-r-[1px] z-50 left-0 w-[240px] flex flex-col bg-[#344054]">
      <Menu
        mode="inline"
        style={{
          backgroundColor: 'transparent',
          color: 'white',
          height: '100%',
          flex: 1,
        }}
        onClick={handleMenuClick}
        selectedKeys={[currentPath === '/home' ? '1' : currentPath === '/history' ? '2' : '']}
      >
        <Menu.Item key="1" style={{ color: currentPath === '/home' ? 'yellow' : 'inherit' }}>
          Kiểm tra
        </Menu.Item>
        <Menu.Item key="2" style={{ color: currentPath === '/history' ? 'yellow' : 'inherit' }}>
          History
        </Menu.Item>
      </Menu>
    </div>
  );
};