import React, { useState, useEffect } from 'react';
import { Storage, ID } from 'appwrite';
import { client } from '../App';

const Gallery = ({ onLogout, coupleInfo }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const storage = new Storage(client);
  const BUCKET_ID = localStorage.getItem('bucketId');
  const coupleId = localStorage.getItem('coupleId');

  useEffect(() => {
    if (!BUCKET_ID) {
      setError('No bucket ID found. Please log out and log in again.');
      setLoading(false);
      return;
    }
    console.log('Gallery component mounted');
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      console.log('Loading images from bucket:', BUCKET_ID);
      const response = await storage.listFiles(BUCKET_ID);
      console.log('Images loaded:', response.files);
      // Filter images to only show those belonging to the current couple
      const coupleImages = response.files.filter(file => 
        file.permissions.includes(`user:${coupleId}`)
      );
      setImages(coupleImages);
    } catch (error) {
      console.error('Error loading images:', error);
      setError(`Failed to load images: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setError('');

    try {
      console.log('Uploading files:', files);
      const uploadPromises = files.map(async (file) => {
        // Create file with permissions only for the current couple
        const response = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          file,
          [`user:${coupleId}`] // This makes the file private to this couple
        );
        console.log('File uploaded:', response);
        return response;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setImages(prevImages => [...prevImages, ...uploadedFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
      setError(`Failed to upload images: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setSelectedImage(null);
  };

  const handlePreviousImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setSelectedImage(images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]);
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setSelectedImage(images[currentIndex === images.length - 1 ? 0 : currentIndex + 1]);
  };

  const handleDeleteImage = async (e, imageId) => {
    e.stopPropagation();
    try {
      await storage.deleteFile(BUCKET_ID, imageId);
      setImages(prevImages => prevImages.filter(img => img.$id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      setError(`Failed to delete image: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Private Gallery</h1>
          <p className="text-gray-600">
            {coupleInfo?.malePartnerName} & {coupleInfo?.femalePartnerName}
          </p>
        </div>
        <div className="flex gap-4">
          <label className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer">
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {uploading && (
        <div className="mb-4 text-sm text-gray-500">Uploading images...</div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {!error && images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No images uploaded yet. Click the "Upload Images" button to add some.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={image.$id}
            className="relative group cursor-pointer"
            onClick={() => handleImageClick(image, index)}
          >
            <img
              src={storage.getFileView(BUCKET_ID, image.$id)}
              alt={image.name}
              className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 rounded-lg flex items-center justify-center">
              <button
                onClick={(e) => handleDeleteImage(e, image.$id)}
                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-opacity duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFullscreen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={handleCloseFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            onClick={handlePreviousImage}
            className="absolute left-4 text-white hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            src={storage.getFileView(BUCKET_ID, selectedImage.$id)}
            alt={selectedImage.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          <button
            onClick={handleNextImage}
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 