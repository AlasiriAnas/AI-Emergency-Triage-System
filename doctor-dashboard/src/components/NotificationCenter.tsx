import { useState, useEffect } from "react";
import { Bell, X, AlertCircle, CheckCircle, Info, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

type NotificationType = "critical" | "success" | "info" | "warning";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "critical",
    title: "Critical Emergency",
    message: "New patient requires urgent care - chest pain",
    timestamp: new Date(Date.now() - 2 * 60000),
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Patient Discharged",
    message: "Patient Ahmed Mohammed has been discharged from hospital",
    timestamp: new Date(Date.now() - 15 * 60000),
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Long Wait Time",
    message: "Patient Fatima has been waiting for 25 minutes",
    timestamp: new Date(Date.now() - 25 * 60000),
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Status Update",
    message: "3 patients have been transferred to treatment",
    timestamp: new Date(Date.now() - 40 * 60000),
    read: true,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "critical":
        return "border-l-red-500 bg-red-50";
      case "success":
        return "border-l-green-500 bg-green-50";
      case "warning":
        return "border-l-orange-500 bg-orange-50";
      case "info":
        return "border-l-blue-500 bg-blue-50";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Convert any Arabic numerals to English
  const toEnglishNumber = (str: string | number): string => {
    if (typeof str === 'number') str = str.toString();
    return str.replace(/[\u0660-\u0669]/g, (c) =>
      (c.charCodeAt(0) - 0x0660).toString()
    );
  };

  const getRelativeTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return "now";
    if (minutes < 60) return toEnglishNumber(`${minutes}m ago`);
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return toEnglishNumber(`${hours}h ago`);
    return toEnglishNumber(`${Math.floor(hours / 24)}d ago`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9 relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {toEnglishNumber(unreadCount)}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm">Notifications</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {toEnglishNumber(unreadCount)} unread
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7"
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                    getNotificationColor(notification.type)
                  } ${!notification.read ? 'bg-opacity-50' : 'bg-white'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm">{notification.title}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 -mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">
                          {getRelativeTime(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-200 text-center">
          <button className="text-xs text-blue-600 hover:text-blue-700">
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
