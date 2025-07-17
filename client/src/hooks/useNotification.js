import { useEffect } from 'react';

const useNotification = (title, options) => {
  useEffect(() => {
    if (!('Notification' in window)) return;
    
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
      }
    };
    
    requestPermission();
  }, []);
  
  const showNotification = (message) => {
    if (document.hidden && Notification.permission === 'granted') {
      new Notification(title, { 
        body: message,
        ...options 
      });
    }
  };
  
  return showNotification;
};

export default useNotification;