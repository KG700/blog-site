/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'blogsite737fe794961a4d84968528aded199002202619-dev.s3.eu-west-2.amazonaws.com',
                port: '',
                pathname: '/public/**',
            }
        ]
    }
}

module.exports = nextConfig
