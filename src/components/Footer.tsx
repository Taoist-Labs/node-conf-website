import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const socialLinks = [
  {
    name: 'X',
    href: 'https://twitter.com/seedao_xyz',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#000000">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    href: 'https://discord.com/invite/seedao-xyz',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#5865F2">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: 'Mirror',
    href: 'https://seedao.mirror.xyz/',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#007AFF">
        <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0ZM8.503 13.88a.5.5 0 0 1-.5.5h-1.5a.5.5 0 0 1-.5-.5v-3.756a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 .5.5v3.756Zm4.5 0a.5.5 0 0 1-.5.5h-1.5a.5.5 0 0 1-.5-.5v-3.756a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 .5.5v3.756Zm4.5 0a.5.5 0 0 1-.5.5h-1.5a.5.5 0 0 1-.5-.5v-3.756a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 .5.5v3.756Z" />
      </svg>
    ),
  },
  // {
  //   name: '微信公众号',
  //   href: '#',
  //   icon: (
  //     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#07C160">
  //       <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.018-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
  //     </svg>
  //   ),
  //   qrCode: 'https://example.com/wechat-qr.jpg', // Replace with actual QR code URL
  // },
]

const quickLinks = [
  { name: 'SeeDAO官网', href: 'https://home.seedao.top' },
  { name: 'SeeDAO App/OS', href: 'https://seedao.top' },
  { name: 'SeeDAO Seed', href: 'https://seed.seedao.top' },
]

export default function Footer() {
  const [showQRCode, setShowQRCode] = useState(false)

  return (
    <footer className="relative mt-12">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-12 left-1/4 w-72 h-72 bg-primary-200/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-12 right-1/4 w-72 h-72 bg-accent-200/20 rounded-full filter blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative glass-card border-t border-white/20">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  S
                </div>
                <div>
                  <h3 className="heading-gradient text-xl font-bold">SeeDAO</h3>
                  <p className="text-sm text-gray-500">节点共识大会</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                SeeDAO是一个去中心化自治组织，致力于推动Web3生态系统的发展和创新。
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">快速链接</h3>
              <ul className="space-y-4">
                {quickLinks.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-primary-500 transition-colors"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">社交媒体</h3>
              <div className="flex flex-col gap-4">
                {socialLinks.map(link => (
                  <div key={link.name} className="flex items-center gap-3">
                    {link.name === '微信公众号' ? (
                      <button
                        onClick={() => setShowQRCode(!showQRCode)}
                        className="flex items-center gap-3 group hover:translate-x-1 transition-transform relative"
                      >
                        <span className="transform transition-transform duration-200">
                          {link.icon}
                        </span>
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                          {link.name}
                        </span>
                        {/* {showQRCode && (
                          <div className="absolute bottom-full left-0 mb-2 bg-white p-2 rounded-lg shadow-xl">
                            <img src={link.qrCode} alt="WeChat QR Code" className="w-32 h-32" />
                          </div>
                        )} */}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group hover:translate-x-1 transition-transform"
                      >
                        <span className="transform transition-transform duration-200">
                          {link.icon}
                        </span>
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                          {link.name}
                        </span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} SeeDAO. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  to="/privacy"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  隐私政策
                </Link>
                <Link
                  to="/terms"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  使用条款
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
