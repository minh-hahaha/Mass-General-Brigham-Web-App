import React from 'react';
import { Navigation, MapPin, Phone, Clock } from 'lucide-react';

interface HospitalCardProps {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    hours: string;
    image: string;
    onClick: () => void;
}

const HospitalCard= ({
                                                       name,
                                                       address,
                                                       phoneNumber,
                                                       hours,
                                                       image,
                                                       onClick
                                                   }: HospitalCardProps) => {
    return (
        <div
        >
            <div
                className="h-36 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${image || '/api/placeholder/400/320'})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                    <h3 className="text-white font-bold text-lg truncate">{name}</h3>
                    <p className="text-white/90 text-sm truncate">{address}</p>
                </div>
            </div>

            <div className="p-3 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="mr-2 text-mgbblue flex-shrink-0" />
                    <span className="truncate">{phoneNumber}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2 text-mgbblue flex-shrink-0" />
                    <span className="truncate">{hours}</span>
                </div>

                <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                    <button className="flex items-center justify-center text-sm text-mgbblue hover:text-mgbblue/80 transition-colors font-medium">
                        <MapPin size={16} className="mr-1" />
                        View Location
                    </button>

                    <button className="flex items-center justify-center text-sm text-mgbblue hover:text-mgbblue/80 transition-colors font-medium">
                        <Navigation size={16} className="mr-1" />
                        Directions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HospitalCard;