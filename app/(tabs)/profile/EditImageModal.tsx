import { View, TouchableOpacity, StyleSheet, Image, Text, Pressable, ActivityIndicator } from 'react-native';
import { X, Upload, Camera, Trash2 } from 'lucide-react-native';
import React, { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

interface EditImageModalProps {
  setModalVisible: (visible: boolean) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const EditImageModal = ({ setModalVisible }: EditImageModalProps) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<ImagePicker.ImagePickerResult | null>(null);
  const { user, updateUser } = useUser();
  const BASE_URL = 'https://boss-lifting-club.onrender.com';

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${BASE_URL}/auth/signin/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Authentication failed');

      const userData = await response.json();
      updateUser(userData.user);
    } catch (error) {
      await AsyncStorage.removeItem('userToken');
      setError('Authentication error. Please sign in again.');
    }
  };

  const handleUpload = async () => {
    // Check if file exists and is in the correct format
    if (!file) {
      setError('Please select an image first');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
  
      // Handle file based on platform (web vs mobile)
      if (file instanceof File) {
        // Web: File object from <input type="file">
        formData.append('picture', file, file.name || 'profile.jpg');
      } else if (file?.assets?.[0]?.uri) {
        // Mobile: React Native image picker
        const image = file.assets[0];
        const blob = await fetch(image.uri).then(res => res.blob()); // Fetch the image as a Blob
        formData.append('picture', blob, image.fileName || 'profile.jpg'); // Append the Blob
      } else {
        throw new Error('Unsupported file format');
      }
  
      const response = await fetch(`${BASE_URL}/users/${user?.id}/picture`, {
        method: 'PUT',
        body: formData,
        // Let the browser set Content-Type automatically for FormData
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload image');
      }
  
      await response.json();
      await checkAuth();
      setModalVisible(false);
    } catch (error) {
      setError(error.message || 'Failed to upload image. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickImage = useCallback(async () => {
    setError(null);

    // Request permission if not already granted
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access media library was denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true, // Optional: allows cropping
      aspect: [1, 1], // Optional: enforces square aspect ratio
    });

    if (result.canceled) {
      console.log('User cancelled image picker');
    } else if (result.assets && result.assets[0]) {
      const selectedImage = result.assets[0];
      // Validate file size (max 5MB)
      if (selectedImage.fileSize && selectedImage.fileSize > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setFile(result);
      setProfilePicture(selectedImage.uri);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setProfilePicture(null);
    setFile(null);
    setError(null);
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.overlay}>
        <Animated.View entering={SlideInUp.duration(300)} exiting={SlideOutDown.duration(200)} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Digital Access Card</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>Update your profile picture</Text>

            {error && (
              <Animated.Text entering={FadeIn} style={styles.errorText}>
                {error}
              </Animated.Text>
            )}

            {profilePicture ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: profilePicture }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
                  <Trash2 size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <Camera size={48} color="#666" />
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}

            <View style={styles.uploadContainer}>
              <AnimatedPressable style={styles.uploadButton} onPress={handlePickImage} disabled={isLoading}>
                <Upload size={20} color="#1A1A1A" />
                <Text style={styles.uploadText}>
                  {profilePicture ? 'Choose Different Image' : 'Choose Image'}
                </Text>
              </AnimatedPressable>

              <AnimatedPressable
                style={[styles.uploadButton, styles.submitButton, !file && styles.disabledButton]}
                onPress={handleUpload}
                disabled={!file || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#1A1A1A" />
                ) : (
                  <Text style={styles.uploadText}>
                    {profilePicture ? 'Update Picture' : 'Upload Picture'}
                  </Text>
                )}
              </AnimatedPressable>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    width: '90%',
    maxWidth: 500,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  subtitle: {
    color: '#999999',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  removeButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#FF4444',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#1A1A1A',
  },
  placeholderContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  placeholderText: {
    color: '#666666',
    marginTop: 12,
    fontSize: 14,
  },
  uploadContainer: {
    width: '100%',
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#D4AF37',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  uploadText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditImageModal;