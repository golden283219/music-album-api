import Joi from "joi";

export const create = Joi.object().keys({ 
  title: Joi.string().required(),
  slug: Joi.string().required(),
});

export const upload = Joi.object().keys({ 
  uploadpath: Joi.string().required(),
});

export const getAll = Joi.object().keys({ 
  skip: Joi.number(),
  limit: Joi.number(),
  publisher: Joi.string().allow('').allow(null),
  title: Joi.string().allow('').allow(null),
  genre: Joi.string().allow('').allow(null),
  bpmlow: Joi.string().allow('').allow(null),
  bpmhigh: Joi.string().allow('').allow(null),
  key: Joi.string().allow('').allow(null),
  label: Joi.string().allow('').allow(null),
  artist: Joi.string().allow('').allow(null),
});

export const search = Joi.object().keys({ 
  skip: Joi.number(),
  limit: Joi.number(),
  keyword: Joi.string().allow('').allow(null),
});

export const getGenreTracks = Joi.object().keys({ 
  slug: Joi.string().allow('').allow(null),
  skip: Joi.number(),
  limit: Joi.number(),
});
export const getOne = Joi.object().keys({ 
  slug: Joi.string(),
});

export const getSlug = Joi.object().keys({ 
  slug: Joi.string(),
});

export const update = Joi.object().keys({ 
  title: Joi.string().required(),
  slug: Joi.string().required(),
});

export const destroy = Joi.object().keys({ 
  id: Joi.number(),
});