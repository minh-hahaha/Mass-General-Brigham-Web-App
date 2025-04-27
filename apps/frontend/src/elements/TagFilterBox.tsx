import React, {useEffect, useState} from 'react';
import SelectElement from "@/elements/SelectElement.tsx";
import {getDirectory} from "@/database/gettingDirectory.ts";

type TagFilterBoxProps = {
    selectTitle: string;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    options: string[];
}

const TagFilterBox = ({selectTitle, tags, setTags, options}: TagFilterBoxProps) => {

    // Handle the input change
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTags((prevTags) => [...prevTags, e.target.value]);
    };

    // Delete tag
    const handleDeleteTag = (tagToDelete: string) => {
        setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
    };

    return (
        <div className="flex flex-col p-4 border border-gray-300 rounded-lg w-80">
            <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                    <div
                        className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                        key={index}
                    >
                        <span className="mr-2">{tag}</span>
                        <button
                            className="text-red-500 font-bold"
                            onClick={() => handleDeleteTag(tag)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
            <SelectElement
                label={selectTitle}
                placeholder={selectTitle}
                id={'selections'}
                value={''}
                onChange={handleInputChange}
                options={options}
            ></SelectElement>
        </div>
    );
};

export default TagFilterBox;
