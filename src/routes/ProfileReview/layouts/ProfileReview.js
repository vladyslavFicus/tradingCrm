import React from 'react';
import Review from '../container/Review';

export default ({ children, content }) => (content ? content : <Review />);
