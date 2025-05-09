import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('description', desc);
        formData.append('location', location);

        try {
            const res = await axios.post('/api/photos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Photo uploaded successfully!');
        } catch (err) {
            alert('Upload failed: ' + err.response?.data?.error || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 w-full max-w-xl p-4 bg-gray-100 rounded shadow">
            <label className="block mb-2">Photo Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-4 p-2 border rounded" required />

            <label className="block mb-2">Select a Photo:</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="mb-4 w-full" required />

            <label className="block mb-2">Location:</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mb-4 p-2 border rounded" required />

            {/* ... rest of the form ... */}
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300">
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
}
