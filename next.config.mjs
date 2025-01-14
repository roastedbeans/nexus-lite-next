/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_NEXUSLITE_URL: process.env.NEXUSLITE_URL,
	},
};

export default nextConfig;
