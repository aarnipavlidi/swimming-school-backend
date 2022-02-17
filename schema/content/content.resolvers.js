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

          await Contents.collection.findOneAndUpdate(findCurrentPricing, updateCurrentPricing);
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
