import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/client"
import { redirect_url, server_url } from "@/lib/API"


export function LoginForm({
 className,
  ...props
}) {

  const [currentState, setCurrentState] = useState(true)
  const [postData, setPostData] = useState({email: '', password: ''});

    const navigate = useNavigate()

  const handleLogin = () => {
    setCurrentState(false)
  }

  const handleCreate = () => {
    setCurrentState(true)
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${server_url}/auth/create`, postData);
      if(response.status == 201){
        console.log('Response:', response.data);
        toast("Account created successfully. Please check your email to verify your account.")
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || err.message)
    }
  };

   const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${server_url}/auth/login`, postData);
        console.log('Response:', response.data.data);
        let userData = response.data.data;
        toast("Logged in sucessfully")
        localStorage.setItem("mentex", JSON.stringify(userData));
        navigate('/')
      
    } catch (err) {
      console.error('error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || err.message)
    }
  };


  const handleGoogleSignIn = async (e) => {
    e.preventDefault(); 
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${redirect_url}/auth/callback?next=/`, 
    },
  });

  if (error) {
    console.error('Error during Google OAuth:', error.message);
    toast.error('Error during Google OAuth')
  }
};

  
  if (currentState) {
      return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" onChange={(e) => setPostData({ ...postData, email: e.target.value })} placeholder="me@example.com" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" onChange={(e) => setPostData({ ...postData, password: e.target.value })} type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={handleSignup}  className="w-full cursor-pointer">
                  Sign up  
                </Button>
                <Button onClick={handleGoogleSignIn} variant="outline" className="w-full cursor-pointer">
                  Sign up with Google <img src="https://img.logo.dev/google.com?token=pk_Ucg3xwu9SjeQdAGuwpQjGw" alt="" className="h-[18px]"/>
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a onClick={handleLogin} className="underline underline-offset-4 cursor-pointer">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      
    </div>
      );
    }



  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" onChange={(e) => setPostData({ ...postData, email: e.target.value })} placeholder="me@example.com" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" onChange={(e) => setPostData({ ...postData, password: e.target.value })} type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={handleSignin}  className="w-full cursor-pointer">
                  Login
                </Button>
                <Button onClick={handleGoogleSignIn} variant="outline" className="w-full cursor-pointer">
                  Login with Google <img src="https://img.logo.dev/google.com?token=pk_Ucg3xwu9SjeQdAGuwpQjGw" alt="" className="h-[18px]"/>
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a onClick={handleCreate} className="underline underline-offset-4 cursor-pointer">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    
    </div>)
  );
}
