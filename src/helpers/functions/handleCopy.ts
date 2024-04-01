import { toaster } from "../../components/ui/@fairysaas/toaster/ToastConfig";

export const handleCopy = (string: string, what?: string) => {
  navigator.clipboard.writeText(string);
  toaster({
    type: "success",
    description: `${what} copied to clipboard`,
  });
};
