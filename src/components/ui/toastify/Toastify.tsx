import { toast, ToastPosition, Theme } from "react-toastify";

type Toast = {
  position?: ToastPosition; 
  value?: string;
  type?: string;
  theme?: Theme;
  hideProgressBar?: boolean;
  autoClose?: number | false;
  callbackOnOpen?: () => void;
  callbackOnClose?: () => void;
};

export const Toastify = ({
  type = "default",
  hideProgressBar = true,
  value = "Il se passe quelque chose...",
  position = "bottom-right",
  theme = "colored",
  autoClose = 1250,
  callbackOnOpen,
  callbackOnClose,
}: Toast) => {
  if (type === "error") {
    return toast.error(value, {
      position: position ?? "bottom-center",
      autoClose: autoClose,
      hideProgressBar: hideProgressBar,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
      onClose: callbackOnClose,
      onOpen: callbackOnOpen,
    });
  } else if (type === "success") {
    return toast.success(value, {
      position: position,
      autoClose: autoClose,
      hideProgressBar: hideProgressBar,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
      onClose: callbackOnClose,
      onOpen: callbackOnOpen,
    });
  } else if (type === "warning") {
    return toast.warning(value, {
      position: position,
      autoClose: autoClose,
      hideProgressBar: hideProgressBar,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
      onClose: callbackOnClose,
      onOpen: callbackOnOpen,
    });
  } else if (type === "info") {
    return toast.info(value, {
      position: position,
      autoClose: autoClose,
      hideProgressBar: hideProgressBar,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
      onClose: callbackOnClose,
      onOpen: callbackOnOpen,
    });
  } else if (type === "default") {
    return toast(value, {
      position: position,
      autoClose: autoClose,
      hideProgressBar: hideProgressBar,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
      onClose: callbackOnClose,
      onOpen: callbackOnOpen,
    });
  }
};
