import * as types from './index';

export const isHarness = (obj: unknown): obj is types.Harness => {
  if (typeof obj === 'object' && obj !== null) {
    const harness = obj as types.Harness;
    return (
      typeof harness.id === 'string' &&
      typeof harness.order === 'number' &&
      typeof harness.openQty === 'number' &&
      harness.user !== undefined &&
      typeof harness.user.id === 'string' &&
      typeof harness.user.role === 'string' &&
      typeof harness.user.username === 'string' &&
      harness.template !== undefined &&
      typeof harness.template.id === 'string' &&
      typeof harness.template.name === 'string'
    );
  }
  return false;
};

export const isUserUpdate = (obj: unknown): obj is Extract<types.Selectors, { label: 'user' }> => {
  if (typeof obj === 'object' && obj !== null) {
    const update = obj as { label: string; operation: string };
    return update.label === 'user' && update.operation === 'update';
  }
  return false;
};

export const isTemplateUpdate = (
  obj: unknown,
): obj is Extract<types.Selectors, { label: 'template' }> => {
  if (typeof obj === 'object' && obj !== null) {
    const update = obj as { label: string; operation: string };
    return update.label === 'template' && update.operation === 'update';
  }
  return false;
};

export const isOpenQtyUpdate = (
  obj: unknown,
): obj is Extract<types.Selectors, { label: 'openQty' }> => {
  if (typeof obj === 'object' && obj !== null) {
    const update = obj as { label: string; operation: string };
    return update.label === 'openQty' && update.operation === 'update';
  }
  return false;
};

export const isHarnessDelete = (
  obj: unknown,
): obj is Extract<types.Selectors, { label: 'harness' }> => {
  if (typeof obj === 'object' && obj !== null) {
    const update = obj as { label: string; operation: string };
    return update.label === 'harness' && update.operation === 'delete';
  }
  return false;
};
