import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { onMessage } from 'firebase/messaging';
import { getMessaging } from 'firebase/messaging';

function Notifications() {
  useEffect(() => {
    const messaging = getMessaging();
    onMessage(messaging, payload => {
      toast.info(payload.notification.body);
    });
  }, []);

  return null;
}

export default Notifications;
