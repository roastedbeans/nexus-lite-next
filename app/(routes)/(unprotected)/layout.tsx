import React from 'react';

const UnprotectedLayout = async (children: React.ReactNode) => {
	return <main>{children}</main>;
};

export default UnprotectedLayout;