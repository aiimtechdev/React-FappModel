import React, { useEffect } from 'react';
import useLayout from 'hooks/useLayout';

const LayoutFullpage = ({ content }) => {
  useLayout();
  useEffect(() => {
    document.body.classList.add('h-100');
    const root = document.getElementById('root');
    if (root) root.classList.add('h-100');
    return () => {
      document.body.classList.remove('h-100');
      if (root) root.classList.remove('h-100');
    };
  }, []);

  return (
    <>
      <div className="fixed-background" />
      <div className="d-flex flex-column align-items-center justify-content-between min-vh-100">
        <div></div>
        {content}
        <div className="z-index-1">
            <p className="py-2 text-white">MonitoringSensor - Admin @2023</p>
        </div>
      </div>
    </>
  );
};
export default LayoutFullpage;
