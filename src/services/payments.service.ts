import api from '../api/api';

export async function createPaymentCollection(cartId: string) {
  try {
    const r = await api.post('/store/payment-collections', {
      cart_id: cartId,
    });
    console.log('Create Payment Collection: ', r.data);
    return r;
  } catch (error) {
    console.error(
      'Error creating payment collection:',
      (error as any)?.response?.data || error
    );
  }
}

export async function initializePaymentSession(
  paymentCollectionId: string,
  providerId: string
) {
  try {
    const r = await api.post(
      `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
      {
        provider_id: providerId,
      }
    );
    console.log('Initialize Payment Session: ', r.data);
    return r;
  } catch (error) {
    console.error(
      'Error initializing payment session:',
      (error as any)?.response?.data || error
    );
  }
}
