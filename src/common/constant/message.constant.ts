const generateMessage = (entity: string) => ({
  notFound: `${entity} not found`,
  alreadyExists: `${entity} already exists`,
  created: `${entity} created successfully`,
  updated: `${entity} updated successfully`,
  deleted: `${entity} deleted successfully`,
  failToCreate: `${entity} failed to create`,
  failToUpdate: `${entity} failed to update`,
  failToDelete: `${entity} failed to delete`,
});

export const message = {
  Category: { ...generateMessage('Category') },
  Brand: { ...generateMessage('Brand') },
  Product: { ...generateMessage('Product') },
};
