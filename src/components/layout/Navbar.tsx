import { Moon, Sun, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { Button } from "../ui";
import { logoutUser } from "../../store/slices/authSlice";
import { useTheme } from "../provider/ThemeProvider";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-md px-6 py-3">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="w-8 h-8" />
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">
            Todo Pro
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* Dark/Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Button */}
          <div className="relative">
            <button
              onClick={() => setDropdown((prev) => !prev)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <User size={18} />
            </button>

            {/* Dropdown Menu */}
            {dropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
                <div className="p-4 border-b dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Signed in as
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    user@example.com
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-b-lg"
                >
                  {isLoading ? "Logging out" : "Log out"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>{" "}
    </div>
  );
};

export default Navbar;
