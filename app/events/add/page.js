"use client";

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Add New Event</h1>
        <p className="text-gray-600 dark:text-gray-400">Create a new event</p>
      </div>

      <form className="space-y-8">
        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
            Name <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input type="text" required className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"/>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
            Description <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <textarea required className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 min-h-[120px]"/>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-4 text-gray-900 dark:text-gray-100 font-medium">Image</label>
          <div className="space-y-4">
            <div className="flex gap-4">
              <button type="button" onClick={() => setImageType('url')} className={`px-4 py-2 rounded-lg transition-all duration-200 ${imageType === 'url' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                URL
              </button>
              <button type="button" onClick={() => setImageType('file')} className={`px-4 py-2 rounded-lg transition-all duration-200 ${imageType === 'file' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                Upload File
              </button>
            </div>
            {imageType === 'url' ? (
              <input type="url" placeholder="Enter image URL" className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"/>
            ) : (
              <input type="file" accept="image/*" className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-300 dark:hover:file:bg-gray-600 file:cursor-pointer cursor-pointer"/>
            )}
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
            Type <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <select required className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200">
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
                <input type="text" value={group} onChange={(e) => updateGroup(index, e.target.value)} className="flex-1 px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200" required/>
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
          <div className="flex gap-4">
            <input type="datetime-local" required className="flex-1 px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"/>
            <span className="flex items-center text-gray-600 dark:text-gray-400">to</span>
            <input type="datetime-local" required className="flex-1 px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"/>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
            Location <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input type="text" required className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"/>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">
            Maximum Spaces <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input type="number" min="1" required className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"/>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none">
            Add Event
          </button>
          <Link href="/events" className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-200">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
