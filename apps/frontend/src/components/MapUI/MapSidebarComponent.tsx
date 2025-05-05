import { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';


import MGBButton from '@/elements/MGBButton.tsx';
import {
    ArrowLeft,
    Navigation,
    MapPin,
    Phone,
    Clock,
    ChevronRight,
    Circle,
    Hospital,
} from 'lucide-react';

import clsx from 'clsx';
import TravelModeComponent from '@/components/TravelModeComponent.tsx';
import { MdOutlineMyLocation } from 'react-icons/md';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { CiHospital1 } from 'react-icons/ci';
import SelectElement from '@/elements/SelectElement.tsx';

import VoiceCommands from "@/components/MapUI/VoiceCommands.tsx";
import AlgorithmSelector from "@/components/AlgorithmSelector.tsx";

const hospitals = [
    {
        id: 1,
        name: 'Chestnut Hill Healthcare Center',
        address: '850 Boylston Street, Chestnut Hill, MA 02467',
        defaultParking: { lat: 42.326350183802454, lng: -71.14988541411569 },
        noneParking: { lat: 42.32629762650177, lng: -71.14951386955477 },
        phoneNumber: '(800) 294-9999',
        hours: 'Mon-Fri: 8:00 AM - 5:30 PM',
        image: '/HospitalCards/ChestnutHillCard.jpg',
        description: 'Very Cool Chestnut Hill Hospital',
        coordinates: {lat: 42.325988, lng: -71.149567, zoom: 18},
        voiceSearchKeywords: ['chestnut hill', 'chestnut', 'chestnut hill healthcare center'],
    },
    {
        id: 2,
        name: 'Foxborough Healthcare Center',
        address: '20-22 Patriot Place, Foxborough, MA 02035',
        defaultParking: { lat: 42.09222126540862, lng: -71.26646379537021 },
        noneParking: { lat: 42.09250362335946, lng: -71.26652247380247 },
        phoneNumber: '(508) 718-4000',
        hours: 'Mon-Sat: 8:00 AM - 8:00 PM',
        image: '/HospitalCards/PatriotPlaceCard.jpg',
        description: 'Very Cool Patriot Place',
        coordinates: {lat: 42.092617, lng: -71.266492, zoom: 18},
        voiceSearchKeywords: ['foxborough', 'patriot place', 'foxborough healthcare center'],

    },
    {
        id: 3,
        name: "Brigham and Women's Faulkner Hospital",
        address: '1153 Centre St, Jamaica Plain, MA 02130',
        defaultParking: { lat: 42.30110395876755, lng: -71.12754584282733 },
        noneParking: { lat: 42.30115920549337,lng: -71.1276378759752},
        phoneNumber: '(617) 983-7000',
        hours: 'Open 24 hours',
        image: '/HospitalCards/FaulknerHospitalCard.jpg',
        description: 'Very Cool Faulkner Hospital',
        coordinates: {lat: 42.301684739524546, lng: -71.12816396084828, zoom: 18},
        voiceSearchKeywords: ['faulkner hospital', 'faulkner'],
    },
    {
        id: 4,
        name: "Brigham and Women's Main Hospital",
        address: '75 Francis St, Boston, MA 02115',
        defaultParking: { lat: 42.335379397690076,lng: -71.10618363603308 },
        noneParking: { lat: 42.33539581679885, lng: -71.10609959004725 },
        phoneNumber: '(617) 732-5500',
        hours: 'Open 24 hours',
        image: '/HospitalCards/MGBMainCard.jpeg',
        description: 'Very Cool Main Hospital',
        coordinates: {lat: 42.33629683337891, lng: -71.1067533432466, zoom: 18},
        voiceSearchKeywords: ['main hospital', 'main'],

    }
]

type Step = 'SELECT_HOSPITAL' | 'HOSPITAL_DETAIL' | 'DIRECTIONS' | 'DEPARTMENT';

type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING';

type Algorithm = 'BFS' | 'DFS' | 'DIJKSTRA' |'A_STAR';

interface DirectoryItem {
    deptName: string;
    nodeId: string;
}

interface HospitalSidebarProps {
    onDirectionsRequest: (
        fromLocation: string,
        toLocation: string,
        toHospital: string,
        travelMode: TravelModeType
    ) => void;
    onHospitalSelect: (hospitalId: number) => void;
    onDepartmentSelect: (departmentNodeId: string) => void;
    onParkingSelect: (parkingId: string) => void;
    onClickingBack: (currentStep: string) => void;
    onClickFindDepartment: () => void;
    onChoosingAlgo: (algorithm: string) => void;
    onCheckIn: (checkIn: boolean) => void;
    directoryList: DirectoryItem[];
    setCurrentStepProp: React.Dispatch<React.SetStateAction<Step>>
    currentStep: Step;
}

const MapSidebarComponent = ({
    onDirectionsRequest,
    onHospitalSelect,
    onDepartmentSelect,
    onParkingSelect,
    onClickingBack,
    onClickFindDepartment,
    onCheckIn,
    onChoosingAlgo,
    directoryList,
    setCurrentStepProp,
    currentStep,
}: HospitalSidebarProps) => {
    const [selectedHospital, setSelectedHospital] = useState<(typeof hospitals)[0] | null>(null);

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [fromLocation, setFromLocation] = useState('');
    const [travelMode, setTravelMode] = useState<TravelModeType>('DRIVING');
    const [selectedLot, setSelectedLot] = useState('');
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('BFS');
    const [showLine, setShowLine] = useState<boolean>(false);

    const {isAuthenticated, user } = useAuth0();

    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        setIsAdmin(user?.["https://mgb.teamc.com/roles"]?.includes("Admin"));
        console.log("Admin", isAdmin);
    }, [isAuthenticated]);

    const placesLibrary = useMapsLibrary('places');

    // refs for autocomplete
    const fromLocationRef = useRef<HTMLInputElement | null>(null);
    // autocomplete
    useEffect(() => {
        if (!placesLibrary || !fromLocationRef.current) return;
        // autocomplete for origin
        const fromAutocomplete = new placesLibrary.Autocomplete(fromLocationRef.current, {
            types: ['geocode', 'establishment'],
            fields: ['place_id', 'geometry', 'formatted_address', 'name'],
            componentRestrictions: { country: 'us' }, // limit to US places
        });

        // event listeners so that when autocomplete the state is changed
        fromAutocomplete.addListener('place_changed', () => {
            const place = fromAutocomplete.getPlace();
            if (place.formatted_address) {
                setFromLocation(place.formatted_address);
            }
        });
    }, [placesLibrary]);

    const updateStep = (step: Step) => {
        sessionStorage.setItem('MAP_STEP', step);
        setCurrentStepProp(step);
    };

    // Handle Select Hospital
    const handleHospitalSelect = (hospital: (typeof hospitals)[0]) => {
        setSelectedHospital(hospital);
        updateStep('HOSPITAL_DETAIL');
        onHospitalSelect(hospital.id);
    };

    const handleFindDirections = () => {
        updateStep('DIRECTIONS');
    };

    const handleTravelModeChange = (mode: TravelModeType) => {
        setTravelMode(mode);
        setShowLine(true);

        // update mode
        if (selectedHospital && fromLocation) {
            let destination;
            if (mode != 'DRIVING') {
                destination =
                    selectedHospital.noneParking.lat.toString() +
                    ',' +
                    selectedHospital.noneParking.lng.toString();
            } else {
                destination =
                    selectedHospital.defaultParking.lat.toString() +
                    ',' +
                    selectedHospital.defaultParking.lng.toString();
            }
            setTimeout(() => {
                onDirectionsRequest(fromLocation, destination, selectedHospital.name, mode);
            }, 300);
        }
    };

    const handleDirectionsSubmit = () => {
        if (selectedHospital && fromLocation) {
            let destination;
            // Use the current travel mode to determine destination
            if (travelMode !== 'DRIVING') {
                destination =
                    selectedHospital.noneParking.lat.toString() +
                    ',' +
                    selectedHospital.noneParking.lng.toString();
            } else {
                destination =
                    selectedHospital.defaultParking.lat.toString() +
                    ',' +
                    selectedHospital.defaultParking.lng.toString();
            }
            onDirectionsRequest(fromLocation, destination, selectedHospital.name, travelMode);
        }
        setShowLine(true);
    };

    const handleFindDepartment = () => {
        onClickFindDepartment();
        updateStep('DEPARTMENT');
        setShowLine(false);
    };

    const handleLotSelect = (lot: string) => {
        setSelectedLot(lot);
        onParkingSelect(lot);
    };

    const handleDepartmentSelect = (deptName: string) => {
        setSelectedDepartment(deptName);
        const dept = directoryList.find((d) => d.deptName === deptName);
        if (dept) {
            onDepartmentSelect(dept.nodeId); // send back nodeId
        }
        setShowLine(true);
    };

    const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAlgorithm(e.target.value as Algorithm);
        onChoosingAlgo(e.target.value as Algorithm);
    };

    const handleBack = () => {
        if (currentStep === 'HOSPITAL_DETAIL') {
            onClickingBack(currentStep);
            updateStep('SELECT_HOSPITAL');
            setSelectedHospital(null);
        } else if (currentStep === 'DIRECTIONS') {
            onClickingBack(currentStep);
            updateStep('HOSPITAL_DETAIL');
            setShowLine(false);
            setTravelMode("DRIVING")
        } else if (currentStep === 'DEPARTMENT') {
            onClickingBack(currentStep);
            setSelectedLot('')
            updateStep('DIRECTIONS');
            setCheckIn(false);

        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const latLng = `${latitude}, ${longitude}`;
                setFromLocation(latLng); // this triggers map routing

                //reverse geocode to get a human-readable address
                try {
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode(
                        { location: { lat: latitude, lng: longitude } },
                        (results, status) => {
                            if (status === 'OK' && results && results[0]) {
                                setFromLocation(results[0].formatted_address);
                            } else {
                                console.warn('Geocoder failed: ', status);
                            }
                        }
                    );
                } catch (error) {
                    console.error('Reverse geocoding failed', error);
                }
            },
            (error) => {
                console.error('Error retrieving location:', error);
                alert('Unable to retrieve your location.');
            }
        );

    }

    const [checkIn, setCheckIn] = useState(false)
    const handleToggle = () => {
        const toggle = !checkIn;
        setCheckIn(toggle);
        onCheckIn(toggle)
        handleDepartmentSelect(selectedDepartment);

    }

    //handle voice transcript
    const handleVoiceTranscript = (transcript: string) => {
        if (!transcript) {
            return;
        }
        const transcriptLowercase = transcript.toLowerCase()
       // console.log(transcriptLowercase);



        let foundHospital = undefined;

        for(let i = 0; i < hospitals.length; i++) {

            const currentHospital = hospitals[i];

            const currentHospitalKeywordArray = currentHospital.voiceSearchKeywords;

            for (let j = 0; j < currentHospitalKeywordArray.length; j++) {

                const currentHospitalKeyword = currentHospitalKeywordArray[j];

                if (transcriptLowercase.includes(currentHospitalKeyword.toLowerCase())) {

                    foundHospital = currentHospital;

                    // console.log("FOUND YOU DAMN KEYWORD: ", currentHospitalKeyword);
                    //
                    // console.log(foundHospital);

                    break;

                }

            }
            if(foundHospital) {
                break;
            }
        }

        if (foundHospital) {
            handleHospitalSelect(foundHospital);
            handleFindDirections();
            handleUseCurrentLocation();
        }

    }



    // step 1: selection card
    const renderHospitalSelection = () => (
        <div className='w-full'>
            <div className='flex justify-center'>
                <h2 className='text-2xl font-black mb-6 text-center mr-10 pt-2.5'>Select a Hospital</h2>
                <VoiceCommands voiceTranscript={handleVoiceTranscript}/>
            </div>

            <div className='space-y-4 mt-4'>
                {hospitals.map (hospital => (
                    <div
                        key={hospital.id}
                        onClick={() => handleHospitalSelect(hospital)}
                        className="relative cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div
                            className="h-40 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${hospital.image || '/api/placeholder/400/320'})`,
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                                <h3 className="text-white font-bold text-lg">{hospital.name}</h3>
                                <p className="text-white/90 text-sm">{hospital.address}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // step 2 - hospital details
    const renderHospitalDetail = () => {
        if (!selectedHospital) return null;

        return (
            <div className="w-full overflow-hidden">
                <div className="flex items-center mb-4">
                    <button
                        onClick={handleBack}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-lg font-bold text-codGray ml-2 truncate">
                        {selectedHospital.name}
                    </h2>
                </div>

                <div
                    className="h-40 bg-cover bg-center rounded-md mb-4 relative"
                    style={{ backgroundImage: `url(${selectedHospital.image})` }}
                />
                <div className="space-y-4 mb-6">
                    <p className="text-sm text-codGray">{selectedHospital.description}</p>
                    <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                        <div className="flex items-start">
                            <MapPin size={16} className="text-mgbblue mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm text-codGray">{selectedHospital.address}</p>
                        </div>

                        <div className="flex items-start">
                            <Phone size={16} className="text-mgbblue mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm text-codGray">{selectedHospital.phoneNumber}</p>
                        </div>

                        <div className="flex items-start">
                            <Clock size={16} className="text-mgbblue mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm text-codGray">{selectedHospital.hours}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 flex justify-center">
                    <MGBButton
                        onClick={handleFindDirections}
                        variant={'secondary'}
                        disabled={false}
                    >
                        <div className="flex items-center">
                            <Navigation size={18} className="text-mgbblue mr-3 fill-mgbblue" />
                            <span className="font-medium">Get Directions</span>
                            <ChevronRight size={18} />
                        </div>
                    </MGBButton>
                </div>
            </div>
        );
    };

    // step 3 - google maps
    const renderDirections = () => {
        if (!selectedHospital) return null;
        return (
            <div className="w-full overflow-hidden">
                {/* Back button */}
                <div className="flex items-center mb-4">
                    <button
                        onClick={handleBack}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-lg font-bold text-codGray ml-2 truncate">
                        Directions to {selectedHospital.name}
                    </h2>
                </div>

                <div className="flex gap-4 relative">
                    {/* Breadcrumb Line + Icons */}
                    <div className="flex flex-col items-center pt-1">
                        {/* Map icon */}
                        <div className="text-codGray p-1 text-xl mt-6">
                            <Circle size={18} />
                        </div>
                        {/* Line */}
                        <div className="h-6 border-l-2 border-dotted border-codGray" />
                        {/* Pin icon */}
                        <div className="text-codGray p-1 text-xl">
                            <MapPin size={18} />
                        </div>
                    </div>

                    {/* Form Inputs */}
                    <div className="flex-1 flex-col">
                        <div className="mt-5">
                            {/* From location with current location button */}
                            <div className="flex items-center mb-3">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        id="fromLocation"
                                        ref={fromLocationRef}
                                        value={fromLocation}
                                        onChange={(e) => setFromLocation(e.target.value)}
                                        required
                                        placeholder="Choose a starting point..."
                                        className="w-full p-2 border border-mgbblue rounded-sm bg-white text-codGray placeholder:text-codGray focus:ring-2 focus:ring-white pr-8"
                                    />
                                    <button
                                        onClick={handleUseCurrentLocation}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        <MdOutlineMyLocation
                                            className="text-mgbblue min-w-[20px]"
                                            size={18}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Destination input */}
                            <input
                                type="text"
                                value={selectedHospital.name}
                                readOnly
                                className="w-full p-2 border border-mgbblue rounded-sm bg-white text-codGray placeholder:text-codGray focus:ring-2 focus:ring-white mb-4"
                            />

                            {/* Travel Mode */}
                            <div className="mt-4 mb-4 ml-8">
                                <TravelModeComponent
                                    selectedMode={travelMode}
                                    onChange={handleTravelModeChange}
                                />
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-row gap-2">
                                <MGBButton
                                    onClick={handleDirectionsSubmit}
                                    disabled={!fromLocation}
                                    variant={'primary'}
                                    className="hover:bg-mgbblue/90 transition disabled:opacity-50 mb-4"
                                >
                                    <span className="font-medium">Get Directions</span>
                                </MGBButton>
                                <MGBButton
                                    onClick={handleFindDepartment}
                                    disabled={false}
                                    variant={'secondary'}
                                    className="hover:bg-yellow-600/90 transition disabled:opacity-50 mb-4"
                                >
                                    <span className="font-medium">Find Department</span>
                                </MGBButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // step 4 - pathfinding
    const renderDepartments = () => {
        if (!selectedHospital) return null;

        return (
            <div className="w-full overflow-hidden">
                {/*Back button*/}
                <div className="flex items-center mb-4">
                    <button
                        onClick={handleBack}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-lg font-bold text-codGray ml-2 truncate">
                        Directions to {selectedHospital.name}
                    </h2>
                </div>

                {/*Parking Lot Choosing*/}
                {travelMode === 'DRIVING' && (
                    <div className="mb-6">
                        {(selectedHospital.id !== 4 &&
                            <div>
                                <p className="mb-2 text-sm text-codGray text-center font-bold">
                                Where did you park?
                                </p>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {['A', 'B', 'C'].map((lot) => (
                                        <button
                                            key={lot}
                                            onClick={() =>
                                                handleLotSelect(
                                                    `${
                                                        selectedHospital.id === 1
                                                            ? 'CH'
                                                            : selectedHospital.id === 3
                                                                ? 'FK'
                                                                : selectedHospital.id === 2
                                                                    ? 'PP'
                                                                    : "BWH"
                                                    }_${lot}`
                                                )
                                            }
                                            className={clsx(
                                                'py-1 rounded-sm transition',
                                                selectedLot ===
                                                `${
                                                    selectedHospital.id === 1
                                                        ? 'CH'
                                                        : selectedHospital.id === 3
                                                            ? 'FK'
                                                            : selectedHospital.id === 2
                                                                ? 'PP'
                                                                : "BWH"
                                                }_${lot}`
                                                    ? 'bg-mgbblue text-white'
                                                    : 'bg-white text-codGray border border-mgbblue hover:bg-mgbblue hover:text-white'
                                            )}
                                        >
                                            Lot {lot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {(selectedHospital.id === 4 &&
                            <div>
                                <p className="mb-2 text-sm text-codGray text-center font-bold">
                                    Where did you park?
                                </p>
                                <div className="w-full mb-4">
                                    <button
                                        onClick={() =>
                                            handleLotSelect("BWH_A")
                                        }
                                        className={clsx(
                                            'w-full py-2 rounded-sm transition text-center',
                                            selectedLot ===
                                            "BWH_A"
                                                ? 'bg-mgbblue text-white'
                                                : 'bg-white text-codGray border border-mgbblue hover:bg-mgbblue hover:text-white'
                                        )}
                                    >
                                        Lot A
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                <div className="flex items-center justify-between">
                    <p className="mb-2 text-sm text-codGray font-bold">Stop at Check-In desk?</p>

                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer mr-1">
                        <input type="checkbox" className="sr-only peer" checked={checkIn} onChange={handleToggle} />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-mgbblue transition-all duration-300"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-full"></div>
                    </label>
                </div>


                {/*Select Department for Pathfinding*/}
                <div className="mb-6">
                    <p className="mb-2 text-sm text-codGray font-bold">Select Department:</p>
                    <div className="max-h-[300px] overflow-y-auto border border-gray-300 rounded-md">
                        {directoryList.length === 0 ? (
                            <p className="p-4 text-center text-gray-500">
                                No departments available
                            </p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {directoryList.map((dept, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleDepartmentSelect(dept.deptName)}
                                        className={clsx(
                                            'p-3 cursor-pointer hover:bg-gray-100',
                                            selectedDepartment === dept.deptName ? 'bg-blue-50' : ''
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <CiHospital1
                                                size={18}
                                                className="text-mgbblue mr-5 w-5 h-5"
                                            />

                                            <span>{dept.deptName}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div>
                    { isAdmin && (
                        <SelectElement
                            label={'Select Algorithm'}
                            id={'algorithm'}
                            value={selectedAlgorithm}
                            onChange={handleAlgorithmChange}
                            options={['BFS', 'DFS','Dijkstra','A_STAR']}
                        />
                    )}

                </div>
            </div>
        );
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'SELECT_HOSPITAL':
                return renderHospitalSelection();
            case 'HOSPITAL_DETAIL':
                return renderHospitalDetail();
            case 'DIRECTIONS':
                return renderDirections();
            case 'DEPARTMENT':
                return renderDepartments();
            default:
                return renderHospitalSelection();
        }
    };

    return <div className="overflow-y-auto">{renderStep()}</div>;
};

export default MapSidebarComponent;
