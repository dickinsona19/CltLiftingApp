import { View, TouchableOpacity, StyleSheet, Image, Text, Pressable, ActivityIndicator, GestureResponderEvent } from 'react-native';
import { X, Upload, Camera, Trash2 } from 'lucide-react-native';
import React, { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInUp, 
  SlideOutDown
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EditImageModalProps {
  setModalVisible: (visible: boolean) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const EditImageModal = ({ setModalVisible }: EditImageModalProps) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { user, updateUser } = useUser();
  const BASE_URL = 'https://boss-lifting-club-api-1.onrender.com';

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}/auth/signin/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const userData = await response.json();
      updateUser(userData.user);
    } catch (error) {
      await AsyncStorage.removeItem('userToken');
      setError('Authentication error. Please sign in again.');
    }
  };

  const handleUpload = async (e?: React.FormEvent | GestureResponderEvent) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    
    if (!file) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('picture', file);

      const response = await fetch(`${BASE_URL}/users/${user?.id}/picture`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      await response.json();
      await checkAuth();
      setModalVisible(false);
    } catch (error) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read the selected file');
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setProfilePicture(null);
    setFile(null);
    setError(null);
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View 
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Animated.View 
          entering={SlideInUp.duration(300)}
          exiting={SlideOutDown.duration(200)}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Digital Access Card</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Update your profile picture
            </Text>

            {error && (
              <Animated.Text 
                entering={FadeIn}
                style={styles.errorText}
              >
                {error}
              </Animated.Text>
            )}

            {profilePicture ? (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: profilePicture }} 
                  style={styles.previewImage} 
                />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={handleRemoveImage}
                >
                  <Trash2 size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <Camera size={48} color="#666" />
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}

            <form onSubmit={handleUpload} style={{ width: '100%' }}>
              <View style={styles.uploadContainer}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <AnimatedPressable 
                    style={styles.uploadButton}
                    disabled={isLoading}
                  >
                    <Upload size={20} color="#1A1A1A" />
                    <Text style={styles.uploadText}>
                      {profilePicture ? 'Choose Different Image' : 'Choose Image'}
                    </Text>
                  </AnimatedPressable>
                </label>
              </View>

              <AnimatedPressable 
                style={[
                  styles.uploadButton, 
                  styles.submitButton,
                  !file && styles.disabledButton
                ]} 
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
            </form>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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