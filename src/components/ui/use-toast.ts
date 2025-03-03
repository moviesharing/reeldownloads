
import { useToast, toast } from "@/hooks/use-toast";

// Configure default toast duration
toast.success = (message: string) => toast({
  title: "Success",
  description: message,
  className: "bg-green-50 dark:bg-green-900",
});

toast.error = (message: string) => toast({
  title: "Error",
  description: message,
  variant: "destructive",
});

export { useToast, toast };
