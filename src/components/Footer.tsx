const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 text-center text-gray-400">
      <div className="container mx-auto">
        <p>© {currentYear} By Jphabs Khalifa. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;