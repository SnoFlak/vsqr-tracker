import Image from "next/image";
import { login } from './actions';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <form className="flex flex-col gap-2 lg:w-1/3 w-3/4 border p-8 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">Band Access</h1>
        <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required className="border p-2 rounded" />
        <button formAction={login} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Log In</button>
      </form>
    </div>
  );
}
