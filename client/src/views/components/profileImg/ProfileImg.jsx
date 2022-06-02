import React from 'react';
import { withLazyComponent } from '../HOC/WithLazyComponent';
const ProfileImg = withLazyComponent(React.lazy(() => import('./Image')));
export default ProfileImg;