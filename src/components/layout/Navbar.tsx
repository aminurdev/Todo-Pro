import { Loader2Icon, Moon, Sun, User, LogOut } from "lucide-react";
import { logoutUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector, useTheme } from "../../hooks";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading, user } = useAppSelector((state) => state.auth);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <header className="w-full bg-card shadow-md border-b border-b-accent">
      <div className="py-4 flex max-w-screen-xl items-center mx-auto">
        {/* Logo */}
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <img src="/logo.svg" alt="logo" className="w-8 h-8" />
            <span className="font-bold text-foreground">Todo Pro</span>
          </a>
        </div>

        {/* Navigation items can go here */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Right controls */}
          <nav className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="w-8 h-8" />

                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  disabled={isLoading}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
