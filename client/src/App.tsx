import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "./pages/home-page";
import AuthPage from "./pages/auth-page";
import MovieDetailPage from "./pages/movie-detail-page";
import TvDetailPage from "./pages/tv-detail-page";
import MoviesPage from "./pages/movies-page";
import TvShowsPage from "./pages/tv-shows-page";
import SearchPage from "./pages/search-page";
import { ThemeProvider } from "next-themes";
import Chatbot from "./components/ui/chatbot"; 
import { useAuth } from "./hooks/use-auth"; 
import ProfilePage from "./pages/profile-page";


function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/movies" component={MoviesPage} />
      <Route path="/tv" component={TvShowsPage} />
      <Route path="/movie/:id" component={MovieDetailPage} />
      <Route path="/tv/:id" component={TvDetailPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TooltipProvider>
            <Toaster />
            <Router />
            <ChatbotWrapper />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function ChatbotWrapper() {
  const { user } = useAuth();
  return user ? <Chatbot /> : null;
}

export default App;
