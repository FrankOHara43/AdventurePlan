class APIFeatures {
  constructor(query, queryString, aliasOptions) {
    this.query = query;
    this.queryString = queryString;
    this.aliasOptions = aliasOptions;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    let page = 1;
    let limit = 100;
    let sort = '-createdAt';
    let fields = '-__v';

    if (this.aliasOptions) {
      ({ limit, sort, fields } = this.aliasOptions);
    } else {
      if (this.queryString.page) page = this.queryString.page * 1;
      if (this.queryString.limit) limit = this.queryString.limit * 1;
      if (this.queryString.sort)
        sort = this.queryString.sort.split(',').join(' ');
      if (this.queryString.fields)
        fields = this.queryString.fields.split(',').join(' ');
    }

    const skip = (page - 1) * limit;

    this.query = this.query.sort(sort).select(fields).skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;