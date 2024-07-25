import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FcGoogle } from "react-icons/fc";
import Image from 'next/image';

const SignInPage = () => {

  const currentYear = new Date().getFullYear();

  return (
    <main className='bg-[#26313c] h-screen flex items-center justify-center p-10'>


      <div className='grid w-full h-full grid-cols-1 md:grid-cols-2'>

        <div className='bg-[#16202a] text-white flex items-center justify-center flex-col'>
          <div className='my-4 text-center'>
            <h1 className="text-3xl font-semibold">Mesos</h1>
            <p className='mt-2 text-xs text-slate-400'>
              Level Up your Finances today.
            </p>

          </div>

          <form>
            <Button className="flex items-center w-full gap-4 px-12 mb-4 bg-transparent rounded-full" variant="outline">
              <FcGoogle />
              Sign In with Google
            </Button>

            <Label htmlFor="email">Email*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full"
              type="email"
              id="email"
              placeholder="Email"
            />

            <Label htmlFor="password">Password*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full"
              type="password"
              id="password"
              placeholder="Password"
            />

            <Button type="submit" className="w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-700">
              Login
            </Button>
          </form>

          <p className='mt-4 text-xs text-slate-200'>
            &copy; {currentYear} All rights reserved. Philip Lee
          </p>

        </div>

        <div className='relative hidden md:block'>

          <Image className='object-cover'
            fill={true}
            src="/login-bg.jpg"
            alt="background image"
            quality={100}

          />

        </div>

      </div>

    </main>
  );
};

export default SignInPage;
