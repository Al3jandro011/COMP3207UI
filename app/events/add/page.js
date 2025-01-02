"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Add() {
    const [groups, setGroups] = useState(['']);
    const [imageType, setImageType] = useState('url');

    const addGroup = () => {
        setGroups([...groups, '']);
    };

    const removeGroup = (index) => {
        const newGroups = groups.filter((_, i) => i !== index);
        setGroups(newGroups);
    };

    const updateGroup = (index, value) => {
        const newGroups = [...groups];
        newGroups[index] = value;
        setGroups(newGroups);
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 px-4">Add New Event</h2>

            <form className="max-w-3xl mx-auto space-y-6 px-4">
                <div>
                    <label className="block mb-2 font-semibold">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        required
                        className="w-full p-2 border rounded-lg text-black"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                        required
                        className="w-full p-2 border rounded-lg text-black min-h-[100px]"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Image</label>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => setImageType('url')}
                                className={`px-4 py-2 rounded ${imageType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
                            >
                                URL
                            </button>
                            <button 
                                type="button"
                                onClick={() => setImageType('file')}
                                className={`px-4 py-2 rounded ${imageType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
                            >
                                Upload File
                            </button>
                        </div>
                        {imageType === 'url' ? (
                            <input 
                                type="url" 
                                placeholder="Enter image URL"
                                className="w-full p-2 border rounded-lg text-black"
                            />
                        ) : (
                            <input 
                                type="file" 
                                accept="image/*"
                                className="w-full p-2 border rounded-lg"
                            />
                        )}
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Type <span className="text-red-500">*</span>
                    </label>
                    <select required className="w-full p-2 border rounded-lg text-black">
                        <option value="compulsory">Compulsory</option>
                        <option value="non-compulsory">Non-compulsory</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Groups <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                        {groups.map((group, index) => (
                            <div key={index} className="flex gap-2">
                                <input 
                                    type="text"
                                    value={group}
                                    onChange={(e) => updateGroup(index, e.target.value)}
                                    className="flex-1 p-2 border rounded-lg text-black"
                                    required
                                />
                                {groups.length > 1 && (
                                    <button 
                                        type="button"
                                        onClick={() => removeGroup(index)}
                                        className="p-2 text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={addGroup}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            + Add Group
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Time Interval <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        <input 
                            type="datetime-local" 
                            required
                            className="flex-1 p-2 border rounded-lg text-black"
                        />
                        <span className="flex items-center">to</span>
                        <input 
                            type="datetime-local" 
                            required
                            className="flex-1 p-2 border rounded-lg text-black"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        required
                        className="w-full p-2 border rounded-lg text-black"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Maximum Spaces <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="number" 
                        min="1"
                        required
                        className="w-full p-2 border rounded-lg text-black"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button 
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Event
                    </button>
                    <Link 
                        href="/events"
                        className="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
