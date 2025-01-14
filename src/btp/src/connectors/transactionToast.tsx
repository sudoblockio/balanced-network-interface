import React from 'react';

import { t } from '@lingui/macro';
import { toast, ToastOptions, UpdateOptions } from 'react-toastify';

import {
  NotificationPending,
  NotificationError,
  NotificationSuccess,
} from 'app/components/Notification/TransactionNotification';
import { TransactionStatus } from 'store/transactions/hooks';

interface ToastTransactionParams {
  message: string;
  transactionStatus?: TransactionStatus;
  options?: UpdateOptions | ToastOptions;
  id: string;
}

export const openToast = ({
  message,
  transactionStatus = TransactionStatus.pending,
  options = {},
  id,
}: ToastTransactionParams) => {
  switch (transactionStatus) {
    case TransactionStatus.success: {
      toast.update(id, {
        render: <NotificationSuccess summary={message} />,
        autoClose: 3000,
        ...options,
      });
      break;
    }
    case TransactionStatus.failure: {
      if (id) {
        toast.update(id, {
          render: <NotificationError summary={message} />,
          autoClose: 5000,
          ...options,
        });
      } else {
        toast(
          <NotificationError
            failureReason={t`Couldn't complete the transaction. Make sure your wallet is set to the right network.`}
          />,
          {
            toastId: 'possibleWrongNetwork',
            autoClose: 5000,
          },
        );
      }

      break;
    }
    default: {
      toast(<NotificationPending summary={message} />, {
        toastId: id === '' ? undefined : id,
        ...(options as ToastOptions),
      });
    }
  }
};
