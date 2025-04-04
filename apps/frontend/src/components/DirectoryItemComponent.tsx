import React from 'react';

interface DirectoryItemProps {
    item: {
        name: string;
        services: string;
        floor: string;
        phone: string;
        category: string;
    };
}

const DirectoryItem: React.FC<DirectoryItemProps> = ({ item }) => {
    return (
        <>
            <div>
                <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="md:w-1/2">
                        <h2 className="text-xl font-semibold text-blue-800">{item.name}</h2>
                        <p className="text-gray-600 mt-1">{item.services}</p>
                    </div>
                    <div className="md:w-1/2 mt-2 md:mt-0">
                        <div className="flex items-center gap-2 mb-1">

                            <span className="text-gray-700">{item.floor}</span>
                        </div>
                        <div className="flex items-center gap-2">

                            <a
                                href={`tel:${item.phone.replace(/\D/g, '')}`}
                                className="text-blue-600 hover:underline">
                                {item.phone}
                            </a>
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
        </>
    );
};
export default DirectoryItem;