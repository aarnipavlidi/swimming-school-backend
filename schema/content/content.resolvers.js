const Contents = require('../../models/contents');

const resolvers = {
  Query: {

    showCurrentContent: async () => {
      try {
        const getContent = await Contents.find({});
        return getContent;
      } catch (error) {
        throw error
      }
    },
  },

  Mutation: {

    updatePricing: async (_, { OneTimeSolo, OneTimeDuo, ThreeTimeSolo, ThreeTimeDuo, FiveTimeSolo, FiveTimeDuo }, { currentAdminData }) => {
      
      const getAdminData = await currentAdminData;

      const loggedAdminID = getAdminData[process.env.CUSTOM_RULE_ADMIN]?.adminID === undefined
        ? null
        : getAdminData[process.env.CUSTOM_RULE_ADMIN].adminID;

      try {

        const findCurrentPricing = await Contents.findOne({ value: "Pricing" });

        const updateCurrentPricing = {
          $set: {
            "pricing": {
              "OneTimeSolo": OneTimeSolo,
              "OneTimeDuo": OneTimeDuo,
              "ThreeTimeSolo": ThreeTimeSolo,
              "ThreeTimeDuo": ThreeTimeDuo,
              "FiveTimeSolo": FiveTimeSolo,
              "FiveTimeDuo": FiveTimeDuo,
            }
          }
        };

        if (!findCurrentPricing) {
          const newPricingTemplate = new Contents({
            value: "Pricing",
            pricing: {
              OneTimeSolo: OneTimeSolo,
              OneTimeDuo: OneTimeDuo,
              ThreeTimeSolo: ThreeTimeSolo,
              ThreeTimeDuo: ThreeTimeDuo,
              FiveTimeSolo: FiveTimeSolo,
              FiveTimeDuo: FiveTimeDuo
            },
          });

          await newPricingTemplate.save();
          return {
            response: "There was no records of previous pricing template. Template with default values has been added successfully!"
          };
        };

        if (!loggedAdminID || getAdminData?.errorResponse) {
          throw new Error('Could not update the current prices. You are either not authorized or you are not logged in, please login!')
        } else {

          await Contents.findOneAndUpdate(findCurrentPricing, updateCurrentPricing);
          return {
            response: "You have successfully updated current prices into database!"
          }
        }
      } catch (error) {
        return {
          response: error.message
        };
      };
    },

    updatePhoneNumber: async (_, { getNewNumber }, { currentAdminData }) => {
      const getAdminData = await currentAdminData;

      const loggedAdminID = getAdminData[process.env.CUSTOM_RULE_ADMIN]?.adminID === undefined
        ? null
        : getAdminData[process.env.CUSTOM_RULE_ADMIN].adminID;

      try {

        const findCurrentFooter = await Contents.findOne({ value: "Footer" });
        const updateCurrentPhoneNumber = {
          $set: {
            "footer": {
              "location": {
                "address": findCurrentFooter?.footer.location.address,
                "postalCode": findCurrentFooter?.footer.location.postalCode,
                "city": findCurrentFooter?.footer.location.city,
              },
              "contact": {
                "phoneNumber": getNewNumber,
                "email": findCurrentFooter?.footer.contact.email,
              },
            },
          },
        };

        if (!findCurrentFooter) {
          const newFooterTemplate = new Contents({
            value: "Footer",
            footer: {
              location: {
                address: findCurrentFooter?.footer.location.address,
                postalCode: findCurrentFooter?.footer.location.postalCode,
                city: findCurrentFooter?.footer.location.city,
              },
              contact: {
                phoneNumber: getNewNumber,
                email: null,
              },
            },
          });

          await newFooterTemplate.save();
          return {
            response: "There was no records of previous footer template. Template with default values has been added successfully!"
          };
        };
        
        if (!loggedAdminID || getAdminData?.errorResponse) {
          throw new Error('Could not update the current number. You are either not authorized or you are not logged in, please login!')
        };

        if (!getNewNumber) {
          throw new Error('Could not update the current number, because you are missing required value. Please try again!')
        } else {

          await Contents.collection.findOneAndUpdate(findCurrentFooter, updateCurrentPhoneNumber);
          return {
            response: "You have successfully updated current number into database!"
          }
        }
      } catch (error) {
        return {
          response: error.message
        };
      };
    },

    updateEmail: async (_, { getNewEmail }, { currentAdminData }) => {

      const getAdminData = await currentAdminData;

      const loggedAdminID = getAdminData[process.env.CUSTOM_RULE_ADMIN]?.adminID === undefined
        ? null
        : getAdminData[process.env.CUSTOM_RULE_ADMIN].adminID;

      try {

        const findCurrentFooter = await Contents.findOne({ value: "Footer" });
        const updateCurrentEmail = {
          $set: {
            "footer": {
              "location": {
                "address": findCurrentFooter?.footer.location.address,
                "postalCode": findCurrentFooter?.footer.location.postalCode,
                "city": findCurrentFooter?.footer.location.city,
              },
              "contact": {
                "phoneNumber": findCurrentFooter?.footer.contact.phoneNumber,
                "email": getNewEmail,
              },
            },
          },
        };

        if (!findCurrentFooter) {
          const newFooterTemplate = new Contents({
            value: "Footer",
            footer: {
              location: {
                address: findCurrentFooter?.footer.location.address,
                postalCode: findCurrentFooter?.footer.location.postalCode,
                city: findCurrentFooter?.footer.location.city,
              },
              contact: {
                phoneNumber: null,
                email: getNewEmail,
              },
            },
          });

          await newFooterTemplate.save();
          return {
            response: "There was no records of previous footer template. Template with default values has been added successfully!"
          };
        };
        
        if (!loggedAdminID || getAdminData?.errorResponse) {
          throw new Error('Could not update the current email. You are either not authorized or you are not logged in, please login!')
        };

        if (!getNewEmail) {
          throw new Error('Could not update the current email, because you are missing required value. Please try again!')
        } else {

          await Contents.collection.findOneAndUpdate(findCurrentFooter, updateCurrentEmail);
          return {
            response: "You have successfully updated current email into database!"
          }
        }
      } catch (error) {
        return {
          response: error.message
        };
      };
    },

    updateLocation: async (_, { getNewAddress, getNewPostalCode, getNewCity }, { currentAdminData }) => {

      const getAdminData = await currentAdminData;

      const loggedAdminID = getAdminData[process.env.CUSTOM_RULE_ADMIN]?.adminID === undefined
        ? null
        : getAdminData[process.env.CUSTOM_RULE_ADMIN].adminID;

      try {

        const findCurrentFooter = await Contents.findOne({ value: "Footer" });
        const updateCurrentLocation = {
          $set: {
            "footer": {
              "location": {
                "address": getNewAddress,
                "postalCode": getNewPostalCode,
                "city": getNewCity
              },
              "contact": {
                "phoneNumber": findCurrentFooter?.footer.contact.phoneNumber,
                "email": findCurrentFooter?.footer.contact.email,
              },
            },
          },
        };

        if (!findCurrentFooter) {
          const newFooterTemplate = new Contents({
            value: "Footer",
            footer: {
              location: {
                address: getNewAddress,
                postalCode: getNewPostalCode,
                city: getNewCity,
              },
              contact: {
                phoneNumber: findCurrentFooter?.footer.contact.phoneNumber,
                email: findCurrentFooter?.footer.contact.email,
              }
            },
          });

          await newFooterTemplate.save();
          return {
            response: "There was no records of previous footer template. Template with default values has been added successfully!"
          };
        };

        if (!loggedAdminID || getAdminData?.errorResponse) {
          throw new Error('Could not update the current footer. You are either not authorized or you are not logged in, please login!')
        };

        if (!getNewAddress || !getNewPostalCode || !getNewCity) {
          throw new Error('Could not update the current footer, because you are missing some of the required values. Please try again!')
        } else {

          await Contents.collection.findOneAndUpdate(findCurrentFooter, updateCurrentLocation);
          return {
            response: "You have successfully updated current footer into database!"
          }
        }
      } catch (error) {
        return {
          response: error.message
        };
      };
    },

    updateContent: async (_, { getSource, getElement, getElementValue }, { currentAdminData }) => {
      
      const getAdminData = await currentAdminData;

      const loggedAdminID = getAdminData[process.env.CUSTOM_RULE_ADMIN]?.adminID === undefined
        ? null
        : getAdminData[process.env.CUSTOM_RULE_ADMIN].adminID;
        
      try {

        const findCurrentContent = await Contents.findOne({ value: getSource });
        const updateCurrentContent = {
          $set: {
            ["content." + getElement]: getElementValue
          },
        };

        if (!findCurrentContent) {
          const newContentTemplate = new Contents({
            value: getSource,
            content: {
              [getElement]: getElementValue
            },
          });

          await newContentTemplate.save();
          return {
            response: "There was no records of previous content template. Template with default values has been added successfully!"
          };
        };

        if(!(getElement === "primaryElement" || getElement === "secondaryElement" )) {
          throw new Error('Could not update the current content. You tried to update element, which does not exist currently on the app!')
        };

        if (!loggedAdminID || getAdminData?.errorResponse) {
          throw new Error('Could not update the current content. You are either not authorized or you are not logged in, please login!')
        } else {

          await Contents.collection.findOneAndUpdate(findCurrentContent, updateCurrentContent);
          return {
            response: "You have successfully updated current content into database!"
          }
        }
      } catch (error) {
        return {
          response: error.message
        };
      };
    },
  },
};

module.exports = resolvers;
