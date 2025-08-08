import React from 'react';

interface IconProps {
  color?: string;
  size?: number;
}

export const WebIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 11.39 4.08 10.79 4.21 10.22L8 14V15C8 16.1 8.9 17 10 17V19.93C6.61 19.43 4 16.07 4 12ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" fill={color}/>
  </svg>
);

export const QueueIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20V8H4V6ZM4 11H20V13H4V11ZM4 16H15V18H4V16Z" fill={color}/>
  </svg>
);

export const WorkerIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill={color}/>
  </svg>
);

export const LLMIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2C16.75 2 21 6.25 21 11.5ZM8 11.5C8 9.84 9.34 8.5 11 8.5H12C13.66 8.5 15 9.84 15 11.5V12.5C15 14.16 13.66 15.5 12 15.5H11C9.34 15.5 8 14.16 8 12.5V11.5ZM13 11.5H10V12.5H13V11.5Z" fill={color}/>
    <path d="M17.5 6.5H22V9H17.5V6.5Z" fill={color}/>
    <path d="M17.5 11.5H22V14H17.5V11.5Z" fill={color}/>
    <path d="M17.5 16.5H22V19H17.5V16.5Z" fill={color}/>
  </svg>
);

export const SocketIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.8 3.8L2.7 4.9C2.3 5.3 2.3 5.9 2.7 6.3L3.8 7.4L2.7 8.5C2.3 8.9 2.3 9.5 2.7 9.9L3.8 11L2.7 12.1C2.3 12.5 2.3 13.1 2.7 13.5L3.8 14.6L2.7 15.7C2.3 16.1 2.3 16.7 2.7 17.1L3.8 18.2L2.7 19.3C2.3 19.7 2.3 20.3 2.7 20.7L3.8 21.8H20.2L21.3 20.7C21.7 20.3 21.7 19.7 21.3 19.3L20.2 18.2L21.3 17.1C21.7 16.7 21.7 16.1 21.3 15.7L20.2 14.6L21.3 13.5C21.7 13.1 21.7 12.5 21.3 12.1L20.2 11L21.3 9.9C21.7 9.5 21.7 8.9 21.3 8.5L20.2 7.4L21.3 6.3C21.7 5.9 21.7 5.3 21.3 4.9L20.2 3.8H3.8Z" fill={color}/>
    <path d="M7 17H10V14H14V17H17V10H7V17Z" fill={color}/>
  </svg>
);

// Component to render the appropriate icon based on the icon name
export const ArchitectureIcon: React.FC<{ iconName: string; color?: string; size?: number }> = ({ 
  iconName, 
  color = 'currentColor',
  size = 24
}) => {
  switch (iconName) {
    case 'Web':
      return <WebIcon color={color} size={size} />;
    case 'Queue':
      return <QueueIcon color={color} size={size} />;
    case 'Worker':
      return <WorkerIcon color={color} size={size} />;
    case 'LLM':
      return <LLMIcon color={color} size={size} />;
    case 'Socket':
      return <SocketIcon color={color} size={size} />;
    default:
      return <span>{iconName}</span>;
  }
};