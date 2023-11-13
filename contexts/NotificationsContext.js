import { database } from 'firebase';

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const notifRef = database().ref('notifications');

  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);

    notifRef.push().set({
      ...notification,
      timestamp: Date.now(),
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
