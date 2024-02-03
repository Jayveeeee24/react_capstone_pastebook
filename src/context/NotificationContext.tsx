import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { BASE_URL, MmkvStorage } from "../utils/GlobalConfig";
import { usePhoto } from "./PhotoContext";

interface NotificationContextProps {
    getAllNotifications?: () => Promise<any>;
    getNotificationContext?: (notificationId: string) => Promise<any>;
    clearAllNotifications?: () => Promise<any>;
    updateReadNotification?: (notificationId: string) => Promise<any>;
    getNotificationsCount?: () => Promise<any>;
}

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationContext = createContext<NotificationContextProps>({});

export const useNotification = () => {
    return useContext(NotificationContext);
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { getPhotoById } = usePhoto();

    const getAllNotifications = async () => {
        const userId = MmkvStorage.getString('userId');

        try {
            const result = await axios.get(`${BASE_URL}/api/notification/get-notifications`);

            if (result && Array.isArray(result.data)) {
                const filteredNotifications = result.data.filter(notification => {
                    return !(notification.notificationType === "add-friend-request");
                });


                const updatedNotifications = await Promise.all(
                    filteredNotifications.map(async (notification) => {
                        const updatedNotification = { ...notification, context: {}, notifier: {} };

                        const context = getNotificationContext ? await getNotificationContext(updatedNotification.id) : {};
                        updatedNotification.context = await context;

                        if (updatedNotification.notificationType == "like") {
                            updatedNotification.notifier = context.liker;

                            const likerPhoto = getPhotoById ? await getPhotoById(context.liker.photo.id) : undefined;
                            updatedNotification.notifier.photo.photoImageURL = likerPhoto;

                        } else if (updatedNotification.notificationType == "comment") {
                            updatedNotification.notifier = context.commenter;

                            const commenterPhoto = getPhotoById ? await getPhotoById(context.commenter.photo.id) : undefined;
                            updatedNotification.notifier.photo.photoImageURL = commenterPhoto;
                        } else if (updatedNotification.notificationType == "accept-friend-request") {

                            if (context.receiver.id == userId) {
                                updatedNotification.notifier = context.sender;

                                const senderPhoto = getPhotoById ? await getPhotoById(context.sender.photo.id) : undefined;
                                updatedNotification.notifier.photo.photoImageURL = senderPhoto;
                            } else {
                                updatedNotification.notifier = context.receiver;

                                const receiverPhoto = getPhotoById ? await getPhotoById(context.receiver.photo.id) : undefined;
                                updatedNotification.notifier.photo.photoImageURL = receiverPhoto;
                            }
                        }

                        return updatedNotification;
                    })
                );



                return updatedNotifications;
            } else {
                console.error("Invalid data format received from the server");
                return [];
            }
        } catch (error: any) {
            console.log(error)
            return error || "An unexpected error occurred";
        }
    }

    const getNotificationContext = async (notificationId: string) => {
        try {
            const contextResult = await axios.get(`${BASE_URL}/api/notification/get-notification-context/${notificationId}`);

            return contextResult.data;
        } catch (error: any) {
            console.log('get context error: ' + error);
            return error.response;
        }
    }

    const clearAllNotifications = async () => {
        try {
            const result = await axios.delete(`${BASE_URL}/api/notification/clear-notification`);
            return result.data;
        } catch (error: any) {
            console.log('clear notifs error: ' + error);
            return error.response;
        }
    }

    const updateReadNotification = async (notificationId: string) => {
        try {
            const result = await axios.put(`${BASE_URL}/api/notification/update-notification-read/${notificationId}`);
            return result.data;
        } catch (error: any) {
            console.log('read notif error: ' + error);
            return error.response;
        }
    }

    const getNotificationsCount = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/api/notification/get-notifications-count`);
            return result.data;
        } catch (error: any) {
            console.log('get notification count error: ' + error);
            return error.response;
        }
    }


    const contextValue: NotificationContextProps = {
        getAllNotifications,
        getNotificationContext,
        clearAllNotifications,
        updateReadNotification,
        getNotificationsCount
    }

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
}