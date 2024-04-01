import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import {
  ExternalToast,
  ToastT,
  toast,
} from "sonner";
type ToastTypes =
  | "normal"
  | "action"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "loading"
  | "default";
type PromiseT<Data = any> = Promise<Data> | (() => Promise<Data>);
type PromiseExternalToast = Omit<ExternalToast, "description">;
type PromiseData<ToastData = any> = PromiseExternalToast & {
  loading?: string | React.ReactNode;
  success?:
    | string
    | React.ReactNode
    | ((data: ToastData) => React.ReactNode | string);
  error?: string | React.ReactNode | ((error: any) => React.ReactNode | string);
  description?:
    | string
    | React.ReactNode
    | ((data: any) => React.ReactNode | string);
  finally?: () => void | Promise<void>;
};
type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

import { Loader } from "../loader";

interface ToastProps {
  id?: number | string;
  title?: string | React.ReactNode;
  type?: ToastTypes;
  icon?: React.ReactNode;
  jsx?: React.ReactNode;
  invert?: boolean;
  dismissible?: boolean;
  description?: React.ReactNode;
  duration?: number;
  delete?: boolean;
  important?: boolean;
  action?: {
    label: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  onDismiss?: (toast: ToastT) => void;
  onAutoClose?: (toast: ToastT) => void;
  promise?: PromiseT;
  cancelButtonStyle?: React.CSSProperties;
  actionButtonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  unstyled?: boolean;
  className?: string;
  classNames?: ToastClassnames;
  descriptionClassName?: string;
  position?: Position;
  richColors?: boolean;
  closeButton?: boolean;
}
interface ToastClassnames {
  toast?: string;
  title?: string;
  description?: string;
  loader?: string;
  closeButton?: string;
  cancelButton?: string;
  actionButton?: string;
  success?: string;
  error?: string;
  info?: string;
  warning?: string;
  loading?: string;
  default?: string;
}
export const toaster = ({
  description,
  type,
  invert,
  important,
  duration = 2000,
  dismissible,
  icon,
  action,
  cancel,
  id,
  onDismiss,
  onAutoClose,
  closeButton = true,
  unstyled,
}: ToastProps) => {
  function toastIcon(type: string) {
    if (type === "success") {
      return <CheckCircle2 className="icon" />;
    } else if (type === "error") {
      return <XCircle className="icon" />;
    } else if (type === "info") {
      return <Info className="icon" />;
    } else if (type === "warning") {
      // eslint-disable-next-line react/jsx-no-undef
      return <AlertTriangle className="icon" />;
    } else if (type === "loading") {
      return <Loader />;
    } else {
      if (icon) {
        return icon;
      }
    }
  }
  const toastOptions = {
    className: `toast toast-${type}`,
    duration: duration,
    icon: toastIcon(type ?? "default"),
    invert: invert,
    important: important,
    dismissible: dismissible,
    closeButton: closeButton,
    action: action,
    cancel: cancel,
    id: id,
    onDismiss: onDismiss,
    onAutoClose: onAutoClose,
    unstyled: unstyled,
  };
  if (type === "success") {
    return toast.success(description, toastOptions);
  } else if (type === "info") {
    return toast.info(description, toastOptions);
  } else if (type === "warning") {
    return toast.warning(description, toastOptions);
  } else if (type === "error") {
    return toast.error(description, toastOptions);
  } else if (type === "loading") {
    return toast.loading(description, toastOptions);
  } else {
    return toast(description, toastOptions);
  }
};
/* 
description --> 	Toast's description, renders underneath the title.--> 	-
closeButton --> 	Adds a close button.--> 	false
invert	-->         Dark toast in light mode and vice versa.--> 	false
important --> 	    Control the sensitivity of the toast for screen readers--> 	false
duration --> 	    Time in milliseconds that should elapse before automatically closing the toast.	--> 4000
position --> 	    Position of the toast.--> 	bottom-right
dismissible --> 	If false, it'll prevent the user from dismissing the toast.	true
icon --> 	        Icon displayed in front of toast's text, aligned vertically.--> 	-
action --> 	        Renders a primary button, clicking it will close the toast.	-
cancel --> 	        Renders a secondary button, clicking it will close the toast.	-
id --> 	            Custom id for the toast.	--> -
onDismiss --> 	    The function gets called when either the close button is clicked, or the toast is swiped.--> 	-
onAutoClose --> 	Function that gets called when the toast disappears automatically after it's timeout (duration` prop).--> 	-
unstyled --> 	    Removes the default styling, which allows for easier customization.	--> false
actionButtonStyles --> 	Styles for the action button--> 	{}
cancelButtonStyles --> 
*/
