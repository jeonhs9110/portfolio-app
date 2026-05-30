import Navbar from '@/components/Navbar';
import Terminal from '@/components/Terminal';
import Architecture from '@/components/Architecture';
import Substrate from '@/components/Substrate';
import Endpoint from '@/components/Endpoint';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Terminal />
      <Architecture />
      <Substrate />
      <Endpoint />
    </main>
  );
}
