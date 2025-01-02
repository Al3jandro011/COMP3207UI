'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), {
    ssr: false
});

export default function Timetable() {
    const [compulsory, setCompulsory] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

    const compulsoryOptions = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
    ];

    const availableTags = [
        { value: 'math', label: 'Mathematics' },
        { value: 'science', label: 'Science' },
        { value: 'english', label: 'English' },
        { value: 'history', label: 'History' }
    ];

    const removeTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag.value !== tagToRemove.value));
    };

    const addTag = (newTag) => {
        if (newTag && !selectedTags.find(tag => tag.value === newTag.value)) {
            setSelectedTags([...selectedTags, newTag]);
        }
        setIsTagDropdownOpen(false);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Timetable</h1>
            
            <div className="mb-4">
                <label className="block mb-2">Compulsory:</label>
                <Select
                    value={compulsory}
                    onChange={setCompulsory}
                    options={compulsoryOptions}
                    className="w-48"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2">Group/s:</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag) => (
                        <div key={tag.value} 
                             className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2">
                            {tag.label}
                            <button
                                onClick={() => removeTag(tag)}
                                className="text-red-500 hover:text-red-700"
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
                    >
                        + Add Tag
                    </button>
                    
                    {isTagDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md border">
                            {availableTags
                                .filter(tag => !selectedTags.find(t => t.value === tag.value))
                                .map(tag => (
                                    <div
                                        key={tag.value}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => addTag(tag)}
                                    >
                                        {tag.label}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
						No events to show
        </div>
    );
}
