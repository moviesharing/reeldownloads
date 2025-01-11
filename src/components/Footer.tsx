const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 text-center">
      <div className="container mx-auto space-y-4">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            Home
          </a>
          <a href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
            Blog
          </a>
        </div>
        <p className="text-gray-400">© {currentYear} By Jphabs Khalifa. All rights reserved.</p>
        <div className="animate-fadeIn">
          <a 
            href="https://aads.com/?partner=2375263"
            className="inline-block text-emerald-400 hover:text-emerald-300 transition-colors duration-300 font-semibold text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            🚀 Boost Your Business: Advertise with AADS Today!
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;