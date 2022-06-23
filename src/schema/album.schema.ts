import Joi from "joi";

export const create = Joi.object().keys({ 
  title: Joi.string().required(),
  slug: Joi.string().required(),
  artist_id: Joi.number().required(),
});

export const getAll = Joi.object().keys({ 
  skip: Joi.number(),
  limit: Joi.number(),
  keyword: Joi.string().allow('').allow(null),
  publisher: Joi.string().allow('').allow(null),
  artist: Joi.string().allow('').allow(null),
});

export const getPickedAlbums = Joi.object().keys({ 
  type: Joi.string(),
  skip: Joi.number(),
  limit: Joi.number(),
  publisher: Joi.string().allow('').allow(null),
});

export const getGenreAlbums = Joi.object().keys({ 
  slug: Joi.string().allow('').allow(null),
  skip: Joi.number(),
  limit: Joi.number(),
});

export const getOne = Joi.object().keys({ 
  id: Joi.string(),
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

export const search = Joi.object().keys({ 
  skip: Joi.number(),
  limit: Joi.number(),
  keyword: Joi.string().allow('').allow(null),
});
