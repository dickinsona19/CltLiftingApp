import { View, TouchableOpacity, StyleSheet, Image, Text, ActivityIndicator } from 'react-native';
import { X, Upload, Camera, Trash2 } from 'lucide-react-native';
import React, { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { theme } from '@/constants/theme';

interface EditImageModalProps {
  setModalVisible: (visible: boolean) => void;
}

const EditImageModal = ({ setModalVisible }: EditImageModalProps) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<ImagePicker.ImagePickerResult | null>(null);
  const { user, updateUser } = useUser();
  const BASE_URL = 'https://boss-lifting-club-api.onrender.com';

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
    if (!file || !file.assets || !file.assets[0]?.uri) {
      setError('Please select an image first');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      const asset = file.assets[0];
  
      let localUri = asset.uri;
      let filename = asset.name || `profile_${user?.id}.jpg`;
      let mimeType = asset.mimeType || 'image/jpeg';
  
      // iOS URIs sometimes lack file:// prefix
      if (!localUri.startsWith('file://') && Platform.OS !== 'web') {
        localUri = 'file://' + localUri;
      }
  
      formData.append('file', {
        uri: localUri,
        name: filename,
        type: mimeType,
      } as any);
  
      const response = await fetch(`${BASE_URL}/users/${user?.id}/picture`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload image');
      }
  
      const data = await response.json();
      console.log('Image uploaded successfully:', data);
  
      await checkAuth();
      setModalVisible(false);
    } catch (error: any) {
      setError(error.message || 'Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePickImage = useCallback(async () => {
    console.log('handlePickImage called');
    setError(null);
  
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event: Event) => {
          const target = event.target as HTMLInputElement;
          const file = target?.files?.[0];
  
          if (file) {
            console.log('Selected image on web:', file);
  
            if (file.size > 5 * 1024 * 1024) {
              setError('Image size should be less than 5MB');
              return;
            }
  
            const fileUri = URL.createObjectURL(file);
            setProfilePicture(fileUri);
            setFile({
              assets: [{
                uri: fileUri,
                file,
                mimeType: file.type,
                name: file.name,
              }]
            });
          }
        };
        input.click();
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access media library was denied');
          return;
        }
  
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          allowsEditing: true,
          aspect: [1, 1],
        });
  
        if (result.canceled) {
          console.log('User cancelled image picker');
          return;
        }
  
        const selectedImage = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(selectedImage.uri);
        if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
          setError('Image size should be less than 5MB');
          return;
        }
  
        setFile({
          assets: [{
            uri: selectedImage.uri,
            mimeType: selectedImage.mimeType || 'image/jpeg', // Fallback
            name: selectedImage.fileName || `profile_${user?.id}.jpg`
          }]
        });
  
        setProfilePicture(selectedImage.uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      setError('Failed to pick image. Please try again.');
    }
  }, [user]);
  
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
            <Text style={styles.title}>Face Picture</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>Let's put a face to this account!</Text>

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
              <TouchableOpacity
                style={[styles.uploadButton, isLoading && styles.disabledButton]}
                onPress={() => {
                  console.log('Choose Image pressed');
                  handlePickImage();
                }}
                disabled={isLoading}
              >
                <Upload size={20} color="#1A1A1A" />
                <Text style={styles.uploadText}>
                  {profilePicture ? 'Choose Different Image' : 'Choose Image'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
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
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

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
    borderColor: theme.colors.primary,
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
    backgroundColor: theme.colors.primary,
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