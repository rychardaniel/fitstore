export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-5 mt-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-5">
        <div className="contact-info">
          <h4 className="text-blue-400 mb-2.5 font-bold">Contact Us</h4>
          <p className="text-sm leading-relaxed">
            Email: contact@fitstore.com<br />
            Phone: (11) 99999-9999
          </p>
        </div>
        <div className="text-xs text-right self-end md:self-auto w-full md:w-auto">
          <p>&copy; 2023 FitStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
