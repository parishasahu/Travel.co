import DestinationCard from './DestinationCard';
import { destinations } from '@/lib/destinations';

export default function AspenCard() {
  const dest = destinations.find(d => d.title === 'ASPEN');
  return dest ? <DestinationCard dest={dest} /> : null;
}
