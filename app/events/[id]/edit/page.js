"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { getEvent, updateEvent, getLocations, getValidGroups, getAiResponse, getTags } from '@/services/apiServices';

const TEST_USER_ID = "836312bf-4d40-449e-a0ab-90c8c4f988a4";
const TEST_USER_EMAIL = "admin@example.com";

export default function EditEvent({ params }) {
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState(['']);
    const [types, setTypes] = useState(['']);
    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedBuildingId, setSelectedBuildingId] = useState('');
    const [availableGroups, setAvailableGroups] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [formKey, setFormKey] = useState(Date.now());
    const [selectedRoomCapacity, setSelectedRoomCapacity] = useState(null);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const resolvedParams = React.use(params);

    // TODO: Make sure tags/types work


    // Initialize date states with current date/time
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)); // Default 1 hour duration

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch locations, groups, tags and event
                const [locationsRes, groupsRes, tagsRes, eventRes] = await Promise.all([
                    getLocations(),
                    getValidGroups(),
                    getTags(),
                    getEvent({ event_id: resolvedParams.id })
                ]);

                const locations = locationsRes.data.locations || [];
                setBuildings(locations);
                setAvailableGroups(groupsRes.data.groups || []);
                setAvailableTags(tagsRes.data.tags || []);

                const eventData = eventRes.data;
                
                // Set event data
                setEvent(eventData);
                setGroups(eventData.groups || ['']);
                
                // Initialize types with the event type if it exists, otherwise use first available tag
                if (eventData.type) {
                    setTypes([eventData.type]);
                } else if (tagsRes.data.tags && tagsRes.data.tags.length > 0) {
                    setTypes([tagsRes.data.tags[0]]);
                }

                // Set dates from event data with fallback to current time
                setStartDate(eventData.start_date ? new Date(eventData.start_date) : new Date());
                setEndDate(eventData.end_date ? new Date(eventData.end_date) : new Date(Date.now() + 3600000));
                setSelectedRoomId(eventData.room_id);

                // Set building and room
                const building = locations.find(loc => loc.location_id === eventData.location_id);
                if (building) {
                    setSelectedBuilding(building.location_name);
                    setSelectedBuildingId(building.location_id);
                    setRooms(building.rooms || []);
                    
                    // Set initial room capacity
                    const selectedRoom = building.rooms?.find(room => room.room_id === eventData.room_id);
                    if (selectedRoom) {
                        setSelectedRoomCapacity(selectedRoom.capacity);
                    }
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
            setSelectedRoomCapacity(null); // Reset room capacity when building changes
        } else {
            setSelectedBuildingId('');
            setRooms([]);
            setSelectedRoomCapacity(null);
        }
    };

    const handleRoomChange = (e) => {
        const roomId = e.target.value;
        setSelectedRoomId(roomId);
        const selectedBuilding = buildings.find(b => b.location_id === selectedBuildingId);
        const selectedRoom = selectedBuilding?.rooms?.find(r => r.room_id === roomId);
        setSelectedRoomCapacity(selectedRoom?.capacity || null);
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

    const addType = () => {
        setTypes([...types, availableTags[0] || '']);
    };

    const removeType = (index) => {
        setTypes(types.filter((_, i) => i !== index));
    };

    const updateType = (index, value) => {
        const newTypes = [...types];
        newTypes[index] = value;
        setTypes(newTypes);
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
                user_id: TEST_USER_ID,
                name: e.target.name.value,
                type: types,
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
                    <label className="block mb-4 text-gray-100 font-medium">
                        Types <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-3">
                        {types.map((type, index) => (
                            <div key={index} className="flex gap-2">
                                <select
                                    value={type}
                                    onChange={(e) => updateType(index, e.target.value)}
                                    className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                                    required
                                >
                                    <option value="">Select a type</option>
                                    {availableTags.map((tag) => (
                                        <option key={tag} value={tag}>{tag}</option>
                                    ))}
                                </select>
                                {types.length > 1 && (
                                    <button 
                                        type="button"
                                        onClick={() => removeType(index)}
                                        className="p-3 text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={addType}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Add Type</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
                    <label className="block mb-4 text-gray-100 font-medium">
                        Groups <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-3">
                        {groups.map((group, index) => (
                            <div key={index} className="flex gap-2">
                                <select
                                    value={group}
                                    onChange={(e) => updateGroup(index, e.target.value)}
                                    className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                                    required
                                >
                                    <option value="">Select a group</option>
                                    {availableGroups.map((groupOption) => (
                                        <option key={groupOption} value={groupOption}>
                                            {groupOption}
                                        </option>
                                    ))}
                                </select>
                                {groups.length > 1 && (
                                    <button 
                                        type="button"
                                        onClick={() => removeGroup(index)}
                                        className="p-3 text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={addGroup}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
                        >
                            <PlusIcon className="w-4 h-4" />
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
                                value={startDate.toISOString().slice(0, 16)}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                required
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 text-sm text-gray-400">To</label>
                            <input 
                                name="endTime"
                                type="datetime-local"
                                value={endDate.toISOString().slice(0, 16)}
                                onChange={(e) => setEndDate(new Date(e.target.value))}
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
                        value={selectedRoomId}
                        onChange={handleRoomChange}
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
                    {selectedRoomCapacity !== null && (
                        <p className="mt-2 text-sm text-gray-400">
                            Room capacity: {selectedRoomCapacity} spaces
                        </p>
                    )}
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