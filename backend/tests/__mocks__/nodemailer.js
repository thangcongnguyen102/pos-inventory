const sendMailMock = jest.fn((options, callback) => {
    callback(null, { response: "Email sent (mocked)" });
  });
  
  module.exports = {
    createTransport: jest.fn(() => ({
      sendMail: sendMailMock,
    })),
    // Expose the mock for verification
    __mock__: {
      sendMailMock,
    },
  };
  