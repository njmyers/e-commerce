import * as Got from 'got';

import { Address, Country } from '../../models';
import * as units from '../../constants/units';

export interface ShippoConstructorArgs {
  token: string;
  baseUrl: string;
}

export interface Parcel {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface Shipment {
  from: Address;
  to: Address;
  parcels: Parcel[];
}

export class Shippo {
  got: Got.Got;

  constructor({ token, baseUrl }: ShippoConstructorArgs) {
    this.got = Got.default.extend({
      prefixUrl: baseUrl,
      responseType: 'json',
      headers: {
        Authorization: `ShippoToken ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async createShipment(shipment: Shipment) {
    const payload = {
      async: false,
      address_from: convertAddressToShippoAddress(shipment.from),
      address_to: convertAddressToShippoAddress(shipment.to),
      parcels: shipment.parcels.map(parcel => {
        return {
          ...parcel,
          distance_unit: units.DISTANCE,
          mass_unit: units.MASS,
        };
      }),
    };

    return await this.got('shipments', {
      method: 'POST',
      json: payload,
    });
  }
}

interface ShippoAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip: string;
  country: Country;
}

function convertAddressToShippoAddress(address: Address): ShippoAddress {
  return {
    name: address.name,
    street1: address.addressLine1,
    street2: address.addressLine2,
    city: address.city,
    state: address.province,
    zip: address.postalCode,
    country: address.country,
  };
}
