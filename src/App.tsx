import { Toaster } from "@/components/ui/sonner";
import BirthdayApp from "@/components/davi/BirthdayApp";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App(){
  return (
    <ErrorBoundary>
      <BirthdayApp />
      <Toaster richColors position="top-center"/>
    </ErrorBoundary>
  );
}