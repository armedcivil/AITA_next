

export default function Search({placeholder}:{placeholder?: string}){
  return (
    <input className="w-64 h-10 border-2 border-red-400 rounded-lg p-2" placeholder={placeholder}/>
  );
}