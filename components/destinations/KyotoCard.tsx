import DestinationCard from './DestinationCard';
import { destinations } from '@/lib/destinations';

export default function KyotoCard() {
  const dest = destinations.find(d => d.title === 'KYOTO');
  return dest ? <DestinationCard dest={dest} /> : null;
}
