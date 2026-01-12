// using joi for server side validationn

const Joi = require("joi");
const review = require("./models/review");


// listing server sidde validation

module.exports.listingSchema = Joi.alternatives().try(
  Joi.object({
    listing: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      country: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.string().uri().allow("", null)
    }).required()
  }),
  Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().uri().allow("", null)
  })
);

// review server side validation
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required()
});
