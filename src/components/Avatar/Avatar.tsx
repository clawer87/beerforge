import React from 'react';

import styles from './Avatar.module.scss';

interface Props {
  user: any,
}

const colors = [
  ['#F4D03F', '#EBAF3C', '#E9662C'],
  ['#00AEA3', '#0C8D85', '#005142'],
  ['#16A05E', '#008B49', '#00540D'],
  ['#E9662C', '#D44B11', '#A60000'],
  ['#FFFFFF', '#DAE7E6', '#224749'],
  ['#191919', '#505050', '#FFFAE7'],
];

function Avatar({
  user
}: Props) {
  let image;

  if (user) {
    const mask = `mask${user.id}`;
    const schema = user.icon_schema;
    const index = schema[2];
    const colorScheme = colors[index];
  
    image = <svg width="100%" height="100%" viewBox={`${schema[0]} ${schema[1]} 80 80`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect mask={`url(#${mask})`} width="216" height="216" fill={colorScheme[0]} />
        <g opacity="0.5">
          <mask id={mask} mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="216" height="216">
            <circle cx={schema[0] + 40} cy={schema[1] + 40} r="40" fill="#000" />
          </mask>
          <g mask={`url(#${mask})`}>
            <path d="M201.124 70.0309L23.2 64.8C24.8495 87.5734 61.2176 99.4018 109.381 114.969C110.837 115.44 111.331 117.266 110.304 118.404L85.3392 146.065C84.084 147.456 85.121 149.677 86.9885 149.598L175.848 145.833C178.748 145.71 180.661 142.75 179.594 140.039C177.873 135.669 175.429 129.429 173.36 124.012C167.681 109.144 165.604 101.85 202.728 75.5071C205.063 73.8508 203.981 70.1149 201.124 70.0309Z" fill={colorScheme[1]} />
            <path d="M88.2834 108.067C125.132 92.59 163.845 80.6974 203.991 72.8229C204.067 73.8041 203.683 74.8296 202.729 75.5072C165.604 101.85 167.681 109.144 173.36 124.012C175.43 129.429 177.873 135.669 179.594 140.039C180.661 142.75 178.748 145.71 175.848 145.833L86.9886 149.598C85.1211 149.677 84.0841 147.456 85.3393 146.065L110.304 118.404C111.332 117.266 110.838 115.44 109.381 114.969C102.048 112.599 94.9887 110.315 88.2834 108.067Z" fill="url(#paint0_linear)" />
          </g>
        </g>
        <defs>
          <linearGradient id="paint0_linear" x1="137.941" y1="90.1765" x2="137.941" y2="139.238" gradientUnits="userSpaceOnUse">
            <stop stopColor={colorScheme[2]} />
            <stop offset="1" stopColor={colorScheme[1]} />
          </linearGradient>
        </defs>
      </svg>;
  };

  return(
    <div
      className={styles.avatar}
    >{image}</div>
  );
};

export default Avatar;