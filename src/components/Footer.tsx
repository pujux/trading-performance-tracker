import { HardDrive } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-6 mt-auto bg-white border-t">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-600">
            Built by{" "}
            <a
              href="https://pufler.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 transition-colors hover:text-blue-800"
            >
              pufler.dev
            </a>
          </p>

          <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 rounded-full bg-gray-50">
            <HardDrive size={16} />
            <p>All data is stored locally in your browser</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
