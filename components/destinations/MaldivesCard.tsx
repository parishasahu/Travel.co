import DestinationCard from './DestinationCard';
import { destinations } from '@/lib/destinations';

export default function MaldivesCard() {
  const dest = destinations.find(d => d.title === 'MALDIVES');
  return dest ? <DestinationCard dest={dest} /> : null;
}
