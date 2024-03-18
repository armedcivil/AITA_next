import { CreateButton } from '@/app/ui/buttons';
import Search from '@/app/ui/search'

export default function Page() {
  return (
    <div className="p-3 h-full">
      <div className="w-full flex justify-end">
        <Search placeholder='Search user'/>
        <CreateButton className='ml-4'/>
      </div>
      
    </div>
  );
}
