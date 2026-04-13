import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { MapPin, Users } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const familyMembers = [
  { id: 1, name: 'Marc', position: [48.8584, 2.2945], role: 'Father' },
  { id: 2, name: 'Elena', position: [48.8606, 2.3376], role: 'Mother' },
  { id: 3, name: 'Thomas', position: [48.8534, 2.3488], role: 'Son' },
];

export default function GPS() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-6 pt-8 pb-32 space-y-8"
    >
      <section className="space-y-2">
        <h2 className="font-headline text-5xl font-bold text-on-surface tracking-tight">GPS Famille</h2>
        <p className="text-on-surface-variant font-medium text-lg italic opacity-80">Où se trouve la tribu aujourd'hui ? (Version 100% Gratuite)</p>
      </section>

      <div className="bg-surface-container rounded-xl overflow-hidden h-[500px] shadow-sm ring-1 ring-outline-variant/10 relative z-10">
        <MapContainer 
          center={[48.8566, 2.3522]} 
          zoom={13} 
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {familyMembers.map((member) => (
            <Marker key={member.id} position={member.position as [number, number]}>
              <Tooltip permanent direction="top" offset={[0, -40]} className="bg-primary text-on-primary font-bold rounded-full px-3 py-1 border-none shadow-md">
                {member.name}
              </Tooltip>
              <Popup>
                <div className="text-center p-1 min-w-[100px]">
                  <p className="font-headline font-bold text-lg text-primary m-0 leading-tight">{member.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant m-0 mt-1">{member.role}</p>
                  <div className="mt-2 pt-2 border-t border-outline-variant/30 flex items-center justify-center gap-1 text-[10px] text-on-surface-variant">
                    <MapPin size={10} />
                    <span>Position actuelle</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <section className="space-y-4">
        <h3 className="font-headline text-2xl font-bold px-2">Membres de la tribu</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {familyMembers.map((member) => (
          <div key={member.id} className="bg-surface-container-low p-4 rounded-lg flex items-center gap-4 hover:bg-surface-container-high transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
              <Users size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-on-surface">{member.name}</p>
              <p className="text-xs text-tertiary font-semibold uppercase tracking-widest">{member.role}</p>
              <div className="flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
                <MapPin size={10} />
                <span>Dernière position : il y a 5 min</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      </section>
    </motion.div>
  );
}
