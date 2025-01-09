"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { createEvent, getLocations, getValidGroups, getAiResponse, getTags } from '@/services/apiServices';
import { useAuth } from '@/contexts/AuthContext';


export default function Add() {
    const router = useRouter();
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
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        type: 'non-compulsory',
        location: '',
        startTime: '',
        endTime: '',
        max_tick: ''
    });
	const { user, loading: authLoading } = useAuth();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locationsRes, groupsRes, tagsRes] = await Promise.all([
                    getLocations(),
                    getValidGroups(),
                    getTags()
                ]);

                const locations = locationsRes.data.locations || [];
                setBuildings(locations);
                setAvailableGroups(groupsRes.data.groups || []);
                setAvailableTags(tagsRes.data.tags || []);

                if (tagsRes.data.tags && tagsRes.data.tags.length > 0) {
                    setTypes([tagsRes.data.tags[0]]);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBuildingChange = (e) => {
        const building = e.target.value;
        setSelectedBuilding(building);
        
        const selectedBuildingData = buildings.find(loc => loc.location_name === building);
        if (selectedBuildingData) {
            setSelectedBuildingId(selectedBuildingData.location_id);
            setRooms(selectedBuildingData.rooms || []);
            setSelectedRoomCapacity(null);
        } else {
            setSelectedBuildingId('');
            setRooms([]);
            setSelectedRoomCapacity(null);
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const data = {
                user_id: user?.id,
                name: formData.name,
                type: types,
                desc: formData.description,
                location_id: selectedBuildingId,
                room_id: selectedRoomId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                max_tick: parseInt(formData.max_tick, 10),
                groups: groups,
                img_url: formData.image,
            };

            await createEvent(data);
            router.push('/events');
        } catch (error) {
            console.error('Error creating event:', error);
            alert(error.response?.data?.error || 'Failed to create event. Please try again.');
        }
    };

    const handleAssistantSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Sending prompt:', prompt);
            const response = await getAiResponse({ text: prompt });
            console.log('Raw API response:', response);
            
            if (response && response.data.result) {
                try {
                    // Clean and format the JSON string
                    let jsonString = response.data.result;
                    
                    // Find JSON object between curly braces
                    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
                    if (!jsonMatch) {
                        throw new Error('No JSON object found in response');
                    }
                    
                    jsonString = jsonMatch[0]
                        // Replace single quotes with double quotes
                        .replace(/'/g, '"')
                        // Ensure property names are double-quoted
                        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
                        // Remove any trailing commas before closing brackets
                        .replace(/,(\s*[}\]])/g, '$1');

                    console.log('Cleaned JSON string:', jsonString);
                    
                    const eventData = JSON.parse(jsonString);
                    console.log('Parsed event data:', eventData);
                    
                    const buildingMatch = eventData.location_id.match(/\(([^)]+)\)/);
                    const buildingCode = buildingMatch ? buildingMatch[1] : eventData.location_id;
                    
                    const building = buildings.find(b => 
                        b.location_code?.toLowerCase() === buildingCode.toLowerCase() ||
                        b.location_name.toLowerCase().includes(eventData.location_id.toLowerCase())
                    );

                    console.log('Building search:', { buildingCode, building, locationId: eventData.location_id });

                    if (!building) {
                        alert(`Building "${eventData.location_id}" not found. Available buildings: ${buildings.map(b => `${b.location_name} (${b.location_code})`).join(', ')}`);
                    } else {
                        setSelectedBuilding(building.location_name);
                        setSelectedBuildingId(building.location_id);
                        setRooms(building.rooms || []);

                        if (eventData.room_id) {
                            const room = building.rooms?.find(r => 
                                r.room_code === eventData.room_id ||
                                r.room_name.includes(eventData.room_id) ||
                                r.room_id === eventData.room_id
                            );

                            if (room) {
                                setSelectedRoomId(room.room_id);
                                setSelectedRoomCapacity(room.capacity);
                            } else {
                                alert(`Room "${eventData.room_id}" not found in ${building.location_name}. Available rooms: ${building.rooms?.map(r => `${r.room_name} (${r.room_code})`).join(', ')}`);
                            }
                        }
                    }

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

                    setFormData({
                        name: eventData.name || '',
                        description: eventData.desc || '',
                        image: eventData.img_url || '',
                        type: 'non-compulsory',
                        location: building?.location_name || '',
                        startTime: formatDate(eventData.start_date) || '',
                        endTime: formatDate(eventData.end_date) || '',
                        max_tick: eventData.max_tick?.toString() || ''
                    });

                    if (validGroups.length > 0) {
                        setGroups(validGroups);
                    } else {
                        setGroups(['']);
                    }

                    setFormKey(Date.now());

                } catch (error) {
                    console.error('Error parsing AI response:', error);
                    console.log('Problematic JSON string:', response.data.result);
                    alert('Failed to parse the AI response. Please try rephrasing your request.');
                }
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            alert('Failed to get AI response. Please try again.');
        }
        setIsAssistantOpen(false);
    };

    if (loading) {
        return <div className="p-8 text-gray-400">Loading...</div>;
    }

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-2">Add New Event</h1>
                <p className="text-gray-400">Create a new event</p>
            </div>

            {isAssistantOpen && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-lg w-full mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            AI Assistant
                        </h2>
                        <form onSubmit={handleAssistantSubmit}>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the event you want to create..."
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 min-h-[120px]"
                            />
                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAssistantOpen(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg transition-all duration-200"
                                >
                                    Generate Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <form key={formKey} id="eventForm" className="space-y-4" onSubmit={handleSubmit}>
                <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                    <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
                        Name <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input 
                        name="name" 
                        type="text" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                    />
                </div>

                <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                    <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
                        Description <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <textarea 
                        name="description" 
                        required 
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 min-h-[120px]"
                    />
                </div>

                <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                    <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">Image URL</label>
                    <input 
                        name="image" 
                        type="url" 
                        placeholder="Enter image URL"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} 
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
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

                <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                    <label className="block mb-4 text-gray-900 dark:text-gray-100 font-medium">
                        Groups <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <div className="space-y-3">
                        {groups.map((group, index) => (
                            <div key={index} className="flex gap-2">
                                <select value={group} onChange={(e) => updateGroup(index, e.target.value)} className="flex-1 px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200" required>
                                    <option key="default" value="">Select a group</option>
                                    {availableGroups.map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                                {groups.length > 1 && (
                                    <button type="button" onClick={() => removeGroup(index)} className="p-3 text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 transition-colors">
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addGroup} className="text-cyan-500 dark:text-cyan-400 hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors flex items-center space-x-1">
                            <PlusIcon className="w-4 h-4" />
                            <span>Add Group</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                    <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
                        Time Interval <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">From</label>
                            <input
                                name="startTime"
                                type="datetime-local"
                                value={startDate.toISOString().slice(0, 16)}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                required
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">To</label>
                            <input
                                name="endTime"
                                type="datetime-local"
                                value={endDate.toISOString().slice(0, 16)}
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                                required
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
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
                        onChange={(e) => {
                            setSelectedRoomId(e.target.value);
                            const selectedRoom = rooms.find(r => r.room_id === e.target.value);
                            setSelectedRoomCapacity(selectedRoom?.capacity || null);
                        }}
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

                <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
                    <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
                        Maximum Spaces <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input 
                        name="max_tick" 
                        type="number" 
                        min="1" 
                        required 
                        value={formData.max_tick}
                        onChange={(e) => setFormData(prev => ({ ...prev, max_tick: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
                    >
                        Add Event
                    </button>
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className="w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAssistantOpen(true)}
                    className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white rounded-full shadow-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500/50 focus:outline-none flex items-center gap-2 z-40 group"
                >
                    <ChatBubbleLeftIcon className="w-6 h-6" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-200 ease-in-out">
                        Assistant
                    </span>
                </button>
            </form>
        </div>
    );
}
