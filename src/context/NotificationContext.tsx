import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { BASE_URL, Storage } from "../utils/Config";
import { usePhoto } from "./PhotoContext";

interface NotificationContextProps {
    getAllNotifications?: () => Promise<any>;
    getNotificationContext?: (notificationId: string) => Promise<any>;
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
        const userId = Storage.getString('userId');

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
                        // console.log(context.id);

                        // if(updatedNotification.notificationType == "like"){
                        //     updatedNotification.notifier = updatedNotification.context.liker;

                        //     const likerPhoto = getPhotoById ? await getPhotoById(updatedNotification.context.liker.photo) : undefined;
                        //     updatedNotification.notifier.photo.photoImageURL = likerPhoto;
                        // }else{
                        //     updatedNotification.notifier = updatedNotification.context.commenter;

                        //     const commenterPhoto = getPhotoById ? await getPhotoById(updatedNotification.context.commenter.photo) : undefined;
                        //     updatedNotification.notifier.photo.photoImageURL = commenterPhoto;
                        // }

                        return updatedNotification;
                    })
                );



                return updatedNotifications;
            } else {
                console.error("Invalid data format received from the server");
                return result.data;
            }
        } catch (error: any) {
            return error.response?.data?.result || "An unexpected error occurred";
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


    const contextValue: NotificationContextProps = {
        getAllNotifications,
        getNotificationContext
    }

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
}