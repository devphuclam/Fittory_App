import api from '../api/api';

export async function createCart(regionId: string) {
  try {
    const r = await api.post('/store/carts', {
      region_id: regionId,
    });
    console.log('Create Cart: ', r.data);
    return r;
  } catch (error) {
    console.error('Error creating cart:', error);
  }
}

export async function getCart(cartId: string) {
  try {
    const r = await api.get(`/store/carts/${cartId}`, {});
    console.log('Get Cart: ', r.data);
    return r;
  } catch (error) {
    console.error('Error getting cart:', error);
  }
}

export async function addItemToCart(
  cartId: string,
  variant: any,
  quantity: number
) {
  try {
    const r = await api.post(`/store/carts/${cartId}/line-items`, {
      variant_id: variant.id,
      quantity,
    });
    console.log('Add Item to Cart: ', r.data);
    return r;
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  try {
    const r = await api.post(
      `/store/carts/${cartId}/line-items/${lineItemId}`,
      {
        quantity,
      }
    );
    console.log('Update line Item: ', r.data);
    return r;
  } catch (error) {
    console.error('Error updating line item:', error);
  }
}

export async function removeLineItem(cartId: string, lineItemId: string) {
  try {
    const r = await api.delete(
      `/store/carts/${cartId}/line-items/${lineItemId}`
    );
    console.log('Remove line Item: ', r.data);
    return r;
  } catch (error) {
    console.error('Error removing line item:', error);
  }
}

export async function updateCartAddress(cartId: string, address: any) {
  try {
    const r = await api.post(`/store/carts/${cartId}`, {
      shipping_address: address,
    });
    return r;
  } catch (error) {
    console.error(
      'Error updating cart address:',
      (error as any)?.response?.data || error
    );
  }
}

export async function getShippingOptions(cartId: string) {
  try {
    const r = await api.get(`/store/shipping-options/`, {
      params: {
        cart_id: cartId,
      },
    });
    return r;
  } catch (error) {
    console.error(
      'Error getting shipping options:',
      (error as any)?.response?.data || error
    );
  }
}

export async function addShippingMethod(cartId: string, optionId: string) {
  try {
    const r = await api.post(`/store/carts/${cartId}/shipping-methods`, {
      option_id: optionId,
    });
    return r;
  } catch (error) {
    console.error(
      'Error adding shipping method:',
      (error as any)?.response?.data || error
    );
  }
}

export async function completeCart(cartId: string) {
  try {
    const r = await api.post(`/store/carts/${cartId}/complete`);
    console.log('Complete Cart: ', r.data);
    return r;
  } catch (error) {
    console.error(
      'Error completing cart:',
      (error as any)?.response?.data || error
    );
  }
}
