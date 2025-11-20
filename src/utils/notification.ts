import { toast } from "sonner";

export const notification = (
  text: string,
  type: "error" | "success" | "warning" | "info",
  time: number = 4000
) => {
  const options = {
    duration: time,
  };

  switch (type) {
    case "error":
      toast.error(text, options);
      break;
    case "success":
      toast.success(text, options);
      break;
    case "warning":
      toast.warning(text, options);
      break;
    case "info":
      toast.info(text, options);
      break;
    default:
      toast(text, options);
  }
};