import * as React from 'react';
import { MutationResult } from '@apollo/client';
import {
  Input,
  InputNumber,
  Form as AntForm,
  Button,
  FormInstance,
  Typography,
  Card,
} from 'antd';

export enum FormItemType {
  string = 'string',
  text = 'text',
  number = 'number',
}

export interface FormItem {
  name: string;
  label: string;
  type: FormItemType;
  autoComplete?: string;
  icon?: React.ReactNode;
  formatter?: (value?: number) => string;
  parser?: (value?: string) => number;
}

export interface FormProps<T, M> {
  name: string;
  label: string;
  submitText: string;
  form: FormInstance<T>;
  items: FormItem[];
  mutation: MutationResult<M>;
  submit: (values: T) => Promise<unknown>;
}

export function Form<T, M>({
  name,
  submit,
  label,
  submitText,
  mutation,
  items,
  form,
}: FormProps<T, M>) {
  const handleFinish = async () => {
    const input = form.getFieldsValue(true) as T;
    await submit(input);
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Card>
      <Typography.Title level={2}>{label}</Typography.Title>
      <AntForm
        layout="vertical"
        name={name}
        form={form}
        onFinish={handleFinish}
      >
        {items.map(item => {
          switch (item.type) {
            case FormItemType.string: {
              return (
                <AntForm.Item
                  key={item.name}
                  label={item.label}
                  name={item.name}
                >
                  <Input
                    prefix={item.icon}
                    type="text"
                    autoComplete={item.autoComplete}
                  />
                </AntForm.Item>
              );
            }
            case FormItemType.text: {
              return (
                <AntForm.Item
                  key={item.name}
                  label={item.label}
                  name={item.name}
                >
                  <Input.TextArea
                    size="middle"
                    autoComplete={item.autoComplete}
                  />
                </AntForm.Item>
              );
            }

            case FormItemType.number: {
              return (
                <AntForm.Item
                  key={item.name}
                  label={item.label}
                  name={item.name}
                >
                  <InputNumber
                    formatter={item.formatter}
                    parser={item.parser}
                    style={{ width: '100%' }}
                    autoComplete={item.autoComplete}
                  />
                </AntForm.Item>
              );
            }
          }
        })}
        <AntForm.Item>
          <Button loading={mutation.loading} type="primary" htmlType="submit">
            {submitText}
          </Button>
          <Button type="link" onClick={handleReset}>
            Reset
          </Button>
        </AntForm.Item>
        <AntForm.Item>
          <AntForm.ErrorList
            errors={mutation.error?.graphQLErrors.map(error => {
              return (
                <Typography.Text type="danger" key={error.message}>
                  {error.message}
                </Typography.Text>
              );
            })}
          />
        </AntForm.Item>
      </AntForm>
    </Card>
  );
}
