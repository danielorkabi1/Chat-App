import { useSelector } from "react";
export default function IsLoading({ children, fallback }) {
  const { isLoading } = useSelector((state) => state);
  if (isLoading.isLoading) {
    return children;
  }
  else{
      return {fallback}
  }
}
