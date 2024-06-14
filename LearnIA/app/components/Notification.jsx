import { useState, useEffect, useRef } from 'react';
import "../styles/notification.css";

const notifications = [
    {
        date: '2024-06-01',
        message: 'Próximo quiz el 10 de Junio de 2024',
        type: 'deadline',
    },
    {
        date: '2024-06-05',
        message: 'Se ha completado el quiz 3. Calificación: 80.5%',
        type: 'completion',
    },
    {
        date: '2024-06-10',
        message: 'Próximo quiz el 20 de Junio de 2024',
        type: 'deadline',
    },
];

function Notification() {
    const [isVisible, setIsVisible] = useState(false);
    const notificationRef = useRef(null);

    const toggleNotificationWindow = () => {
        setIsVisible(!isVisible);
    };

    const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="wrapper-notif">
            <button className="bell-notif" onClick={toggleNotificationWindow}>
                <i className="bi bi-bell bell-icon" />
            </button>
            {isVisible && (
                <div className="notification-window" ref={notificationRef}>
                    {notifications.length === 0 ? (
                        <p className="no-notifications">No tienes notificaciones</p>
                    ) : (
                        notifications.map((notification, index) => (
                            <div key={index} className="notification">
                                <p className={`date-notif ${notification.type}`}>{notification.date}</p>
                                <p className="notif-name">{notification.message}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Notification;