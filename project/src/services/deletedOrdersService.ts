import { 
  collection, 
  getDocs, 
  addDoc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order } from '../types';

export const deletedOrdersService = {
  async getAll(): Promise<Order[]> {
    const querySnapshot = await getDocs(query(collection(db, 'deleted_orders'), orderBy('deletedAt', 'desc')));
    return querySnapshot.docs.map(doc => {
      const data: any = doc.data();
      const items = Array.isArray(data.items) ? data.items : [];
      const mappedItems = items.map((it: any) => {
        if (it && it.burger && it.burger.id) return it;
        const burgerId = it.burgerId || (it.burger && it.burger.id) || 'unknown';
        const burgerName = it.burgerName || (it.burger && it.burger.name) || 'Unknown';
        const unitPrice = typeof it.unitPrice === 'number' ? it.unitPrice : (typeof it.price === 'number' ? it.price : 0);
        const categoryId = it.categoryId || '';
        return {
          burger: { id: burgerId, name: burgerName, price: unitPrice, image: '', ingredients: [], categoryId, createdAt: new Date(), updatedAt: new Date() },
          customizations: Array.isArray(it.customizations) ? it.customizations.map((c: any) => ({ id: c.id, name: c.name, type: c.type, price: c.price, isActive: true, createdAt: new Date(), updatedAt: new Date(), categoryId: c.categoryId })) : [],
          quantity: typeof it.quantity === 'number' ? it.quantity : 1,
          totalPrice: typeof it.totalPrice === 'number' ? it.totalPrice : (unitPrice * (typeof it.quantity === 'number' ? it.quantity : 1)),
          comments: it.comments
        };
      });
      return { ...data, id: doc.id, items: mappedItems, timestamp: data.timestamp?.toDate() || new Date(), deletedAt: data.deletedAt?.toDate() || new Date() } as Order & { deletedAt: Date };
    });
  },

  async create(order: Order): Promise<string> {
    const sanitizedOrder = {
      customerName: order.customerName.trim(),
      phoneNumber: order.phoneNumber.trim(),
      totalAmount: order.totalAmount,
      status: order.status,
      estimatedTime: order.estimatedTime,
      orderType: order.orderType,
      comments: order.comments ? order.comments.trim() : '',
      items: order.items.map(item => ({
        burgerId: item.burger.id,
        burgerName: item.burger.name,
        unitPrice: item.burger.price,
        categoryId: item.burger.categoryId,
        customizations: item.customizations.map(c => ({ id: c.id, name: c.name, type: c.type, price: c.price, categoryId: c.categoryId })),
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        comments: item.comments ? item.comments.trim() : ''
      })),
      timestamp: Timestamp.fromDate(order.timestamp),
      deletedAt: serverTimestamp(),
      originalOrderId: order.id
    };
    const docRef = await addDoc(collection(db, 'deleted_orders'), sanitizedOrder);
    return docRef.id;
  },

  subscribe(callback: (orders: Order[]) => void) {
    return onSnapshot(
      query(collection(db, 'deleted_orders'), orderBy('deletedAt', 'desc')),
      (snapshot) => {
        const orders = snapshot.docs.map(doc => {
          const data: any = doc.data();
          const items = Array.isArray(data.items) ? data.items : [];
          const mappedItems = items.map((it: any) => {
            if (it && it.burger && it.burger.id) return it;
            const burgerId = it.burgerId || (it.burger && it.burger.id) || 'unknown';
            const burgerName = it.burgerName || (it.burger && it.burger.name) || 'Unknown';
            const unitPrice = typeof it.unitPrice === 'number' ? it.unitPrice : (typeof it.price === 'number' ? it.price : 0);
            const categoryId = it.categoryId || '';
            return {
              burger: { id: burgerId, name: burgerName, price: unitPrice, image: '', ingredients: [], categoryId, createdAt: new Date(), updatedAt: new Date() },
              customizations: Array.isArray(it.customizations) ? it.customizations.map((c: any) => ({ id: c.id, name: c.name, type: c.type, price: c.price, isActive: true, createdAt: new Date(), updatedAt: new Date(), categoryId: c.categoryId })) : [],
              quantity: typeof it.quantity === 'number' ? it.quantity : 1,
              totalPrice: typeof it.totalPrice === 'number' ? it.totalPrice : (unitPrice * (typeof it.quantity === 'number' ? it.quantity : 1)),
              comments: it.comments
            };
          });
          return { ...data, id: doc.id, items: mappedItems, timestamp: data.timestamp?.toDate() || new Date(), deletedAt: data.deletedAt?.toDate() || new Date() } as Order & { deletedAt: Date };
        });
        callback(orders as unknown as Order[]);
      },
      () => {}
    );
  }
};

