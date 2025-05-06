import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Menu, Search, User, X } from "lucide-react";

const searchSchema = z.object({
  query: z.string().min(1, "Search term can't be empty"),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const Navbar = () => {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Setup search form
  const searchForm = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  // Handle search
  const onSearchSubmit = (values: SearchFormValues) => {
    navigate(`/search?q=${encodeURIComponent(values.query)}`);
    setShowMobileSearch(false);
    searchForm.reset();
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header
      className={`bg-primary sticky top-0 z-50 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Desktop Nav */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <span className="text-secondary text-2xl font-bold">
              Movie<span className="text-white">Hub</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-white hover:text-secondary transition-colors duration-200 font-medium ${
                location === "/" ? "text-secondary" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/movies"
              className={`text-white hover:text-secondary transition-colors duration-200 font-medium ${
                location === "/movies" ? "text-secondary" : ""
              }`}
            >
              Movies
            </Link>
            <Link
              href="/tv"
              className={`text-white hover:text-secondary transition-colors duration-200 font-medium ${
                location === "/tv" ? "text-secondary" : ""
              }`}
            >
              TV Shows
            </Link>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white hover:text-secondary transition-colors duration-200 font-medium flex items-center outline-none">
                Categories <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-hoverBg border-hoverBg">
                <DropdownMenuItem className="text-white hover:bg-secondary focus:bg-secondary cursor-pointer">
                  <Link href="/movies?genre=28">Action</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-secondary focus:bg-secondary cursor-pointer">
                  <Link href="/movies?genre=35">Comedy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-secondary focus:bg-secondary cursor-pointer">
                  <Link href="/movies?genre=18">Drama</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-secondary focus:bg-secondary cursor-pointer">
                  <Link href="/movies?genre=27">Horror</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-secondary focus:bg-secondary cursor-pointer">
                  <Link href="/movies?genre=878">Sci-Fi</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search and Auth */}
        <div className="flex items-center space-x-4">
          {/* Desktop Search */}
          <div className="relative hidden md:block">
            <Form {...searchForm}>
              <form
                onSubmit={searchForm.handleSubmit(onSearchSubmit)}
                className="flex items-center"
              >
                <FormField
                  control={searchForm.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Search movies or TV shows..."
                            className="bg-hoverBg text-white placeholder-textSecondary rounded-circle py-2 px-4 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-secondary"
                            {...field}
                          />
                          <Search className="absolute left-3 top-2.5 text-textSecondary h-4 w-4" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-transparent hover:text-secondary"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            {showMobileSearch ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>

          {/* Auth Buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-8 w-8 bg-secondary text-white hover:bg-secondary/90 cursor-pointer">
                  <AvatarFallback>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-hoverBg border-hoverBg">
                <DropdownMenuItem className="text-white hover:bg-secondary focus:bg-secondary cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:bg-secondary focus:bg-secondary cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:block">
              <Link href="/auth">
                <Button className="bg-secondary text-white hover:bg-red-700 transition-colors duration-200">
                  Sign In
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-transparent hover:text-secondary"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-hoverBg border-none">
              <div className="flex flex-col h-full">
                <div className="space-y-4 py-4">
                  <div className="px-3 py-2">
                    <h2 className="mb-2 text-xl font-bold text-white">
                      <span className="text-secondary">Movie</span>
                      <span className="text-white">Hub</span>
                    </h2>
                  </div>

                  <div className="space-y-1 px-3">
                    <SheetClose asChild>
                      <Link
                        href="/"
                        className="block py-2 text-white hover:text-secondary transition-colors duration-200"
                      >
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/movies"
                        className="block py-2 text-white hover:text-secondary transition-colors duration-200"
                      >
                        Movies
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/tv"
                        className="block py-2 text-white hover:text-secondary transition-colors duration-200"
                      >
                        TV Shows
                      </Link>
                    </SheetClose>

                    {/* Categories */}
                    <div className="pt-2">
                      <h3 className="text-white font-medium mb-2">
                        Categories
                      </h3>
                      <div className="ml-2 space-y-1">
                        <SheetClose asChild>
                          <Link
                            href="/movies?genre=28"
                            className="block py-1 text-textSecondary hover:text-secondary transition-colors duration-200"
                          >
                            Action
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/movies?genre=35"
                            className="block py-1 text-textSecondary hover:text-secondary transition-colors duration-200"
                          >
                            Comedy
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/movies?genre=18"
                            className="block py-1 text-textSecondary hover:text-secondary transition-colors duration-200"
                          >
                            Drama
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/movies?genre=27"
                            className="block py-1 text-textSecondary hover:text-secondary transition-colors duration-200"
                          >
                            Horror
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/movies?genre=878"
                            className="block py-1 text-textSecondary hover:text-secondary transition-colors duration-200"
                          >
                            Sci-Fi
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-3 pb-8">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 bg-secondary text-white mr-2">
                          <AvatarFallback>
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">
                            {user.username}
                          </p>
                          <p className="text-textSecondary text-xs">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-hoverBg hover:bg-secondary text-white"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link href="/auth" className="block w-full">
                        <Button className="w-full bg-secondary text-white hover:bg-red-700">
                          Sign In
                        </Button>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Mobile Search - Expanded */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-3">
          <Form {...searchForm}>
            <form onSubmit={searchForm.handleSubmit(onSearchSubmit)}>
              <FormField
                control={searchForm.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Search movies or TV shows..."
                          className="bg-hoverBg text-white placeholder-textSecondary rounded-circle py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...field}
                          autoFocus
                        />
                        <Search className="absolute left-3 top-2.5 text-textSecondary h-4 w-4" />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 text-white hover:bg-secondary rounded-circle h-8 w-8"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
