import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email").max(255),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const Auth = () => {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();

  const redirectPath = searchParams.get("redirect") || "/";

  // Redirect if already logged in
  useEffect(() => {
     if (user) {
        navigate(redirectPath);
     }
  }, [user, navigate, redirectPath]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      // Navigation happens in useEffect
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    const { error } = await signUp(data.email, data.password, data.name);
    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Welcome to Exam Essentials!",
      });
      // Navigation happens in useEffect
    }
  };

  return (
    <>
      <Helmet>
        <title>My Account | Exam Essentials</title>
        <meta name="description" content="Login or register to access your Exam Essentials account and manage your study materials." />
      </Helmet>

      <Navbar />
      <main className="min-h-screen pt-32 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Login Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                Login
              </h2>

              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="font-body">
                    Username or email address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    {...loginForm.register("email")}
                    className="bg-secondary border-border"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive font-body">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="font-body">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      {...loginForm.register("password")}
                      className="pr-10 bg-secondary border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive font-body">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="font-body text-sm cursor-pointer">
                    Remember me
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={loginForm.formState.isSubmitting}
                >
                  {loginForm.formState.isSubmitting ? "Please wait..." : "Log in"}
                </Button>

                {/* Lost Password */}
                <p className="text-center">
                  <button
                    type="button"
                    className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Lost your password?
                  </button>
                </p>
              </form>
            </motion.div>

            {/* Register Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                Register
              </h2>

              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="font-body">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    {...registerForm.register("name")}
                    className="bg-secondary border-border"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-destructive font-body">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="font-body">
                    Email address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    {...registerForm.register("email")}
                    className="bg-secondary border-border"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive font-body">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="font-body">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      {...registerForm.register("password")}
                      className="pr-10 bg-secondary border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive font-body">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={registerForm.formState.isSubmitting}
                >
                  {registerForm.formState.isSubmitting ? "Please wait..." : "Register"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Auth;
