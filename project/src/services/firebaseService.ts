import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Burger, Category, CustomizationOption, Order } from '../types';

// Security: Input validation and sanitization
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Categories Service
export const categoriesService = {
  async getAll(): Promise<Category[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'categories'), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  },

  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const sanitizedCategory = {
        ...category,
        name: sanitizeInput(category.name),
        description: category.description ? sanitizeInput(category.description) : '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'categories'), sanitizedCategory);
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  },

  async update(id: string, updates: Partial<Category>): Promise<void> {
    try {
      const sanitizedUpdates = {
        ...updates,
        name: updates.name ? sanitizeInput(updates.name) : undefined,
        description: updates.description ? sanitizeInput(updates.description) : undefined,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(doc(db, 'categories', id), sanitizedUpdates);
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  },

  subscribe(callback: (categories: Category[]) => void) {
    return onSnapshot(
      query(collection(db, 'categories'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const categories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Category[];
        callback(categories);
      },
      (error) => {
        console.error('Error in categories subscription:', error);
      }
    );
  }
};

// Burgers Service
export const burgersService = {
  async getAll(): Promise<Burger[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'burgers'), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Burger[];
    } catch (error) {
      console.error('Error fetching burgers:', error);
      throw new Error('Failed to fetch burgers');
    }
  },

  async create(burger: Omit<Burger, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const sanitizedBurger = {
        ...burger,
        name: sanitizeInput(burger.name),
        ingredients: burger.ingredients.map(ing => sanitizeInput(ing)),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'burgers'), sanitizedBurger);
      return docRef.id;
    } catch (error) {
      console.error('Error creating burger:', error);
      throw new Error('Failed to create burger');
    }
  },

  async update(id: string, updates: Partial<Burger>): Promise<void> {
    try {
      const sanitizedUpdates = {
        ...updates,
        name: updates.name ? sanitizeInput(updates.name) : undefined,
        ingredients: updates.ingredients ? updates.ingredients.map(ing => sanitizeInput(ing)) : undefined,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(doc(db, 'burgers', id), sanitizedUpdates);
    } catch (error) {
      console.error('Error updating burger:', error);
      throw new Error('Failed to update burger');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'burgers', id));
    } catch (error) {
      console.error('Error deleting burger:', error);
      throw new Error('Failed to delete burger');
    }
  },

  subscribe(callback: (burgers: Burger[]) => void) {
    return onSnapshot(
      query(collection(db, 'burgers'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const burgers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Burger[];
        callback(burgers);
      },
      (error) => {
        console.error('Error in burgers subscription:', error);
      }
    );
  }
};

// Customization Options Service
export const customizationService = {
  async getAll(): Promise<CustomizationOption[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'customizations'), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as CustomizationOption[];
    } catch (error) {
      console.error('Error fetching customizations:', error);
      throw new Error('Failed to fetch customizations');
    }
  },

  async create(customization: Omit<CustomizationOption, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const sanitizedCustomization = {
        ...customization,
        name: sanitizeInput(customization.name),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'customizations'), sanitizedCustomization);
      return docRef.id;
    } catch (error) {
      console.error('Error creating customization:', error);
      throw new Error('Failed to create customization');
    }
  },

  async update(id: string, updates: Partial<CustomizationOption>): Promise<void> {
    try {
      const sanitizedUpdates = {
        ...updates,
        name: updates.name ? sanitizeInput(updates.name) : undefined,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(doc(db, 'customizations', id), sanitizedUpdates);
    } catch (error) {
      console.error('Error updating customization:', error);
      throw new Error('Failed to update customization');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'customizations', id));
    } catch (error) {
      console.error('Error deleting customization:', error);
      throw new Error('Failed to delete customization');
    }
  },

  subscribe(callback: (customizations: CustomizationOption[]) => void) {
    return onSnapshot(
      query(collection(db, 'customizations'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const customizations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as CustomizationOption[];
        callback(customizations);
      },
      (error) => {
        console.error('Error in customizations subscription:', error);
      }
    );
  }
};

// Orders Service
export const ordersService = {
  async getAll(): Promise<Order[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'orders'), orderBy('timestamp', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  },

  async create(order: Omit<Order, 'id'>): Promise<string> {
    try {
      // Ensure we do not persist a client-provided id field
      const { id: _omit, ...orderWithoutId } = order as unknown as Order & { id?: string };
      const sanitizedOrder = {
        ...orderWithoutId,
        customerName: sanitizeInput(orderWithoutId.customerName),
        comments: orderWithoutId.comments ? sanitizeInput(orderWithoutId.comments) : '',
        items: orderWithoutId.items.map(item => ({
          ...item,
          comments: item.comments ? sanitizeInput(item.comments) : ''
        })),
        timestamp: Timestamp.fromDate(orderWithoutId.timestamp)
      };
      
      const docRef = await addDoc(collection(db, 'orders'), sanitizedOrder);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  },

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    try {
      await updateDoc(doc(db, 'orders', id), { status, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error('Failed to delete order');
    }
  },

  subscribe(callback: (orders: Order[]) => void) {
    return onSnapshot(
      query(collection(db, 'orders'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as Order[];
        callback(orders);
      },
      (error) => {
        console.error('Error in orders subscription:', error);
      }
    );
  }
};

// Image Upload Service
export const imageService = {
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      // Security: Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      }
      
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
      }
      
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },

  async deleteImage(url: string): Promise<void> {
    try {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw error for image deletion as it's not critical
    }
  }
};