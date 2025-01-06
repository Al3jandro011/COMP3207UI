"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { createEvent, getLocationsAndGroups, getAiResponse } from '@/services/apiServices';

export default function Add() {
  const [groups, setGroups] = useState(['']);
  const [locations, setLocations] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    type: 'non-compulsory',
    location: '',
    startTime: '',
    endTime: '',
    maxSpaces: ''
  });

  useEffect(() => {
    getLocationsAndGroups()
    .then((res) => {
      setLocations(/*res.data.locations ||*/ ["46/3020", "46/3021", "46/3022"]);
      setAvailableGroups(/*res.data.groups ||*/ ["COMP3200", "COMP3210", "COMP3220"]);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        user_id: "1",
        name: e.target.name.value,
        type: e.target.type.value,
        desc: e.target.description.value,
        location_id: e.target.location.value,
        start_date: e.target.startTime.value,
        end_date: e.target.endTime.value,
        max_tick: e.target.maxSpaces.value,
        max_tick_pp: 1,
        tags: groups,
        img_url: e.target.image.value,
      };
      
      const res = await createEvent(data);
      console.log(res);
      window.location.href = '/events';
    } catch (err) {
      console.error(err);
      alert(err.response.data.error);
    }
  };

  const handleAssistantSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await getAiResponse({ message: prompt });
      if (response && response.message) {
        try {
          const eventData = JSON.parse(response.message);
          setFormData({
            name: eventData.name || '',
            description: eventData.description || '',
            image: eventData.image || '',
            type: eventData.type || 'non-compulsory',
            location: eventData.location || '',
            startTime: eventData.startTime || '',
            endTime: eventData.endTime || '',
            maxSpaces: eventData.maxSpaces || ''
          });
          
          const form = document.forms[0];
          Object.keys(eventData).forEach(key => {
            if (form[key]) {
              form[key].value = eventData[key] || '';
            }
          });
        } catch (error) {
          console.error('Error parsing AI response:', error);
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
    setIsAssistantOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Add New Event</h1>
        <p className="text-gray-600 dark:text-gray-400">Create a new event</p>
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

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
            Name <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input name="name" type="text" required className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"/>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
            Description <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <textarea name="description" required className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 min-h-[120px]"/>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">Image URL</label>
          <input name="image" type="url" placeholder="Enter image URL" className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"/>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
            Type <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <select name="type" required className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200">
            <option value="compulsory">Compulsory</option>
            <option value="non-compulsory">Non-compulsory</option>
          </select>
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
                required 
                className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">To</label>
              <input 
                name="endTime" 
                type="datetime-local" 
                required 
                className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
            Location <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <select name="location" required className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200">
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
            Maximum Spaces <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input name="maxSpaces" type="number" min="1" required className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"/>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none">
            Add Event
          </button>
          <Link href="/events" className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-200">
            Cancel
          </Link>
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
