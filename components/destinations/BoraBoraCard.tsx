import DestinationCard from './DestinationCard';
import { destinations } from '@/lib/destinations';

export default function BoraBoraCard() {
  const dest = destinations.find(d => d.title === 'BORA BORA');
  return dest ? <DestinationCard dest={dest} /> : null;
}
