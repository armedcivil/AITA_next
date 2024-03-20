import EditProfileForm from '@/app/ui/edit-profile-form';
import { fetchCompanyProfile } from '@/app/lib/actions';

export default async function Page() {
  const companyProfile = await fetchCompanyProfile();

  return (
    <div className="h-full w-full p-3">
      <h2 className="h-6 text-xl">Profile</h2>
      <div className="mt-8 flex justify-center">
        <div className="flex w-[636px] flex-col items-center rounded-lg border-2 border-gray-100 p-4 shadow-2xl">
          <EditProfileForm companyProfile={companyProfile} />
        </div>
      </div>
    </div>
  );
}
