import React from 'react';
import "./Notification.css";

function NotificationCard({ title, message }) {

    const containerRef = React.useRef(null);

    /* convertir en hijo de document.body */
    React.useEffect(() => {
        const container = containerRef.current;
        if (container) {
            document.body.appendChild(container);
        }

        return () => {
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        };
    }, []);


    return (
        <div className="notification-card" ref={containerRef}>
            <h2 className='notification-title'>{title}</h2>
            <p className='notification-message'>{message}</p>
        </div>
    );
}

export default NotificationCard;
