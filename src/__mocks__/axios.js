export default {
  get: jest.fn(() => {
    Promise.resolve({ data: {}, request: {} });
  }),
  post: jest.fn(() => {
    Promise.resolve({ status: 200, statusText: 'Ok' });
  })
};
