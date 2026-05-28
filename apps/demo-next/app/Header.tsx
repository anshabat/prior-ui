import { getServerSession } from "../utils/server";
import Navigation from "../components/navigation";

export default async function Header() {
  const session = await getServerSession();
  const user = session?.user || null;

  return (
    <header className="p-4 border-b border-gray-300 flex justify-between">
      <Navigation user={user} />
      <div>
        {user?.email} - {user?.provider}
      </div>
    </header>
  );
}
