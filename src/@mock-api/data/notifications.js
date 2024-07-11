import { SERVICE_URL } from 'config';
import api from '../api';

const notificationData = [
  {
    id: 1,
    img: '/img/profile.webp',
    title: 'user-1',
    detail: 'Some Notification here!',
    link: '#/',
  },
];
api.onGet(`${SERVICE_URL}/notifications`).reply(200, notificationData);
