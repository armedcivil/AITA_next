import CreateUserForm from '@/app/ui/create-user-form';

export default function Page() {
  return (
    <div className="h-full w-full p-3">
      <h2 className="h-6 text-xl">Create User</h2>
      <div className="mt-8 flex justify-center">
        <div className="flex w-[636px] flex-col items-center rounded-lg border-2 border-gray-100 p-4 shadow-2xl">
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
}
