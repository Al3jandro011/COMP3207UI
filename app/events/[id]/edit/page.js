"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEvent, updateEvent } from '@/services/apiServices';

export default function EditEvent({ params }) {
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState(['']);
    const resolvedParams = React.use(params);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const dummyEvent = {
                    id: resolvedParams.id,
                    name: "Example Event 1",
                    description: "Example description 1",
                    imageUrl: "/example.jpg",
                    startTime: "2024-03-15T09:00:00",
                    endTime: "2024-03-17T18:00:00",
                    type: "non-compulsory",
                    location: "Building 46, 3020",
                    groups: ["COMP3200", "COMP3210", "COMP3220"],
                };

                setEvent(dummyEvent);
                setGroups(dummyEvent.groups);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event:', error);
                setLoading(false);
            }
        };

        fetchEvent();
    }, [resolvedParams.id]);

    const addGroup = () => {
        setGroups([...groups, '']);
    };

    const removeGroup = (index) => {
        setGroups(groups.filter((_, i) => i !== index));
    };

    const updateGroup = (index, value) => {
        const newGroups = [...groups];
        newGroups[index] = value;
        setGroups(newGroups);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formData = {
                id: resolvedParams.id,
                name: e.target.name.value,
                description: e.target.description.value,
                imageUrl: e.target.image.value,
                type: e.target.type.value,
                startTime: e.target.startTime.value,
                endTime: e.target.endTime.value,
                location: e.target.location.value,
                groups: groups,
                maxSpaces: e.target.maxSpaces.value,
            };

            // await updateEvent(formData);
            // updateEvent(formData); 
            router.push(`/events/${resolvedParams.id}`);
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update event. Please try again.');
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-400">Loading...</div>;
    }

    if (!event) {
        return <div className="p-8 text-gray-400">Event not found</div>;
    }

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-2">Edit Event</h1>
                <p className="text-gray-400">Update event details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">
                        Name <span className="text-red-400">*</span>
                    </label>
                    <input 
                        name="name"
                        defaultValue={event.name}
                        type="text" 
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                    />
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">
                        Description <span className="text-red-400">*</span>
                    </label>
                    <textarea 
                        name="description"
                        defaultValue={event.description}
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 min-h-[120px]"
                    />
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">Image URL</label>
                    <input 
                        name="image"
                        defaultValue={event.imageUrl}
                        type="url" 
                        placeholder="Enter image URL"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                    />
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">
                        Type <span className="text-red-400">*</span>
                    </label>
                    <select 
                        name="type"
                        defaultValue={event.type}
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                    >
                        <option value="compulsory">Compulsory</option>
                        <option value="non-compulsory">Non-compulsory</option>
                    </select>
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-4 text-gray-100 font-medium">
                        Groups <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-3">
                        {groups.map((group, index) => (
                            <div key={index} className="flex gap-2">
                                <input 
                                    type="text"
                                    value={group}
                                    onChange={(e) => updateGroup(index, e.target.value)}
                                    className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                                    required
                                />
                                {groups.length > 1 && (
                                    <button 
                                        type="button"
                                        onClick={() => removeGroup(index)}
                                        className="p-3 text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={addGroup}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Group</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">
                        Time Interval <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-4">
                        <input 
                            name="startTime"
                            type="datetime-local"
                            defaultValue={event.startTime}
                            required
                            className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                        />
                        <span className="flex items-center text-gray-400">to</span>
                        <input 
                            name="endTime"
                            type="datetime-local"
                            defaultValue={event.endTime}
                            required
                            className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">
                        Location <span className="text-red-400">*</span>
                    </label>
                    <input 
                        name="location"
                        defaultValue={event.location}
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                    />
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">
                        Maximum Spaces <span className="text-red-400">*</span>
                    </label>
                    <input 
                        name="maxSpaces"
                        defaultValue={event.maxSpaces}
                        type="number"
                        min="1"
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
                    >
                        Save Changes
                    </button>
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className="w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
} 