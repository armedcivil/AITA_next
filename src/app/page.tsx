import LoginForm from "./ui/login-form";

export default function Home() {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full flex justify-center items-center bg-white">
        <LoginForm />
      </div>
    </main>
  );
}
