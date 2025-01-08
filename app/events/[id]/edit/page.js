"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { getEvent, updateEvent, getLocationsAndGroups, getValidGroups, getAiResponse } from '@/services/apiServices';

export default function EditEvent({ params }) {
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState(['']);
    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedBuildingId, setSelectedBuildingId] = useState('');
    const [availableGroups, setAvailableGroups] = useState([]);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [formKey, setFormKey] = useState(Date.now());
    const resolvedParams = React.use(params);

    // Initialize date states
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch locations and groups
                const [locationsRes, groupsRes, eventRes] = await Promise.all([
                    getLocationsAndGroups(),
                    getValidGroups(),
                    getEvent({ event_id: resolvedParams.id })
                ]);

                const locations = locationsRes.data.locations || [];
                setBuildings(locations);
                setAvailableGroups(groupsRes.data.groups || []);

                const eventData = eventRes.data;
                
                // Set event data
                setEvent(eventData);
                setGroups(eventData.groups || ['']);
                setStartDate(new Date(eventData.start_date));
                setEndDate(new Date(eventData.end_date));

                // Set building and room
                const building = locations.find(loc => loc.location_id === eventData.location_id);
                if (building) {
                    setSelectedBuilding(building.location_name);
                    setSelectedBuildingId(building.location_id);
                    setRooms(building.rooms || []);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [resolvedParams.id]);

    const handleBuildingChange = (e) => {
        const building = e.target.value;
        setSelectedBuilding(building);
        
        const selectedBuildingData = buildings.find(loc => loc.location_name === building);
        if (selectedBuildingData) {
            setSelectedBuildingId(selectedBuildingData.location_id);
            setRooms(selectedBuildingData.rooms || []);
        } else {
            setSelectedBuildingId('');
            setRooms([]);
        }
    };

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

    const handleAssistantSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Sending prompt:', prompt);
            const response = await getAiResponse({ text: prompt });
            console.log('Raw API response:', response);
            
            if (response && response.data.result) {
                try {
                    console.log('Response message:', response.data.result);
                    
                    const jsonMatch = response.data.result.match(/\{[\s\S]*\}/);
                    console.log('JSON match:', jsonMatch);
                    
                    if (!jsonMatch) {
                        throw new Error('No JSON object found in response');
                    }
                    
                    const jsonString = jsonMatch[0];
                    const eventData = JSON.parse(jsonString);
                    
                    // Validate location
                    const locationExists = locations.includes(eventData.room_id);
                    if (!locationExists) {
                        alert(`Location "${eventData.room_id}" is not available. Please select from: ${locations.join(', ')}`);
                        eventData.room_id = '';
                    }

                    // Validate groups
                    let validGroups = [];
                    let invalidGroups = [];
                    if (eventData.groups && Array.isArray(eventData.groups)) {
                        eventData.groups.forEach(group => {
                            if (availableGroups.includes(group)) {
                                validGroups.push(group);
                            } else {
                                invalidGroups.push(group);
                            }
                        });

                        if (invalidGroups.length > 0) {
                            alert(`The following groups are not available: ${invalidGroups.join(', ')}\nPlease select from: ${availableGroups.join(', ')}`);
                        }
                    }

                    const formatDate = (dateString) => {
                        const date = new Date(dateString);
                        return date.toISOString().slice(0, 16);
                    };

                    setEvent({
                        ...event,
                        name: eventData.name || event.name,
                        desc: eventData.desc || event.desc,
                        img_url: eventData.img_url || event.img_url,
                        type: eventData.type || event.type,
                        room_id: eventData.room_id || event.room_id,
                        start_date: eventData.start_date || event.start_date,
                        end_date: eventData.end_date || event.end_date,
                        max_tick: eventData.max_tick || event.max_tick
                    });

                    // Update dates
                    if (eventData.start_date) setStartDate(new Date(eventData.start_date));
                    if (eventData.end_date) setEndDate(new Date(eventData.end_date));

                    // Only set valid groups
                    if (validGroups.length > 0) {
                        setGroups(validGroups);
                    }

                    setFormKey(Date.now());

                } catch (error) {
                    console.error('Error parsing AI response:', error);
                    alert('Failed to parse the AI response. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            alert('Failed to get AI response. Please try again.');
        }
        setIsAssistantOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const data = {
                event_id: resolvedParams.id,
                user_id: "6f94e0c5-4ff4-456e-bba4-bfd3d665059b",
                name: e.target.name.value,
                type: e.target.type.value,
                desc: e.target.description.value,
                location_id: selectedBuildingId,
                room_id: e.target.room.value,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                max_tick: parseInt(e.target.maxSpaces.value, 10),
                groups: groups,
                img_url: e.target.image.value,
            };

            await updateEvent(data);
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

    // Return the same form structure as Add Event, but with defaultValue/value set from event data
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
                        defaultValue={event.desc}
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 min-h-[120px]"
                    />
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">Image URL</label>
                    <input 
                        name="image"
                        defaultValue={event.img_url}
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
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block mb-1 text-sm text-gray-400">From</label>
                            <input 
                                name="startTime"
                                type="datetime-local"
                                defaultValue={event.start_date}
                                required
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 text-sm text-gray-400">To</label>
                            <input 
                                name="endTime"
                                type="datetime-local"
                                defaultValue={event.end_date}
                                required
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">
                        Location <span className="text-red-400">*</span>
                    </label>
                    <select 
                        name="location"
                        defaultValue={selectedBuilding}
                        value={selectedBuilding}
                        onChange={handleBuildingChange}
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                    >
                        <option value="">Select a location</option>
                        {buildings.map((building) => (
                            <option key={building.location_id} value={building.location_name}>
                                {building.location_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">
                        Room <span className="text-red-400">*</span>
                    </label>
                    <select 
                        name="room"
                        defaultValue={event.room_id}
                        value={event.room_id}
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                    >
                        <option value="">Select a room</option>
                        {rooms.map((room) => (
                            <option key={room.room_id} value={room.room_id}>
                                {room.room_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-2 text-gray-100 font-medium">
                        Maximum Spaces <span className="text-red-400">*</span>
                    </label>
                    <input 
                        name="maxSpaces"
                        defaultValue={event.max_tick}
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