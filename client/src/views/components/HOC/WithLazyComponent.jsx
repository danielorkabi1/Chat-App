import React, { Suspense } from "react";
import Loader from "../loading/Lodaer";

export const withLazyComponent = (LazyComponent, Fallback) => {
  return (props) => (
    <Suspense fallback={Fallback?<Fallback/>:<Loader/>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
