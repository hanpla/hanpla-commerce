export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export interface DeliveryAddress {
  id: string;
  userId: string;
  name: string; // e.g. "집", "회사"
  recipient: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  isDefault: boolean;
}

export interface RecentViewedItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  brand: string;
  viewedAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthActionState {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

export const AUTH_INITIAL_STATE: AuthActionState = {
  success: false,
};
