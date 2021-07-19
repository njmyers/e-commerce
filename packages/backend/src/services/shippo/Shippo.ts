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
  from: ShippoAddressInput;
  to: ShippoAddressInput;
  parcels: Parcel[];
}

interface ShippoResponse {
  [key: string]: unknown;
}

type GotShippoResponse = Got.Response<ShippoResponse>;
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

  async createShipment(shipment: Shipment): Promise<GotShippoResponse> {
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return await this.got<ShippoResponse>('shipments', {
      method: 'POST',
      json: payload,
    });
  }
}

interface ShippoAddressInput extends Address {
  name: string;
  country: Country;
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

function convertAddressToShippoAddress(
  address: ShippoAddressInput
): ShippoAddress {
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
