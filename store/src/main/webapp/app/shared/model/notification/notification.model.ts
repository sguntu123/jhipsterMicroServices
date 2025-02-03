import dayjs from 'dayjs';
import { NotificationType } from 'app/shared/model/enumerations/notification-type.model';

export interface INotification {
  id?: number;
  date?: dayjs.Dayjs;
  details?: string | null;
  sentDate?: dayjs.Dayjs;
  format?: keyof typeof NotificationType;
  userId?: number;
  productId?: number;
}

export const defaultValue: Readonly<INotification> = {};
