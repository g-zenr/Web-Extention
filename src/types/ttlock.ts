export interface OfflineData {
  type: "offline";
  buildingNumber: string;
  floorNumber: string;
  lockMac: string;
  cardNumber: string;
  cardName: string;
  cardType: string;
  addType: string;
  startDate: string;
  expireDate: string;
}

export interface GatewayData {
  type: "gateway";
  guestName: string;
  roomNumber: string;
  buildingNumber: string;
  floorNumber: string;
  clientId: string;
  accessToken: string;
  lockId: string;
  cardNumber: string;
  cardName: string;
  cardType: string;
  addType: string;
  startDate: string;
  expireDate: string;
}

export type TTLockData = OfflineData | GatewayData;

export interface GatewayEncodeRequest {
  clientId: string;
  accessToken: string;
  lockId: string;
  cardNumber: string; // IC card id
  cardName: string; // The user name
  cardType: number;
  addType: number;
  startDate: number;
  endDate: number;
}

export interface GatewayEncodeResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface GuestInfo {
  guestName: string;
  roomNumber: string;
}

export interface ModalProps {
  guestName: string;
  roomNumber: string;
  onClose: () => void;
  onEncode: (data: TTLockData) => void;
}
