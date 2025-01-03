'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Select = dynamic(() => import('react-select'), {
  ssr: false
});

export default function Timetable() {
  const [compulsory, setCompulsory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  const compulsoryOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'all', label: 'All' }
  ];

  const availableTags = [
    { value: 'comp3200', label: 'COMP3200' },
    { value: 'comp3227', label: 'COMP3227' },
    { value: 'comp3228', label: 'COMP3228' },
    { value: 'comp3229', label: 'COMP3229' },
    { value: 'comp3230', label: 'COMP3230' },
    { value: 'comp3231', label: 'COMP3231' },
    { value: 'comp3232', label: 'COMP3232' },
    { value: 'comp3233', label: 'COMP3233' },
    { value: 'comp3234', label: 'COMP3234' },
    { value: 'comp3235', label: 'COMP3235' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'football', label: 'Football' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'tabletennis', label: 'Table Tennis' },
    { value: 'chess', label: 'Chess' }
  ];

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      background: 'rgb(31 41 55 / 0.5)',
      borderColor: state.isFocused ? '#22d3ee' : 'rgb(55 65 81 / 0.5)',
      boxShadow: state.isFocused ? '0 0 0 1px #22d3ee' : 'none',
      '&:hover': {
        borderColor: '#22d3ee'
      }
    }),
    menu: (base) => ({
      ...base,
      background: 'rgb(31 41 55)',
      border: '1px solid rgb(55 65 81 / 0.5)',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? 'rgb(55 65 81)' : 'transparent',
      color: 'rgb(209 213 219)',
      '&:hover': {
        backgroundColor: 'rgb(55 65 81)',
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: 'rgb(209 213 219)'
    }),
    input: (base) => ({
      ...base,
      color: 'rgb(209 213 219)'
    })
  };

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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Timetable</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your event schedule</p>
      </div>
      
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-2 text-gray-900 dark:text-gray-100 font-medium">Compulsory Events:</label>
          <Select value={compulsory} onChange={setCompulsory} options={compulsoryOptions} className="w-48" styles={customSelectStyles} />
        </div>

        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <label className="block mb-4 text-gray-900 dark:text-gray-100 font-medium">Groups:</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((tag) => (
              <div key={tag.value} className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-gray-700 dark:text-gray-300">
                {tag.label}
                <button onClick={() => removeTag(tag)} className="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 transition-colors">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="relative">
            <button onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none flex items-center space-x-2"><PlusIcon className="w-4 h-4" /><span>Add Group</span></button>
            
            {isTagDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700/50">
                {availableTags
                  .filter(tag => !selectedTags.find(t => t.value === tag.value))
                  .map(tag => (
                    <div key={tag.value} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300 first:rounded-t-xl last:rounded-b-xl transition-colors duration-150" onClick={() => addTag(tag)}>{tag.label}</div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div className="text-gray-600 dark:text-gray-400 text-center py-8">No events to show</div>
        </div>
      </div>
    </div>
  );
}
