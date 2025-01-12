import React from 'react';

const Advertisement = () => {
  return (
    <div className="w-full max-w-[728px] h-[90px] mx-auto my-4">
      <div id="frame" className="w-full h-full">
        <iframe
          data-aa='2375602'
          src='//acceptable.a-ads.com/2375602'
          style={{
            border: '0px',
            padding: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'transparent'
          }}
        />
        <a
          className="block text-right text-xs text-gray-400 hover:text-gray-300"
          id="frame-link"
          href="https://aads.com/campaigns/new/?source_id=2375602&source_type=ad_unit&partner=2375602"
          target="_blank"
          rel="noopener noreferrer"
        >
          Advertise here
        </a>
      </div>
    </div>
  );
};

export default Advertisement;