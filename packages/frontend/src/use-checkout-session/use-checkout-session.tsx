import * as React from 'react';
import { useMutation } from '@apollo/client';
import checkoutMutation from './create-checkout-session.graphql';

import * as Schema from '../merchant-types';

import { browserOnly } from '../utils/browserOnly';
import { noop } from '../utils/noop';

type Mutation = Schema.CreateCheckoutSessionMutation;
type Variables = Schema.CreateCheckoutSessionMutationVariables;

export enum CheckoutState {
  incomplete = 'incomplete',
  success = 'success',
  canceled = 'canceled',
}

export function useCheckoutSession() {
  const [state, setState] = React.useState(CheckoutState.incomplete);
  const [checkout, mutation] = useMutation<Mutation, Variables>(
    checkoutMutation
  );

  React.useEffect(() => {
    browserOnly(window => {
      if (!mutation.data) {
        return;
      }

      const url = mutation.data.createCheckoutSession.url;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      window.location.replace(url);
    }, noop);
  }, [mutation]);

  React.useEffect(() => {
    browserOnly(window => {
      // @ts-expect-error Fixme please make window types work
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const query = new window.URLSearchParams(window.location.search);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (query.get('success')) {
        setState(CheckoutState.success);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (query.get('canceled')) {
        setState(CheckoutState.canceled);
      }
    }, noop);
  }, []);

  return {
    checkout,
    mutation,
    state,
  };
}
