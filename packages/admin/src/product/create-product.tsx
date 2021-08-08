import * as React from 'react';

import { Form as AntForm } from 'antd';
import { Form, FormItem, FormItemType } from '../components';

import { useCreateProduct } from './use-create-product';
import { CreateProductInput } from '../types';

const items: FormItem[] = [
  {
    name: 'name',
    label: 'Name',
    type: FormItemType.string,
  },
  {
    name: 'description',
    label: 'Description',
    type: FormItemType.text,
  },
  {
    name: 'price',
    label: 'Price (cents)',
    type: FormItemType.number,
  },
  {
    name: 'mass',
    label: 'Mass (g)',
    type: FormItemType.number,
  },
  {
    name: 'length',
    label: 'Length (mm)',
    type: FormItemType.number,
  },
  {
    name: 'width',
    label: 'Width (mm)',
    type: FormItemType.number,
  },
  {
    name: 'height',
    label: 'Height (mm)',
    type: FormItemType.number,
  },
];

export interface CreateProductProps {
  shop: { id: string };
}

export function CreateProduct({ shop }: CreateProductProps) {
  const [form] = AntForm.useForm();
  const [createProduct, mutation] = useCreateProduct();

  const submit = async (input: CreateProductInput): Promise<void> => {
    await createProduct({
      variables: {
        shopId: Number(shop.id),
        input,
      },
    });
  };

  return (
    <Form
      label="Create Product"
      name="create-product"
      submitText="Create"
      submit={submit}
      form={form}
      items={items}
      mutation={mutation}
    />
  );
}
