export interface Size {
  length: number;
  height: number;
  width: number;
}

export interface ShippingBox {
  size: Size;
  price: number;
}
